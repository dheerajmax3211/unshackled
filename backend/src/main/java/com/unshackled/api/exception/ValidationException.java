package com.unshackled.api.exception;

/**
 * Thrown when request data fails business-level validation
 * (beyond what Bean Validation catches).
 * Results in HTTP 400 Bad Request.
 *
 * <p>Usage:
 * <pre>{@code
 *   throw new ValidationException("Quit date cannot be in the past");
 *   throw new ValidationException("Check-in already exists for this date");
 * }</pre>
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }
}
