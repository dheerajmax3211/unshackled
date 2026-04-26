package com.unshackled.api.exception;

/**
 * Thrown when an authenticated user attempts an action they are not
 * permitted to perform (e.g., accessing premium features on a free plan,
 * modifying another user's data).
 * Results in HTTP 403 Forbidden.
 *
 * <p>Usage:
 * <pre>{@code
 *   throw new ForbiddenException("Premium subscription required");
 *   throw new ForbiddenException("You cannot modify another user's profile");
 * }</pre>
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }
}
