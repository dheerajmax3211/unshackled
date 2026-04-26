package com.unshackled.api.controller;

import com.unshackled.api.model.StreakModel;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for accessing user streaks.
 */
@RestController
@RequestMapping("/api/streaks")
@RequiredArgsConstructor
public class StreakController {

    private final StreakService streakService;

    @GetMapping
    public List<StreakModel> getAllMyStreaks() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return streakService.getStreakSummary(authUserId);
    }

    @GetMapping("/{userHabitId}")
    public StreakModel getStreakForHabit(@PathVariable UUID userHabitId) {
        // Technically we should check if the userHabitId belongs to the current user,
        // but this is mostly a read operation. We rely on the service fetching it securely
        // or doing validation if needed. For now we just return it if it exists.
        // For strict security, we'll fetch via summary which filters by userId.
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return streakService.getStreakSummary(authUserId).stream()
                .filter(s -> s.userHabitId().equals(userHabitId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Streak not found or unauthorized"));
    }
}
