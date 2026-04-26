package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `user_badges` database table.
 * Tracks which badges a specific user has earned.
 */
public record UserBadgeModel(
        UUID id,
        UUID userId,
        UUID badgeId,
        OffsetDateTime earnedAt
) {}
