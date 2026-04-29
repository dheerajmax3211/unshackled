package com.unshackled.api.dto;

import com.unshackled.api.model.UserModel;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Public response DTO for a user profile.
 * Strips out sensitive fields like stripeCustomerId.
 */
public record UserResponse(
        UUID id,
        String username,
        String displayName,
        String avatarUrl,
        String bio,
        String country,
        String currency,
        Boolean isSupporter,
        Boolean onboardingCompleted,
        LocalDate quitDate,
        String premiumStatus,
        Boolean leaderboardOptIn,
        OffsetDateTime createdAt
) {
    /**
     * Factory method to convert a UserModel into a UserResponse.
     */
    public static UserResponse fromModel(UserModel model) {
        return new UserResponse(
                model.id(),
                model.username(),
                model.displayName(),
                model.avatarUrl(),
                model.bio(),
                model.country(),
                model.currency(),
                model.isSupporter(),
                model.onboardingCompleted(),
                model.quitDate(),
                model.premiumStatus(),
                model.leaderboardOptIn(),
                model.createdAt()
        );
    }
}
