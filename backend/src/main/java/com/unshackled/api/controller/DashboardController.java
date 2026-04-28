package com.unshackled.api.controller;

import com.unshackled.api.dto.DashboardSummary;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for the main dashboard view.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AnalyticsService analyticsService;

    /**
     * Get a comprehensive summary for the dashboard.
     */
    @GetMapping("/summary")
    public DashboardSummary getDashboardSummary() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return analyticsService.getDashboardSummary(authUserId);
    }
}
