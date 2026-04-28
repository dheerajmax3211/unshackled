package com.unshackled.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for updating an existing tracked habit.
 * All fields are optional to support partial updates.
 */
public record UpdateHabitRequest(
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
        BigDecimal customSpendPerDay,
        
        Boolean isActive
) {}
