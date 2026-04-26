package com.unshackled.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unshackled.api.config.VapidProperties;
import com.unshackled.api.model.PushSubscriptionModel;
import com.unshackled.api.repository.PushSubscriptionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.stereotype.Service;

import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service responsible for sending Web Push notifications via the VAPID protocol.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebPushService {

    private final VapidProperties vapidProperties;
    private final PushSubscriptionRepository subscriptionRepository;
    // Fix #14: Inject Spring-managed ObjectMapper instead of creating a new instance
    private final ObjectMapper objectMapper;

    private PushService pushService;
    private boolean pushEnabled = false;

    @PostConstruct
    public void init() {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }

        String publicKey = vapidProperties.getPublicKey();
        String privateKey = vapidProperties.getPrivateKey();

        // Fix #30: Validate VAPID keys are real Base64-encoded keys, not placeholders
        if (!isValidVapidKey(publicKey) || !isValidVapidKey(privateKey)) {
            log.warn("WebPush VAPID keys are missing or invalid (placeholder values detected). Push notifications are DISABLED.");
            return;
        }

        try {
            pushService = new PushService();
            pushService.setPublicKey(publicKey);
            pushService.setPrivateKey(privateKey);
            pushService.setSubject(vapidProperties.getSubject() != null ? vapidProperties.getSubject() : "mailto:admin@unshackled.app");
            pushEnabled = true;
            log.info("WebPushService initialized successfully with VAPID keys");
        } catch (GeneralSecurityException e) {
            log.error("Failed to initialize WebPushService — VAPID keys may be malformed: {}", e.getMessage());
            pushEnabled = false;
        }
    }

    /**
     * Validates that a VAPID key is a non-null, non-placeholder, valid Base64url string.
     */
    private boolean isValidVapidKey(String key) {
        if (key == null || key.isBlank()) return false;
        if (key.startsWith("your-") || key.equals("changeme") || key.length() < 20) return false;
        try {
            Base64.getUrlDecoder().decode(key);
            return true;
        } catch (IllegalArgumentException e) {
            // Also try standard Base64 (some keys use standard encoding)
            try {
                Base64.getDecoder().decode(key);
                return true;
            } catch (IllegalArgumentException e2) {
                return false;
            }
        }
    }

    public void sendPush(UUID userId, String title, String body, Map<String, Object> data) {
        if (!pushEnabled || pushService == null) {
            return;
        }

        List<PushSubscriptionModel> subs = subscriptionRepository.findByUserId(userId);
        if (subs.isEmpty()) {
            return;
        }

        try {
            Map<String, Object> payloadMap = Map.of(
                    "title", title,
                    "body", body,
                    "data", data != null ? data : Map.of()
            );
            String payload = objectMapper.writeValueAsString(payloadMap);

            for (PushSubscriptionModel sub : subs) {
                try {
                    Subscription subscription = new Subscription(sub.endpoint(), new Subscription.Keys(sub.p256dh(), sub.auth()));
                    Notification notification = new Notification(subscription, payload);
                    
                    org.apache.http.HttpResponse response = pushService.send(notification);
                    int status = response.getStatusLine().getStatusCode();
                    
                    if (status == 410 || status == 404) {
                        log.info("Push subscription expired or invalid (HTTP {}). Removing endpoint.", status);
                        subscriptionRepository.deleteByEndpoint(sub.endpoint());
                    } else if (status >= 400) {
                        log.error("Push failed with status {}: {}", status, response.getStatusLine().getReasonPhrase());
                    }
                } catch (Exception e) {
                    log.error("Error sending push to endpoint {}: {}", sub.endpoint(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error creating push payload for user {}", userId, e);
        }
    }
}
