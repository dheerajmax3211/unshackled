package com.unshackled.api.model;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a streak record for a specific user habit.
 * Includes isActive status from the parent habit record.
 */
public record StreakModel(
        UUID id,
        UUID userHabitId,
        int currentStreak,
        int longestStreak,
        LocalDate lastCheckinDate,
        int totalCleanDays,
        Boolean isActive, // Joined from user_habits
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
