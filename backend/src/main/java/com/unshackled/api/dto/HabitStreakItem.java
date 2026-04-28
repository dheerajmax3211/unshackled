package com.unshackled.api.dto;

import java.util.UUID;

public record HabitStreakItem(
    UUID userHabitId,
    String habitName,
    String habitIcon,
    int currentStreak,
    boolean isActive
) {}
