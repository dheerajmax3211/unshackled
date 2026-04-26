package com.unshackled.api.dto;

import com.unshackled.api.model.BadgeModel;
import com.unshackled.api.model.DopamineSuggestionModel;
import com.unshackled.api.model.WithdrawalModel;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummary(
    List<HabitStreakItem> habits,
    BigDecimal totalSavedToday,
    BigDecimal totalSavedWeek,
    BigDecimal totalSavedMonth,
    BigDecimal totalSavedAllTime,
    int level,
    int xp,
    List<BadgeModel> recentBadges,
    WithdrawalModel todayMessage,
    List<DopamineSuggestionModel> dopamineSuggestions
) {}
