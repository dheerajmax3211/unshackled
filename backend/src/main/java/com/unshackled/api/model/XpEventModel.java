package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `xp_events` database table.
 * Tracks all actions that award experience points.
 */
public record XpEventModel(
        UUID id,
        UUID userId,
        String eventType,
        Integer xpAmount,
        UUID referenceId,
        String description,
        OffsetDateTime createdAt
) {}
