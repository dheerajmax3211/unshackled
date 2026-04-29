package com.unshackled.api.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for adding a new habit to a user's tracking list.
 */
public record AddHabitRequest(
        @NotNull(message = "Habit ID is required")
        String habitId,
        
        @NotNull(message = "Quit date is required")
        LocalDate quitDate,
        
        // Smoking
        Integer cigarettesPerDay,
        BigDecimal costPerCigarette,
        
        // Drinking
        Integer drinksPerWeek,
        BigDecimal costPerSession,
        
        // Vaping
        Integer podsPerWeek,
        BigDecimal podCost,
        
        // Time-based
        BigDecimal hoursPerDay,
        List<String> platforms,
        
        // Money-based
        BigDecimal spendPerWeek,
        
        // Custom
        String customDescription,
        BigDecimal customTimePerDay,
        BigDecimal customSpendPerDay
) {}
