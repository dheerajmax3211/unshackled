package com.unshackled.api.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Data transfer object for creating or updating a journal entry.
 */
public record JournalEntryRequest(
    LocalDate entryDate,
    String content,
    Integer moodScore,
    String moodEmoji,
    List<String> triggers,
    String whatHelped,
    Boolean isShared,
    List<UUID> sharedWith
) {}
