package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Represents a row in the `dopamine_suggestions` database table.
 */
public record DopamineSuggestionModel(
        UUID id,
        String suggestion,
        String category,
        List<String> habitSlugs,
        String difficulty,
        OffsetDateTime createdAt
) {}
