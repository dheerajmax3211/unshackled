package com.unshackled.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unshackled.api.model.NotificationModel;
import com.unshackled.api.model.UserModel;
import com.unshackled.api.repository.NotificationRepository;
import com.unshackled.api.repository.UserRepository;
import com.unshackled.api.util.EmailTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Orchestrates push, in-app, and email notifications.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final WebPushService webPushService;
    private final ResendEmailService resendEmailService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final JdbcTemplate jdbcTemplate;

    @Value("${supabase.url:}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key:}")
    private String serviceRoleKey;

    public void sendNotification(UUID userId, String type, String title, String body, Map<String, Object> data, boolean sendEmailIfCritical) {
        String dataJson = "{}";
        try {
            if (data != null) {
                dataJson = objectMapper.writeValueAsString(data);
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize notification data", e);
        }

        // 1. Send Push
        webPushService.sendPush(userId, title, body, data);

        // 2. Insert into DB
        NotificationModel model = new NotificationModel(null, userId, type, title, body, dataJson, false, true, false, null);
        notificationRepository.insert(model);

        // 3. Optional Email fallback for critical events
        if (sendEmailIfCritical) {
            Optional<UserModel> userOpt = userRepository.findById(userId);
            userOpt.ifPresent(user -> {
                // Fix #10: Fetch user email from Supabase auth.users via service-role query
                String targetEmail = fetchUserEmail(userId);
                if (targetEmail == null || targetEmail.isBlank()) {
                    log.warn("No email found for user {}. Skipping email notification.", userId);
                    return;
                }

                String htmlBody = body; // fallback to plain text if no template mapped
                if ("MILESTONE".equals(type)) {
                    String habitName = data != null ? (String) data.get("habitName") : "your habit";
                    int streak = data != null && data.get("streak") instanceof Integer ? (Integer) data.get("streak") : 0;
                    htmlBody = EmailTemplates.getMilestoneEmail(user.username(), habitName, streak);
                } else if ("RELAPSE_EMPATHY".equals(type)) {
                    String habitName = data != null ? (String) data.get("habitName") : "your habit";
                    htmlBody = EmailTemplates.getRelapseRecoveryEmail(user.username(), habitName);
                } else if ("CHALLENGE".equals(type)) {
                    String challengerName = data != null ? (String) data.get("challengerName") : "A friend";
                    String habitName = data != null ? (String) data.get("habitName") : "your habit";
                    htmlBody = EmailTemplates.getChallengeEmail(challengerName, habitName);
                }
                resendEmailService.sendEmail(targetEmail, title, htmlBody);
            });
        }
    }

    /**
     * Fetches the user's email from Supabase auth.users via service-role privileged query.
     * Falls back to null if not available.
     */
    private String fetchUserEmail(UUID userId) {
        try {
            String sql = "SELECT email FROM auth.users WHERE id = ?";
            return jdbcTemplate.queryForObject(sql, String.class, userId);
        } catch (Exception e) {
            log.debug("Could not fetch email from auth.users for user {}: {}", userId, e.getMessage());
            return null;
        }
    }

    public void checkMilestones(UUID userId, UUID userHabitId, int newStreak) {
        List<Integer> milestones = List.of(3, 7, 14, 30, 90, 180, 365);
        if (milestones.contains(newStreak)) {
            sendNotification(
                    userId,
                    "MILESTONE",
                    "Achievement Unlocked! \uD83C\uDF89",
                    "You hit " + newStreak + " days! Incredible work.",
                    Map.of("streak", newStreak, "userHabitId", userHabitId.toString()),
                    true
            );
        }
    }

    public void sendEmpathyMessage(UUID userId, UUID userHabitId) {
        sendNotification(
                userId,
                "RELAPSE_EMPATHY",
                "A stumble, not a fall \uD83E\uDE79",
                "We noticed a slip. Forgive yourself, and let's get back on track.",
                Map.of("userHabitId", userHabitId.toString()),
                true
        );
    }
}
