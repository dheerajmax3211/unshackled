package com.unshackled.api.config;

import com.unshackled.api.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Spring Security configuration for the Unshackled REST API.
 *
 * <p>Key decisions:
 * <ul>
 *   <li>CSRF disabled — this is a stateless REST API authenticated via JWT</li>
 *   <li>Sessions disabled — fully stateless; every request carries its own JWT</li>
 *   <li>CORS configured via {@link CorsConfig} (separate bean for clarity)</li>
 *   <li>JWT filter inserted before {@link UsernamePasswordAuthenticationFilter}</li>
 *   <li>Public endpoints: health check, Stripe webhooks, auth-related routes</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Enable CORS using the CorsConfig bean
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                // Disable CSRF — REST API uses JWT, not cookies
                .csrf(AbstractHttpConfigurer::disable)

                // Stateless session management — no server-side sessions
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints — no authentication required
                        .requestMatchers(
                                "/api/health",
                                "/api/health/**",
                                "/api/webhooks/stripe",
                                "/api/auth/**",
                                "/api/public/**",
                                "/api/analytics/global",
                                "/api/leaderboard/global"
                        ).permitAll()

                        // All other /api/** endpoints require authentication
                        .requestMatchers("/api/**").authenticated()

                        // Everything else (non-API) is permitted (e.g., actuator)
                        .anyRequest().permitAll()
                )

                // Insert JWT filter before Spring's default auth filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
