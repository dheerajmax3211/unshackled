package com.unshackled.api.dto;

import java.math.BigDecimal;

public record GlobalStats(
    long totalUsers,
    long totalHabitsTracked,
    long totalCleanDays,
    BigDecimal totalMoneySaved
) {}
