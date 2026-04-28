package com.unshackled.api.service;

import com.unshackled.api.dto.CheckInRequest;
import com.unshackled.api.dto.CheckInResponse;
import com.unshackled.api.exception.ForbiddenException;
import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.exception.ValidationException;
import com.unshackled.api.model.BadgeModel;
import com.unshackled.api.model.CheckInModel;
import com.unshackled.api.model.StreakModel;
import com.unshackled.api.model.UserHabitModel;
import com.unshackled.api.model.WithdrawalModel;
import com.unshackled.api.repository.CheckInRepository;
import com.unshackled.api.repository.StreakRepository;
import com.unshackled.api.repository.UserHabitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

/**
 * Service to handle check-in submissions and trigger downstream game mechanics.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final UserHabitRepository userHabitRepository;
    private final StreakService streakService;
    private final StreakRepository streakRepository;
    private final XpService xpService;
    private final BadgeService badgeService;
    private final NotificationService notificationService;
    private final ContentService contentService;

    @Transactional
    public CheckInResponse submitCheckIn(String userId, CheckInRequest request) {
        UUID authUserUuid = UUID.fromString(userId);

        // 1. Validate user owns the habit
        UserHabitModel userHabit = userHabitRepository.findById(request.userHabitId())
                .orElseThrow(() -> new ResourceNotFoundException("UserHabit", "id", request.userHabitId()));

        if (!userHabit.userId().equals(authUserUuid)) {
            throw new ForbiddenException("Cannot check in for a habit you do not own");
        }

        LocalDate date = request.checkinDate() != null ? request.checkinDate() : LocalDate.now();
        
        // 2. Fetch existing check-in for today
        java.util.Optional<CheckInModel> existingOpt = checkInRepository.findByUserHabitIdAndDate(userHabit.id(), date);
        
        CheckInModel savedCheckIn;
        boolean isNew = true;

        if (existingOpt.isPresent()) {
            CheckInModel existing = existingOpt.get();
            
            if ("slipped".equals(existing.status())) {
                throw new ValidationException("You already reported a slip today. Stay strong and focus on tomorrow.");
            }
            
            if ("clean".equals(existing.status()) && "clean".equals(request.status())) {
                throw new ValidationException("You have already checked in as clean for today.");
            }
            
            // Allow Clean -> Slipped transition
            if ("clean".equals(existing.status()) && "slipped".equals(request.status())) {
                checkInRepository.updateStatus(existing.id(), "slipped", request.mood(), request.slipReason(), request.note());
                savedCheckIn = checkInRepository.findByUserHabitIdAndDate(userHabit.id(), date).orElseThrow();
                isNew = false;
                log.info("User {} updated clean check-in to slipped for habit {}", userId, userHabit.id());
            } else {
                throw new ValidationException("Invalid check-in transition.");
            }
        } else {
            // New check-in for today
            CheckInModel newCheckIn = new CheckInModel(
                    null,
                    userHabit.id(),
                    date,
                    request.status(),
                    request.mood(),
                    request.slipReason(),
                    request.note(),
                    null
            );
            checkInRepository.insert(newCheckIn);
            savedCheckIn = checkInRepository.findByUserHabitIdAndDate(userHabit.id(), date).orElseThrow();
        }

        // 3. Recalculate Streak
        streakService.recalculateStreak(userHabit.id());
        
        // Fetch the new computed streak (or the one before the slip for messaging)
        StreakModel currentStreakData = streakRepository.findByUserHabitId(userHabit.id())
                .orElseThrow(() -> new IllegalStateException("Streak data missing after recalculation"));

        // 4. Downstream Gamification Triggers
        int xpEarned = 0;
        if ("clean".equals(request.status()) && isNew) {
            xpEarned = calculateTieredXp(currentStreakData.currentStreak());
            xpService.awardXp(userId, "daily_checkin", xpEarned, savedCheckIn.id(), "Daily clean check-in (Tiered Reward)");
        }
        
        if ("slipped".equals(request.status())) {
            int penalty = calculateRelapsePenalty(currentStreakData.currentStreak());
            xpService.deductXp(userId, "relapse_penalty", penalty, savedCheckIn.id(), "Relapse setback penalty (Tiered Wipeout)");
        }
        
        List<BadgeModel> awardedBadges = badgeService.checkAndAwardBadges(userId, userHabit.id());
        List<String> badgeSlugs = awardedBadges.stream().map(BadgeModel::slug).toList();
        
        notificationService.checkMilestones(authUserUuid, userHabit.id(), currentStreakData.currentStreak());
        boolean milestoneReached = List.of(3, 7, 14, 30, 90, 180, 365).contains(currentStreakData.currentStreak());
        
        // 5. Fetch day-specific withdrawal / empathy content
        String withdrawalMessage = null;
        
        if ("slipped".equals(request.status())) {
            // Custom empathy message based on how long they lasted
            int prevStreak = currentStreakData.longestStreak(); // This might be slightly inaccurate if they just reset, but good enough for encouragement
            if (prevStreak >= 21) {
                withdrawalMessage = "It's alright, you went on for " + prevStreak + " days! That proves you can do it. Let this be your last slip—get back up now.";
            } else if (prevStreak >= 7) {
                withdrawalMessage = "You had a solid week going! Don't let one moment of weakness undo your progress. You've reclaimed your health before, do it again today.";
            } else {
                withdrawalMessage = "Relapses are part of the journey. Take a deep breath, identify the trigger (like " + (request.slipReason() != null ? request.slipReason() : "stress") + "), and start again. You've got this.";
            }
        } else if (userHabit.quitDate() != null) {
            int dayOffset = (int) ChronoUnit.DAYS.between(userHabit.quitDate(), date);
            if (dayOffset >= 0) {
                withdrawalMessage = contentService.getWithdrawalMessage(userHabit.habitId(), dayOffset)
                        .map(WithdrawalModel::message)
                        .orElse(null);
            }
        }

        log.info("Check-in processed for user {} habit {}. New streak: {}", userId, userHabit.id(), currentStreakData.currentStreak());

        return new CheckInResponse(
                savedCheckIn,
                currentStreakData.currentStreak(),
                xpEarned,
                badgeSlugs,
                milestoneReached,
                withdrawalMessage
        );
    }

    private int calculateTieredXp(int streak) {
        if (streak >= 181) return 100; // Tier 5
        if (streak >= 91)  return 75;  // Tier 4
        if (streak >= 29)  return 50;  // Tier 3
        if (streak >= 8)   return 35;  // Tier 2
        return 25;                    // Tier 1
    }

    private int calculateRelapsePenalty(int currentStreak) {
        // Punish based on the highest tier they were in
        // Formula: Sum of (Base XP of crossed tier * 4)
        int totalPenalty = 0;
        
        // Tier 1 (Always crossed if they had a streak)
        totalPenalty += 25 * 4;
        
        // Tier 2 (8-28 days)
        if (currentStreak >= 8) totalPenalty += 35 * 4;
        
        // Tier 3 (29-90 days)
        if (currentStreak >= 29) totalPenalty += 50 * 4;
        
        // Tier 4 (91-180 days)
        if (currentStreak >= 91) totalPenalty += 75 * 4;
        
        // Tier 5 (181+ days)
        if (currentStreak >= 181) totalPenalty += 100 * 4;
        
        return totalPenalty;
    }

    public List<CheckInModel> getCheckInHistory(String userId, UUID userHabitId, int days) {
        // Validate user owns habit
        UserHabitModel userHabit = userHabitRepository.findById(userHabitId)
                .orElseThrow(() -> new ResourceNotFoundException("UserHabit", "id", userHabitId));

        if (!userHabit.userId().toString().equals(userId)) {
            throw new ForbiddenException("Cannot view history for a habit you do not own");
        }

        return checkInRepository.findByUserHabitId(userHabitId, days);
    }

    public boolean hasCheckedInToday(String userId) {
        List<UserHabitModel> habits = userHabitRepository.findByUserId(UUID.fromString(userId));
        
        LocalDate today = LocalDate.now();
        // Returns true if at least one active habit has been checked in today
        for (UserHabitModel habit : habits) {
            if (habit.isActive() && checkInRepository.existsForToday(habit.id(), today)) {
                return true;
            }
        }
        return false;
    }
}
