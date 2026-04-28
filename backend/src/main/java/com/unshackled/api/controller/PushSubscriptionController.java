package com.unshackled.api.controller;

import com.unshackled.api.config.VapidProperties;
import com.unshackled.api.dto.SubscriptionRequest;
import com.unshackled.api.repository.PushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
public class PushSubscriptionController {

    private final PushSubscriptionRepository subscriptionRepository;
    private final VapidProperties vapidProperties;
    private final com.unshackled.api.repository.UserRepository userRepository;

    @GetMapping("/vapid-public-key")
    public ResponseEntity<Map<String, String>> getPublicKey() {
        return ResponseEntity.ok(Map.of("publicKey", vapidProperties.getPublicKey()));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody SubscriptionRequest request, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        subscriptionRepository.insert(userId, request.endpoint(), request.p256dh(), request.auth());
        
        return ResponseEntity.ok(Map.of(
            "message", "Notifications enabled! This is a great step to stay committed—we've got your back on this journey."
        ));
    }

    @DeleteMapping("/unsubscribe")
    public ResponseEntity<Map<String, String>> unsubscribe(@RequestParam String endpoint, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        subscriptionRepository.deleteByEndpoint(endpoint);

        String responseMessage = "Unsubscribed successfully. We're always here if you need us!";

        var userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            var user = userOpt.get();
            java.time.LocalDate startDate = user.quitDate() != null ? user.quitDate() : user.createdAt().toLocalDate();
            long days = java.time.temporal.ChronoUnit.DAYS.between(startDate, java.time.LocalDate.now());

            if (days < 30) {
                String dMsg = days <= 0 ? "just starting" : days + " days clean";
                responseMessage = "Unsubscribed. You're still early in your journey (" + dMsg + "). " +
                                  "We recommend staying connected for another few weeks for maximum support!";
            } else if (days < 90) {
                responseMessage = "Unsubscribed. " + days + " days clean is a huge achievement! " +
                                  "Stay vigilant—you've got this, and we're proud of how far you've come.";
            } else {
                responseMessage = "Unsubscribed. " + days + " days clean! We trust that you've built the strength to stay safe and healthy now. " +
                                  "We're so happy to have helped you on this path.";
            }
        }

        return ResponseEntity.ok(Map.of("message", responseMessage));
    }
}
