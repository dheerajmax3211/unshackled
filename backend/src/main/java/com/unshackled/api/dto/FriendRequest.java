package com.unshackled.api.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for sending a friend request.
 */
public record FriendRequest(
        @NotBlank(message = "Username of the addressee is required")
        String addresseeUsername
) {}
