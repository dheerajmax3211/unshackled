package com.unshackled.api.scheduler;

import com.unshackled.api.repository.UserHabitRepository;
import com.unshackled.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Scheduled job to send withdrawal warnings to users at critical phases of their recovery.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WithdrawalWarningJob {

    private final UserHabitRepository userHabitRepository;
    private final NotificationService notificationService;

    // Known "hard" day sets per Task B-20.3 — expanded to cover all habit categories
    private static final Set<Integer> NICOTINE_HARD_DAYS = Set.of(3, 7, 14, 21);
    private static final Set<Integer> ALCOHOL_HARD_DAYS = Set.of(2, 3, 4);
    private static final Set<Integer> DOPAMINE_HARD_DAYS = Set.of(3, 7, 14, 30, 45); // pornography, social_media, gambling
    private static final Set<Integer> SUGAR_HARD_DAYS = Set.of(3, 5, 7, 14);

    /**
     * Runs daily at 8:30 AM UTC.
     */
    @Scheduled(cron = "0 30 8 * * *")
    public void sendWithdrawalWarnings() {
        log.info("Starting WithdrawalWarningJob...");
        LocalDate today = LocalDate.now();

        List<UserHabitRepository.UserHabitWithSlug> activeHabits = userHabitRepository.findAllActiveWithSlugs();
        log.info("Found {} active habits to check", activeHabits.size());

        for (UserHabitRepository.UserHabitWithSlug habit : activeHabits) {
            if (habit.quitDate() == null) continue;

            long dayOffset = ChronoUnit.DAYS.between(habit.quitDate(), today);
            int day = (int) dayOffset;
            if (day < 0) continue; // quit date is in the future

            boolean shouldNotify = false;
            String message = "";
            String slug = habit.habitSlug() != null ? habit.habitSlug().toLowerCase() : "";

            switch (slug) {
                case "smoking", "vaping", "chewing_tobacco" -> {
                    if (NICOTINE_HARD_DAYS.contains(day)) {
                        shouldNotify = true;
                        message = "Stay strong! Day " + day + " is a known peak for cravings. You've got this!";
                    }
                }
                case "drinking" -> {
                    if (ALCOHOL_HARD_DAYS.contains(day)) {
                        shouldNotify = true;
                        message = "Day " + day + " of alcohol recovery can be challenging. Your body is adjusting, keep going!";
                    }
                }
                case "pornography" -> {
                    if (DOPAMINE_HARD_DAYS.contains(day)) {
                        shouldNotify = true;
                        message = "Day " + day + " — your brain is rewiring its dopamine pathways. Stay committed, the clarity is coming!";
                    }
                }
                case "social_media" -> {
                    if (DOPAMINE_HARD_DAYS.contains(day)) {
                        shouldNotify = true;
                        message = "Day " + day + " without endless scrolling. Your attention span is healing. Keep going!";
                    }
                }
                case "gambling" -> {
                    if (DOPAMINE_HARD_DAYS.contains(day)) {
                        shouldNotify = true;
                        message = "Day " + day + " — the urge to chase that feeling is normal. You're building real control.";
                    }
                }
                case "sugar_junk_food" -> {
                    if (SUGAR_HARD_DAYS.contains(day)) {
                        shouldNotify = true;
                        message = "Day " + day + " — sugar cravings peak early. Your body is detoxing, stay the course!";
                    }
                }
            }

            if (shouldNotify) {
                try {
                    notificationService.sendNotification(
                            habit.userId(),
                            "WITHDRAWAL_WARNING",
                            "Stay Vigilant! \uD83D\uDCAA",
                            message,
                            Map.of("day", day, "habitSlug", slug),
                            false
                    );
                } catch (Exception e) {
                    log.error("Failed to send withdrawal warning to user: {}", habit.userId(), e);
                }
            }
        }

        log.info("WithdrawalWarningJob completed.");
    }
}
