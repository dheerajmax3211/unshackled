package com.unshackled.api.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `user_habits` database table.
 * This tracks a specific habit a user is trying to quit, along with their specific config.
 */
public record UserHabitModel(
        UUID id,
        UUID userId,
        UUID habitId,
        LocalDate quitDate,
        Boolean isActive,
        
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
        String[] platforms,
        
        // Money-based
        BigDecimal spendPerWeek,
        
        // Custom
        String customDescription,
        BigDecimal customTimePerDay,
        BigDecimal customSpendPerDay,
        
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
