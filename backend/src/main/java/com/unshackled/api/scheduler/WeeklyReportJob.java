package com.unshackled.api.scheduler;

import com.unshackled.api.dto.WeeklyReportData;
import com.unshackled.api.model.UserModel;
import com.unshackled.api.repository.UserRepository;
import com.unshackled.api.service.AnalyticsService;
import com.unshackled.api.service.ResendEmailService;
import com.unshackled.api.util.EmailTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Scheduled job to send weekly progress reports to users via email.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WeeklyReportJob {

    private final UserRepository userRepository;
    private final AnalyticsService analyticsService;
    private final ResendEmailService emailService;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Runs every Monday at 9 AM UTC.
     */
    @Scheduled(cron = "0 0 9 * * MON")
    public void sendWeeklyReports() {
        log.info("Starting WeeklyReportJob...");

        List<UserModel> users = userRepository.findUsersForWeeklyReport();
        log.info("Found {} users opted-in for weekly reports", users.size());

        for (UserModel user : users) {
            try {
                // Fix #10: Fetch user email from Supabase auth.users
                String targetEmail = fetchUserEmail(user.id());
                if (targetEmail == null || targetEmail.isBlank()) {
                    log.debug("No email found for user {}. Skipping weekly report.", user.id());
                    continue;
                }

                WeeklyReportData data = analyticsService.getWeeklyReportData(user.id());
                String htmlBody = EmailTemplates.getWeeklyReportEmail(data);
                
                emailService.sendEmail(targetEmail, "Your Weekly Recovery Report", htmlBody);
            } catch (Exception e) {
                log.error("Failed to send weekly report to user: {}", user.id(), e);
            }
        }

        log.info("WeeklyReportJob completed.");
    }

    private String fetchUserEmail(java.util.UUID userId) {
        try {
            return jdbcTemplate.queryForObject("SELECT email FROM auth.users WHERE id = ?", String.class, userId);
        } catch (Exception e) {
            log.debug("Could not fetch email for user {}: {}", userId, e.getMessage());
            return null;
        }
    }
}
