package com.unshackled.api.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * Request DTO for sending a challenge to a friend.
 */
public record SendChallengeRequest(
        @NotNull(message = "Challenged user ID is required")
        UUID challengedUserId,

        UUID userHabitId, // Optional, can be null for general challenges

        String message
) {}
