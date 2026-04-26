package com.unshackled.api.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalTime;

/**
 * Request DTO for updating an existing user profile.
 * All fields are optional; only non-null fields will be updated.
 */
public record UpdateUserRequest(
        @Size(min = 1, max = 50, message = "Display name must be between 1 and 50 characters")
        String displayName,

        String avatarUrl,

        @Size(max = 500, message = "Bio cannot exceed 500 characters")
        String bio,

        // Will be serialized/deserialized as a JSON string in DB
        String notificationPrefs,

        LocalTime dailyReminderTime,

        Boolean leaderboardOptIn
) {}
