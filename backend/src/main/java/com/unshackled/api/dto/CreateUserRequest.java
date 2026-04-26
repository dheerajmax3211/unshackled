package com.unshackled.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating a new user profile immediately after Supabase Auth signup.
 */
public record CreateUserRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
        String username,

        @NotBlank(message = "Display name is required")
        @Size(min = 1, max = 50, message = "Display name must be between 1 and 50 characters")
        String displayName,

        @Size(max = 2, message = "Country code must be exactly 2 characters")
        String country,

        @Size(max = 3, message = "Currency code must be exactly 3 characters")
        String currency,

        Boolean isSupporter
) {}
