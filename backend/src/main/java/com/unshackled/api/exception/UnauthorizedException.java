package com.unshackled.api.exception;

/**
 * Thrown when a request lacks valid authentication or the authenticated user
 * is not permitted to perform the requested operation.
 * Results in HTTP 401 Unauthorized.
 *
 * <p>Usage:
 * <pre>{@code
 *   throw new UnauthorizedException("Not authenticated");
 *   throw new UnauthorizedException("You do not have permission to modify this resource");
 * }</pre>
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException() {
        super("Authentication required");
    }
}
