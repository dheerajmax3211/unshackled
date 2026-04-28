package com.unshackled.api.model;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `check_ins` database table.
 * Records a user's daily status (clean or slipped) for a habit.
 */
public record CheckInModel(
        UUID id,
        UUID userHabitId,
        LocalDate checkinDate,
        String status, // 'clean' or 'slipped'
        String mood,
        String slipReason,
        String note,
        OffsetDateTime createdAt
) {}
