package com.unshackled.api.model;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `streaks` database table.
 * Core game mechanic updated upon each check-in.
 */
public record StreakModel(
        UUID id,
        UUID userHabitId,
        Integer currentStreak,
        Integer longestStreak,
        LocalDate lastCheckinDate,
        Integer totalCleanDays,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
