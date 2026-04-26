package com.unshackled.api.controller;

import com.unshackled.api.dto.LeaderboardEntry;
import com.unshackled.api.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for social and global ranking leaderboards.
 */
@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/friends")
    public ResponseEntity<List<LeaderboardEntry>> getFriendLeaderboard(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(leaderboardService.getFriendLeaderboard(userId));
    }

    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardEntry>> getGlobalLeaderboard(
            @RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard(limit));
    }
}
