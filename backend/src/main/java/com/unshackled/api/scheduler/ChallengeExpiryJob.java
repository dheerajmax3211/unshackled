package com.unshackled.api.scheduler;

import com.unshackled.api.model.ChallengeModel;
import com.unshackled.api.repository.ChallengeRepository;
import com.unshackled.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Scheduled job to handle challenges that have passed their response deadline.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ChallengeExpiryJob {

    private final ChallengeRepository challengeRepository;
    private final NotificationService notificationService;

    /**
     * Runs every 60 seconds.
     */
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void processExpiredChallenges() {
        List<ChallengeModel> expired = challengeRepository.findExpiredPending();
        if (expired.isEmpty()) return;

        log.info("Found {} expired challenges to process", expired.size());

        for (ChallengeModel challenge : expired) {
            try {
                // 1. Update status to expired
                challengeRepository.updateStatus(challenge.id(), "expired", null, null, null, "Auto-expired by system");

                // 2. Notify Challenger
                notificationService.sendNotification(
                        challenge.challengerId(),
                        "CHALLENGE_EXPIRED",
                        "Challenge Expired \u23F3",
                        "The accountability challenge you sent has expired without a response.",
                        Map.of("challengeId", challenge.id().toString()),
                        false
                );

                // 3. Notify Challenged User
                notificationService.sendNotification(
                        challenge.challengedId(),
                        "CHALLENGE_MISSED",
                        "Challenge Missed! \u274C",
                        "You missed the response deadline for a challenge. Stay vigilant!",
                        Map.of("challengeId", challenge.id().toString()),
                        true // Critical enough for email fallback? Yes.
                );

            } catch (Exception e) {
                log.error("Failed to process expired challenge: {}", challenge.id(), e);
            }
        }
    }
}
