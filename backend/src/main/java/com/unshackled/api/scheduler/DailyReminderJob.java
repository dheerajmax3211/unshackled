package com.unshackled.api.scheduler;

import com.unshackled.api.model.UserModel;
import com.unshackled.api.repository.UserRepository;
import com.unshackled.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Scheduled job to send daily reminders to users at their preferred time.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DailyReminderJob {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * Runs every hour on the hour (UTC).
     * 
     * <p>IMPORTANT: The frontend MUST store {@code daily_reminder_time} in UTC.
     * For example, if a user in IST (UTC+5:30) wants a reminder at 9:00 AM local time,
     * the frontend should convert this to 03:30 UTC before saving.
     * This ensures the hour-matching logic works correctly across all timezones.</p>
     */
    @Scheduled(cron = "0 0 * * * *")
    public void sendDailyReminders() {
        int currentHour = OffsetDateTime.now(ZoneOffset.UTC).getHour();
        log.info("Starting DailyReminderJob for UTC hour: {}", currentHour);

        List<UserModel> users = userRepository.findUsersForDailyReminder(currentHour);
        log.info("Found {} users to remind at this hour", users.size());

        for (UserModel user : users) {
            try {
                notificationService.sendNotification(
                        user.id(),
                        "DAILY_REMINDER",
                        "Time for your check-in! \uD83C\uDF1F",
                        "Hi " + user.displayName() + ", staying clean today? Log your progress now!",
                        null,
                        false
                );
            } catch (Exception e) {
                log.error("Failed to send daily reminder to user: {}", user.id(), e);
            }
        }

        log.info("DailyReminderJob completed for UTC hour: {}", currentHour);
    }
}
