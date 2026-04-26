package com.unshackled.api.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `users` database table.
 * Used internally by repositories; not exposed directly to the API.
 */
public record UserModel(
        UUID id, // Maps to UUID in Postgres
        String username,
        String displayName,
        String avatarUrl,
        String bio,
        String country,
        String currency,
        Boolean isSupporter,
        Boolean onboardingCompleted,
        LocalDate quitDate,
        String pushSubscription, // JSONB stored as String
        String notificationPrefs, // JSONB stored as String
        LocalTime dailyReminderTime,
        String premiumStatus,
        String stripeCustomerId,
        Boolean leaderboardOptIn,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
