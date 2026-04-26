package com.unshackled.api.scheduler;

import com.unshackled.api.repository.CheckInRepository;
import com.unshackled.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Scheduled job to follow up with users who recently slipped and haven't resumed their journey.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RelapseFollowUpJob {

    private final CheckInRepository checkInRepository;
    private final NotificationService notificationService;

    /**
     * Runs every hour on the hour.
     */
    @Scheduled(cron = "0 0 * * * *")
    public void followUpOnRelapses() {
        log.info("Starting RelapseFollowUpJob...");

        List<CheckInRepository.CheckInWithUser> pendingFollowUps = checkInRepository.findSlipsForFollowUp();
        if (pendingFollowUps.isEmpty()) return;

        log.info("Found {} slips requiring follow-up support", pendingFollowUps.size());

        for (CheckInRepository.CheckInWithUser slip : pendingFollowUps) {
            try {
                notificationService.sendEmpathyMessage(slip.userId(), slip.userHabitId());
            } catch (Exception e) {
                log.error("Failed to send relapse follow-up to user: {}", slip.userId(), e);
            }
        }

        log.info("RelapseFollowUpJob completed.");
    }
}
