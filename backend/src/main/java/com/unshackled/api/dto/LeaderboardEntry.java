package com.unshackled.api.dto;

import java.util.UUID;

/**
 * Data transfer object for a single entry on a leaderboard.
 */
public record LeaderboardEntry(
    UUID userId,
    String username,
    String avatarUrl,
    int totalCleanDays,
    int longestStreak,
    int totalXp,
    int level,
    int rank
) {}
