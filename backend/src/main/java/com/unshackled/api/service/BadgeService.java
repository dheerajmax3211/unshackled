package com.unshackled.api.service;

import com.unshackled.api.model.BadgeModel;
import com.unshackled.api.model.StreakModel;
import com.unshackled.api.repository.BadgeRepository;
import com.unshackled.api.repository.CheckInRepository;
import com.unshackled.api.repository.ChallengeRepository;
import com.unshackled.api.repository.StreakRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service to check and award badges based on user actions.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final StreakRepository streakRepository;
    private final ChallengeRepository challengeRepository;
    private final CheckInRepository checkInRepository;
    private final AnalyticsService analyticsService;
    private final NotificationService notificationService;
    private final XpService xpService;

    @Transactional
    public List<BadgeModel> checkAndAwardBadges(String userId, UUID userHabitId) {
        UUID uId = UUID.fromString(userId);
        List<BadgeModel> newlyAwarded = new ArrayList<>();

        // 1. Load current state
        StreakModel streak = streakRepository.findByUserHabitId(userHabitId).orElse(null);
        int currentStreak = streak != null ? streak.currentStreak() : 0;
        
        // Load money saved via AnalyticsService
        double totalMoneySaved = analyticsService.getUserSavings(userId);
        
        // Load completed challenges via ChallengeRepository
        int challengesCompleted = challengeRepository.countApprovedByUserId(uId);

        // 2. Fetch all badges
        List<BadgeModel> allBadges = badgeRepository.findAll();

        // 3. Evaluate each badge
        for (BadgeModel badge : allBadges) {
            // Skip if already earned
            if (badgeRepository.hasEarned(uId, badge.id())) {
                continue;
            }

            boolean qualifies = false;
            int threshold = badge.triggerValue() != null ? badge.triggerValue() : 0;

            switch (badge.triggerType()) {
                case "streak_days":
                    qualifies = currentStreak >= threshold;
                    break;
                case "money_saved":
                    qualifies = totalMoneySaved >= threshold;
                    break;
                case "challenges_completed":
                    qualifies = challengesCompleted >= threshold;
                    break;
                case "relapse_recovery":
                    // Fix #8: Implement relapse_recovery badge logic
                    // Earned when user has at least one 'slipped' check-in followed
                    // by 'threshold' consecutive clean days (e.g., 7 for rising_again).
                    qualifies = hasRecoveredFromRelapse(userHabitId, threshold);
                    break;
                default:
                    log.debug("Unknown trigger type: {}", badge.triggerType());
            }

            // 4. Award if qualified
            if (qualifies) {
                badgeRepository.award(uId, badge.id());
                xpService.awardXp(userId, "badge_earned", badge.xpReward(), badge.id(), "Earned badge: " + badge.name());
                
                // Send Notification
                notificationService.sendNotification(
                        uId,
                        "BADGE_EARNED",
                        "New Badge Earned! \uD83C\uDFC5",
                        "You've earned the '" + badge.name() + "' badge. Keep it up!",
                        Map.of("badgeId", badge.id().toString(), "badgeName", badge.name()),
                        false
                );
                
                newlyAwarded.add(badge);
                log.info("Awarded badge '{}' to user {}", badge.name(), userId);
            }
        }

        return newlyAwarded;
    }

    /**
     * Checks whether the user has recovered from a relapse by having at least one
     * 'slipped' check-in followed by 'requiredCleanDays' consecutive clean days.
     */
    private boolean hasRecoveredFromRelapse(UUID userHabitId, int requiredCleanDays) {
        // Get full history in chronological order (oldest first)
        var history = checkInRepository.findByUserHabitIdAndDateRange(
                userHabitId,
                java.time.LocalDate.of(2000, 1, 1),
                java.time.LocalDate.now()
        );

        boolean hadSlip = false;
        int consecutiveClean = 0;

        for (var checkIn : history) {
            if ("slipped".equals(checkIn.status())) {
                hadSlip = true;
                consecutiveClean = 0; // reset clean counter after slip
            } else if ("clean".equals(checkIn.status())) {
                if (hadSlip) {
                    consecutiveClean++;
                    if (consecutiveClean >= requiredCleanDays) {
                        return true; // They bounced back!
                    }
                }
            }
        }

        return false;
    }

    public List<Map<String, Object>> getUserBadges(String userId) {
        UUID uId = UUID.fromString(userId);
        List<BadgeModel> allBadges = badgeRepository.findAll();
        List<BadgeModel> earnedBadges = badgeRepository.findEarnedByUserId(uId);

        // Create a list mapping all badges with their earned status
        return allBadges.stream().map(badge -> {
            boolean isEarned = earnedBadges.stream().anyMatch(eb -> eb.id().equals(badge.id()));
            return Map.<String, Object>of(
                    "badge", badge,
                    "earned", isEarned
            );
        }).collect(Collectors.toList());
    }
}
