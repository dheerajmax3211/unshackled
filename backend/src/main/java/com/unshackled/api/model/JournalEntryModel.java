package com.unshackled.api.model;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `journal_entries` database table.
 * Stores private user reflections and mood tracking data.
 */
public record JournalEntryModel(
        UUID id,
        UUID userId,
        LocalDate entryDate,
        String content,
        Integer moodScore,
        String moodEmoji,
        String[] triggers,
        String whatHelped,
        Boolean isShared,
        UUID[] sharedWith,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
