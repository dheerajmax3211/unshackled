package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `health_milestones` database table.
 */
public record HealthMilestoneModel(
        UUID id,
        UUID habitId,
        int dayOffset,
        String title,
        String description,
        String icon,
        String sourceNote,
        OffsetDateTime createdAt
) {}
