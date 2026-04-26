package com.unshackled.api.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record WeeklyReportData(
    UUID userId,
    String username,
    int totalCleanDaysThisWeek,
    BigDecimal totalMoneySavedThisWeek,
    List<HabitProgress> habitProgressions
) {
    public record HabitProgress(String habitName, int currentStreak, int daysCleanThisWeek) {}
}
