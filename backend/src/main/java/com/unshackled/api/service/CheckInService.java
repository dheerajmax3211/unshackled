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

        // 2. Check for duplicates
        LocalDate date = request.checkinDate() != null ? request.checkinDate() : LocalDate.now();
        if (checkInRepository.existsForToday(userHabit.id(), date)) {
            throw new ValidationException("You have already checked in for this date");
        }

        // 3. Insert CheckIn
        CheckInModel newCheckIn = new CheckInModel(
                null,
                userHabit.id(),
                date,
                request.status(),
                request.note(),
                null
        );
        UUID checkInId = checkInRepository.insert(newCheckIn);
        
        CheckInModel savedCheckIn = checkInRepository.findByUserHabitIdAndDate(userHabit.id(), date)
                .orElseThrow();

        // 4. Recalculate Streak
        streakService.recalculateStreak(userHabit.id());
        
        // Fetch the new computed streak
        StreakModel currentStreakData = streakRepository.findByUserHabitId(userHabit.id())
                .orElseThrow(() -> new IllegalStateException("Streak data missing after recalculation"));

        // 5. Downstream Gamification Triggers
        int xpEarned = 0;
        if ("clean".equals(request.status())) {
            xpEarned = XpService.DAILY_CHECKIN;
            xpService.awardXp(userId, "daily_checkin", xpEarned, checkInId, "Daily clean check-in");
        }
        
        List<BadgeModel> awardedBadges = badgeService.checkAndAwardBadges(userId, userHabit.id());
        List<String> badgeSlugs = awardedBadges.stream().map(BadgeModel::slug).toList();
        
        notificationService.checkMilestones(authUserUuid, userHabit.id(), currentStreakData.currentStreak());
        boolean milestoneReached = List.of(3, 7, 14, 30, 90, 180, 365).contains(currentStreakData.currentStreak());
        
        // 6. Fetch day-specific withdrawal / empathy content (Step B-15 integration)
        String withdrawalMessage = null;
        if (userHabit.quitDate() != null) {
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
