package com.unshackled.api.controller;

import com.unshackled.api.dto.AddHabitRequest;
import com.unshackled.api.model.HabitModel;
import com.unshackled.api.model.UserHabitModel;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for fetching available habits and managing a user's habits.
 */
@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    /**
     * Get all pre-defined habits (Smoking, Drinking, etc.).
     * Used by the frontend to render the habit selection screen.
     */
    @GetMapping
    public List<HabitModel> getAllHabits() {
        return habitService.getAllHabits();
    }

    /**
     * Get all active and inactive habits tracked by the current user.
     */
    @GetMapping("/mine")
    public List<UserHabitModel> getMyHabits() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return habitService.getUserHabits(authUserId);
    }

    /**
     * Start tracking a new habit.
     */
    @PostMapping("/mine")
    @ResponseStatus(HttpStatus.CREATED)
    public UserHabitModel addHabit(@Valid @RequestBody AddHabitRequest request) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return habitService.addHabit(authUserId, authUserId, request);
    }

    /**
     * Create a new habit for the current authenticated user.
     * This endpoint mirrors the existing {@code /mine} POST endpoint but is
     * exposed at {@code /api/habits} for convenience or external integrations.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserHabitModel createHabit(@Valid @RequestBody AddHabitRequest request) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        // Reuse the service method that handles habit creation and validation.
        return habitService.addHabit(authUserId, authUserId, request);
    }

    /**
     * Update configuration for an existing tracked habit.
     */
    @PutMapping("/mine/{userHabitId}")
    public UserHabitModel updateHabitConfig(
            @PathVariable UUID userHabitId,
            @Valid @RequestBody AddHabitRequest request
    ) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return habitService.updateHabitConfig(authUserId, authUserId, userHabitId, request);
    }

    /**
     * Stop tracking a habit (soft delete / deactivate).
     */
    @DeleteMapping("/mine/{userHabitId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateHabit(@PathVariable UUID userHabitId) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        habitService.deactivateHabit(authUserId, authUserId, userHabitId);
    }
}
