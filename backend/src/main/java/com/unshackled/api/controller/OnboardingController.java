package com.unshackled.api.controller;

import com.unshackled.api.dto.OnboardingRequest;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.OnboardingService;
import com.unshackled.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for the onboarding flow.
 */
@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final OnboardingService onboardingService;
    private final UserService userService;

    /**
     * Submit the full onboarding payload.
     */
    @PostMapping("/complete")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> completeOnboarding(@Valid @RequestBody OnboardingRequest request) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        onboardingService.completeOnboarding(authUserId, request);
        return Map.of("message", "Onboarding completed successfully");
    }

    /**
     * Check if the authenticated user has completed onboarding.
     * Used by the frontend router to redirect to the dashboard or onboarding flow.
     */
    @GetMapping("/status")
    public Map<String, Boolean> getOnboardingStatus() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        Boolean isCompleted = userService.getUserById(authUserId).onboardingCompleted();
        return Map.of("onboardingCompleted", isCompleted != null ? isCompleted : false);
    }
}
