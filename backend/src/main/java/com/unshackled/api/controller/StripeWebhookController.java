package com.unshackled.api.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.unshackled.api.config.StripeConfig;
import com.unshackled.api.service.StripeWebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for receiving and verifying Stripe webhook events.
 */
@Slf4j
@RestController
@RequestMapping("/api/webhooks/stripe")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final StripeConfig stripeConfig;
    private final StripeWebhookService stripeWebhookService;

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;

        try {
            event = Webhook.constructEvent(
                    payload, sigHeader, stripeConfig.getWebhookSecret()
            );
        } catch (SignatureVerificationException e) {
            log.error("Stripe signature verification failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        log.info("Received Stripe webhook event: {}", event.getType());

        // Route by event type
        switch (event.getType()) {
            case "checkout.session.completed":
                stripeWebhookService.handleCheckoutCompleted(event);
                break;
            case "customer.subscription.updated":
                stripeWebhookService.handleSubscriptionUpdated(event);
                break;
            case "customer.subscription.deleted":
                stripeWebhookService.handleSubscriptionDeleted(event);
                break;
            default:
                log.debug("Ignored unhandled event type: {}", event.getType());
                break;
        }

        return ResponseEntity.ok("Received");
    }
}
