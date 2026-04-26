package com.unshackled.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO containing the full payload submitted at the end of the onboarding flow.
 */
public record OnboardingRequest(
        @NotBlank(message = "Display name is required")
        @Size(min = 1, max = 50, message = "Display name must be between 1 and 50 characters")
        String displayName,

        @Size(max = 2, message = "Country code must be exactly 2 characters")
        String country,

        @Size(max = 3, message = "Currency code must be exactly 3 characters")
        String currency,

        Boolean isSupporter,

        @NotNull(message = "Quit date is required")
        LocalDate quitDate,

        @NotEmpty(message = "You must select at least one habit to track")
        @Valid
        List<AddHabitRequest> habits
) {}
