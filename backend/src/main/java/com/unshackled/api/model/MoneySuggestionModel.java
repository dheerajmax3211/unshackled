package com.unshackled.api.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `money_suggestions` database table.
 */
public record MoneySuggestionModel(
        UUID id,
        String countryCode,
        BigDecimal amountMin,
        BigDecimal amountMax,
        String suggestion,
        String category,
        OffsetDateTime createdAt
) {}
