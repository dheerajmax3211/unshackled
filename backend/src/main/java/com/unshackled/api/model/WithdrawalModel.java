package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `withdrawal_messages` database table.
 */
public record WithdrawalModel(
        UUID id,
        UUID habitId,
        int dayOffset,
        String message,
        String tone,
        OffsetDateTime createdAt
) {}
