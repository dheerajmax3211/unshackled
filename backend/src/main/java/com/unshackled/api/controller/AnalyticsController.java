package com.unshackled.api.controller;

import com.unshackled.api.dto.DashboardSummary;
import com.unshackled.api.dto.GlobalStats;
import com.unshackled.api.dto.HeatmapItem;
import com.unshackled.api.dto.MoneySavedBreakdown;
import com.unshackled.api.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummary> getDashboard(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(analyticsService.getDashboardSummary(userId));
    }

    @GetMapping("/money/{userHabitId}")
    public ResponseEntity<MoneySavedBreakdown> getMoneySaved(@PathVariable UUID userHabitId) {
        return ResponseEntity.ok(analyticsService.getMoneySaved(userHabitId));
    }

    @GetMapping("/heatmap/{userHabitId}")
    public ResponseEntity<List<HeatmapItem>> getHeatmap(
            @PathVariable UUID userHabitId,
            @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(analyticsService.getHeatmapData(userHabitId, months));
    }

    @GetMapping("/global")
    public ResponseEntity<GlobalStats> getGlobalStats() {
        return ResponseEntity.ok(analyticsService.getGlobalStats());
    }
}
