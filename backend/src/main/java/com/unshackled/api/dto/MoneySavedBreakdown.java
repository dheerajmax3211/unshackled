package com.unshackled.api.dto;

import java.math.BigDecimal;

public record MoneySavedBreakdown(
    BigDecimal today,
    BigDecimal week,
    BigDecimal month,
    BigDecimal allTime
) {}
