package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `badges` database table.
 * This is a seed table of predefined badges.
 */
public record BadgeModel(
        UUID id,
        String slug,
        String name,
        String description,
        String iconUrl,
        String rarity,
        Integer xpReward,
        String triggerType,
        Integer triggerValue,
        String habitSlug,
        OffsetDateTime createdAt
) {}
