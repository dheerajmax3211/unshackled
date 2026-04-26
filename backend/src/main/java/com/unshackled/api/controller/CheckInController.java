package com.unshackled.api.controller;

import com.unshackled.api.dto.CheckInRequest;
import com.unshackled.api.dto.CheckInResponse;
import com.unshackled.api.model.CheckInModel;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.CheckInService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for submitting daily check-ins.
 */
@RestController
@RequestMapping("/api/checkins")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CheckInResponse submitCheckIn(@Valid @RequestBody CheckInRequest request) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return checkInService.submitCheckIn(authUserId, request);
    }

    @GetMapping("/history/{userHabitId}")
    public List<CheckInModel> getCheckInHistory(
            @PathVariable UUID userHabitId,
            @RequestParam(defaultValue = "30") int days
    ) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return checkInService.getCheckInHistory(authUserId, userHabitId, days);
    }

    @GetMapping("/today")
    public Map<String, Boolean> getTodayStatus() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        boolean status = checkInService.hasCheckedInToday(authUserId);
        return Map.of("hasCheckedInToday", status);
    }
}
