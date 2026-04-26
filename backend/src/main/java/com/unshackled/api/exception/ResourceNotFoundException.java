package com.unshackled.api.exception;

/**
 * Thrown when a requested resource (user, habit, challenge, etc.) does not exist.
 * Results in HTTP 404 Not Found.
 *
 * <p>Usage:
 * <pre>{@code
 *   throw new ResourceNotFoundException("User not found with id: " + userId);
 *   throw new ResourceNotFoundException("Habit", "slug", "smoking");
 * }</pre>
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Convenience constructor for entity-style lookups.
     *
     * @param resourceName the type of resource (e.g., "User", "Habit")
     * @param fieldName    the field used for lookup (e.g., "id", "username")
     * @param fieldValue   the value that was not found
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super("%s not found with %s: %s".formatted(resourceName, fieldName, fieldValue));
    }
}
