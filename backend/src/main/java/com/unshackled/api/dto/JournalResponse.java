package com.unshackled.api.dto;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Meaningful response for journal operations.
 */
public record JournalResponse(
    UUID id,
    String message,
    LocalDate entryDate,
    Integer xpEarned
) {}
