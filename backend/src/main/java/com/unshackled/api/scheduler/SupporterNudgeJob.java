package com.unshackled.api.scheduler;

import com.unshackled.api.model.UserHabitModel;
import com.unshackled.api.model.UserModel;
import com.unshackled.api.repository.CheckInRepository;
import com.unshackled.api.repository.UserHabitRepository;
import com.unshackled.api.repository.UserRepository;
import com.unshackled.api.service.ResendEmailService;
import com.unshackled.api.util.EmailTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Scheduled job to nudge supporters with a summary of their friends' progress.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SupporterNudgeJob {

    private final UserRepository userRepository;
    private final UserHabitRepository userHabitRepository;
    private final CheckInRepository checkInRepository;
    private final ResendEmailService emailService;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Runs every Monday at 10 AM UTC.
     */
    @Scheduled(cron = "0 0 10 * * MON")
    public void sendSupporterNudges() {
        log.info("Starting SupporterNudgeJob...");

        List<UserModel> supporters = userRepository.findAllSupporters();
        log.info("Found {} supporters to nudge", supporters.size());

        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);

        for (UserModel supporter : supporters) {
            try {
                List<UserModel> friends = userRepository.findAcceptedFriends(supporter.id());
                if (friends.isEmpty()) continue;

                List<EmailTemplates.FriendRecoverySummary> summaries = new ArrayList<>();

                for (UserModel friend : friends) {
                    List<UserHabitModel> habits = userHabitRepository.findByUserId(friend.id());
                    
                    int totalCleanDays = 0;
                    boolean hadSlip = false;

                    for (UserHabitModel uh : habits) {
                        if (!uh.isActive()) continue;
                        totalCleanDays += checkInRepository.countCleanDaysSince(uh.id(), sevenDaysAgo);
                        if (checkInRepository.hasSlippedSince(uh.id(), sevenDaysAgo)) {
                            hadSlip = true;
                        }
                    }

                    summaries.add(new EmailTemplates.FriendRecoverySummary(
                            friend.displayName(),
                            totalCleanDays,
                            hadSlip
                    ));
                }

                if (!summaries.isEmpty()) {
                    // Fix #10: Fetch supporter email from Supabase auth.users
                    String targetEmail = fetchUserEmail(supporter.id());
                    if (targetEmail != null && !targetEmail.isBlank()) {
                        String htmlBody = EmailTemplates.getSupporterNudgeEmail(supporter.displayName(), summaries);
                        emailService.sendEmail(targetEmail, "Supporter Weekly Nudge", htmlBody);
                    } else {
                        log.debug("No email found for supporter {}. Skipping nudge.", supporter.id());
                    }
                }

            } catch (Exception e) {
                log.error("Failed to send supporter nudge to user: {}", supporter.id(), e);
            }
        }

        log.info("SupporterNudgeJob completed.");
    }

    private String fetchUserEmail(UUID userId) {
        try {
            return jdbcTemplate.queryForObject("SELECT email FROM auth.users WHERE id = ?", String.class, userId);
        } catch (Exception e) {
            log.debug("Could not fetch email for user {}: {}", userId, e.getMessage());
            return null;
        }
    }
}
