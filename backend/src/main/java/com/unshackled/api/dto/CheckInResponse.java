package com.unshackled.api.dto;

import com.unshackled.api.model.CheckInModel;

import java.util.List;

/**
 * Response DTO returned after submitting a check-in.
 * Contains the downstream effects of the check-in (streaks, xp, badges).
 */
public record CheckInResponse(
        CheckInModel checkIn,
        Integer newStreak,
        Integer xpEarned,
        List<String> badgesEarned,
        Boolean milestoneReached,
        String withdrawalMessage
) {}
