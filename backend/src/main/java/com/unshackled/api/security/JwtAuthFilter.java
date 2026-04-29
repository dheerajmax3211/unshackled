package com.unshackled.api.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.unshackled.api.config.SupabaseJwtProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT authentication filter that validates Supabase-issued tokens on every request.
 *
 * <p>Flow:
 * <ol>
 *   <li>Extract {@code Authorization: Bearer <token>} header</li>
 *   <li>Decode and verify JWT using Supabase JWT secret (HS256)</li>
 *   <li>Extract {@code sub} claim as the authenticated user's UUID</li>
 *   <li>Set {@link UsernamePasswordAuthenticationToken} in {@link SecurityContextHolder}</li>
 * </ol>
 *
 * <p>If the token is missing, the filter passes through (Spring Security will deny
 * unauthenticated requests on protected endpoints). If the token is present but
 * invalid, the filter returns 401 immediately.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final SupabaseJwtProperties supabaseProperties;
    private com.auth0.jwk.JwkProvider jwkProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // No Authorization header — let Spring Security handle access denial
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(BEARER_PREFIX.length());

        try {
            DecodedJWT decodedJWT = JWT.decode(token);
            String alg = decodedJWT.getAlgorithm();
            Algorithm algorithm;
            
            if ("HS256".equals(alg)) {
                // Decode the Base64 JWT secret provided by Supabase
                byte[] decodedSecret;
                try {
                    decodedSecret = java.util.Base64.getDecoder().decode(supabaseProperties.getJwtSecret());
                } catch (Exception e) {
                    decodedSecret = supabaseProperties.getJwtSecret().getBytes(java.nio.charset.StandardCharsets.UTF_8);
                }
                algorithm = Algorithm.HMAC256(decodedSecret);
            } else if ("ES256".equals(alg) || "RS256".equals(alg)) {
                if (jwkProvider == null) {
                    jwkProvider = new com.auth0.jwk.UrlJwkProvider(
                            java.net.URI.create(supabaseProperties.getUrl() + "/auth/v1/.well-known/jwks.json").toURL()
                    );
                }
                com.auth0.jwk.Jwk jwk = jwkProvider.get(decodedJWT.getKeyId());
                if ("ES256".equals(alg)) {
                    algorithm = Algorithm.ECDSA256((java.security.interfaces.ECPublicKey) jwk.getPublicKey(), null);
                } else {
                    algorithm = Algorithm.RSA256((java.security.interfaces.RSAPublicKey) jwk.getPublicKey(), null);
                }
            } else {
                throw new JWTVerificationException("Unsupported algorithm: " + alg);
            }

            JWTVerifier verifier = JWT.require(algorithm)
                    .acceptLeeway(5) // 5-second leeway for clock skew
                    .build();

            decodedJWT = verifier.verify(token);

            // Extract the user ID from the 'sub' claim
            String userId = decodedJWT.getSubject();
            if (userId == null || userId.isBlank()) {
                log.warn("JWT verified but 'sub' claim is missing or empty");
                sendUnauthorized(response, "Invalid token: missing subject");
                return;
            }

            // Build authentication token and set in SecurityContext
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,                     // principal = user UUID string
                            null,                       // credentials (not needed)
                            Collections.emptyList()     // authorities (not used yet)
                    );
            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.debug("Authenticated user: {}", userId);

        } catch (Exception e) {
            log.warn("JWT verification failed: {}", e.getMessage());
            sendUnauthorized(response, "Invalid or expired token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Sends a 401 Unauthorized JSON response.
     */
    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(
                "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"%s\"}".formatted(message)
        );
    }
}
