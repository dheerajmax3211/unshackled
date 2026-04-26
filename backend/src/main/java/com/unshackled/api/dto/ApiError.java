package com.unshackled.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

/**
 * Standard error response DTO returned by all API error handlers.
 *
 * <p>Every error response from the Unshackled API follows this structure,
 * ensuring clients can parse errors consistently.
 *
 * <p>Example JSON:
 * <pre>{@code
 * {
 *   "status": 404,
 *   "error": "Not Found",
 *   "message": "User not found with id: abc-123",
 *   "timestamp": "2026-04-25T06:00:00Z"
 * }
 * }</pre>
 *
 * <p>For validation errors, the {@code fieldErrors} list is populated:
 * <pre>{@code
 * {
 *   "status": 400,
 *   "error": "Validation Error",
 *   "message": "Request validation failed",
 *   "fieldErrors": [
 *     {"field": "username", "message": "must not be blank"},
 *     {"field": "displayName", "message": "size must be between 1 and 100"}
 *   ],
 *   "timestamp": "2026-04-25T06:00:00Z"
 * }
 * }</pre>
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        int status,
        String error,
        String message,
        @JsonFormat(shape = JsonFormat.Shape.STRING)
        Instant timestamp,
        List<FieldError> fieldErrors
) {
    /**
     * Convenience constructor for simple errors (no field errors).
     */
    public ApiError(int status, String error, String message) {
        this(status, error, message, Instant.now(), null);
    }

    /**
     * Full constructor with field-level validation errors.
     */
    public ApiError(int status, String error, String message, List<FieldError> fieldErrors) {
        this(status, error, message, Instant.now(), fieldErrors);
    }

    /**
     * Represents a single field-level validation error.
     */
    public record FieldError(
            String field,
            String message
    ) {}
}
