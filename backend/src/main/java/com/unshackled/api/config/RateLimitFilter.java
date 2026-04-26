package com.unshackled.api.config;

import com.unshackled.api.exception.ValidationException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory rate limiter for challenge endpoints.
 * Limits each user to 5 challenge sends per hour per architecture spec 7.3.
 *
 * <p>For production at scale, this should be replaced with Redis-backed rate limiting
 * (e.g., via Spring Cloud Gateway or Resilience4j). This in-memory implementation
 * is suitable for single-instance deployments.</p>
 */
@Slf4j
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // Key: userId, Value: [count, windowStartMillis]
    private final Map<String, long[]> rateLimitMap = new ConcurrentHashMap<>();

    private static final int MAX_CHALLENGES_PER_HOUR = 5;
    private static final long WINDOW_MILLIS = 3600_000L; // 1 hour

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Only rate-limit POST /api/challenges (challenge creation)
        if ("POST".equalsIgnoreCase(request.getMethod()) && "/api/challenges".equals(request.getRequestURI())) {
            String userId = (String) request.getAttribute("authenticatedUserId");
            
            if (userId == null) {
                // Auth hasn't run yet or user is unauthenticated — let SecurityConfig handle it
                filterChain.doFilter(request, response);
                return;
            }

            long now = System.currentTimeMillis();
            long[] bucket = rateLimitMap.computeIfAbsent(userId, k -> new long[]{0, now});

            synchronized (bucket) {
                // Reset window if it's expired
                if (now - bucket[1] > WINDOW_MILLIS) {
                    bucket[0] = 0;
                    bucket[1] = now;
                }

                if (bucket[0] >= MAX_CHALLENGES_PER_HOUR) {
                    log.warn("Rate limit exceeded for user {} on POST /api/challenges", userId);
                    response.setStatus(429);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"You can send a maximum of 5 challenges per hour. Please try again later.\"}");
                    return;
                }

                bucket[0]++;
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Only apply to POST /api/challenges
        return !("POST".equalsIgnoreCase(request.getMethod()) && "/api/challenges".equals(request.getRequestURI()));
    }
}
