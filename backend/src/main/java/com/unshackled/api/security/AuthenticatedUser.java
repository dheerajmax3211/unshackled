package com.unshackled.api.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * Utility class for extracting the authenticated user's identity from
 * the Spring Security context.
 *
 * <p>The principal is set by {@link JwtAuthFilter} as the user's UUID string
 * (extracted from the Supabase JWT {@code sub} claim).
 *
 * <p>Usage:
 * <pre>{@code
 *   String userId = AuthenticatedUser.getCurrentUserId()
 *       .orElseThrow(() -> new UnauthorizedException("Not authenticated"));
 * }</pre>
 */
public final class AuthenticatedUser {

    private AuthenticatedUser() {
        // Utility class — no instantiation
    }

    /**
     * Returns the authenticated user's UUID as a string.
     *
     * @return {@link Optional} containing the user ID if authenticated,
     *         or empty if no authentication is present in the SecurityContext
     */
    public static Optional<String> getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof String userId && !userId.isBlank()) {
            return Optional.of(userId);
        }

        return Optional.empty();
    }

    /**
     * Returns the authenticated user's UUID, or throws if not authenticated.
     * Convenience method for controllers/services that always require auth.
     *
     * @return the user ID string
     * @throws IllegalStateException if no authenticated user is found
     */
    public static String requireCurrentUserId() {
        return getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException(
                        "No authenticated user found in SecurityContext. " +
                        "This method should only be called from authenticated endpoints."
                ));
    }
}
