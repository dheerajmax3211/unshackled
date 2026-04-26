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

    @GetMapping("/vapid-public-key")
    public ResponseEntity<Map<String, String>> getPublicKey() {
        return ResponseEntity.ok(Map.of("publicKey", vapidProperties.getPublicKey()));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody SubscriptionRequest request, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        subscriptionRepository.insert(userId, request.endpoint(), request.p256dh(), request.auth());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(@RequestParam String endpoint) {
        subscriptionRepository.deleteByEndpoint(endpoint);
        return ResponseEntity.ok().build();
    }
}
