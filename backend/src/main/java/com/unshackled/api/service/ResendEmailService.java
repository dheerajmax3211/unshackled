package com.unshackled.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Service for sending transactional emails via the Resend API.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ResendEmailService {

    private final RestTemplate restTemplate;

    @Value("${resend.api-key:}")
    private String resendApiKey;

    @Value("${resend.from-email:noreply@unshackled.app}")
    private String fromEmail;

    private static final String RESEND_URL = "https://api.resend.com/emails";

    public void sendEmail(String to, String subject, String htmlBody) {
        if (resendApiKey == null || resendApiKey.isEmpty()) {
            log.warn("Resend API key is missing. Email to {} aborted.", to);
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> body = Map.of(
                    "from", "Unshackled <" + fromEmail + ">",
                    "to", List.of(to),
                    "subject", subject,
                    "html", htmlBody
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(RESEND_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Successfully sent email to {}", to);
            } else {
                log.error("Failed to send email to {}. Response: {}", to, response.getBody());
            }
        } catch (Exception e) {
            log.error("Exception occurred while sending email to {}", to, e);
        }
    }
}
