package com.unshackled.api.controller;

import com.stripe.exception.StripeException;
import com.unshackled.api.repository.SubscriptionRepository;
import com.unshackled.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Controller for managing Stripe Checkout, Billing Portal, and subscription status.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final SubscriptionRepository subscriptionRepository;

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> createCheckoutSession(
            @AuthenticationPrincipal String userId,
            @RequestBody Map<String, String> request) throws StripeException {
        
        String successUrl = request.get("successUrl");
        String cancelUrl = request.get("cancelUrl");
        
        String url = paymentService.createCheckoutSession(userId, successUrl, cancelUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/portal")
    public ResponseEntity<Map<String, String>> createPortalSession(
            @AuthenticationPrincipal String userId,
            @RequestBody Map<String, String> request) throws StripeException {
        
        String returnUrl = request.get("returnUrl");
        
        String url = paymentService.createPortalSession(userId, returnUrl);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getSubscriptionStatus(
            @AuthenticationPrincipal String userId) {
        
        var subscription = subscriptionRepository.findByUserId(UUID.fromString(userId));
        
        if (subscription.isPresent()) {
            var sub = subscription.get();
            return ResponseEntity.ok(java.util.Map.of(
                    "status", sub.status(),
                    "tier", sub.plan()
            ));
        }

        return ResponseEntity.ok(java.util.Map.of(
                "status", "inactive",
                "tier", "free"
        ));
    }
}
