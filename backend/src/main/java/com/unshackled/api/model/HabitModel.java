package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `habits` database table.
 * This is a seed table of predefined habits, not user-created data.
 */
public record HabitModel(
        UUID id,
        String slug,
        String displayName,
        String icon,
        String description,
        Integer sortOrder,
        OffsetDateTime createdAt
) {}
