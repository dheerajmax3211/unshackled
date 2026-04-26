package com.unshackled.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Request DTO for submitting a daily check-in.
 */
public record CheckInRequest(
        @NotNull(message = "User Habit ID is required")
        UUID userHabitId,

        @NotNull(message = "Status is required")
        @Pattern(regexp = "^(clean|slipped)$", message = "Status must be 'clean' or 'slipped'")
        String status,

        String note,

        LocalDate checkinDate
) {
    public CheckInRequest {
        if (checkinDate == null) {
            checkinDate = LocalDate.now();
        }
    }
}
