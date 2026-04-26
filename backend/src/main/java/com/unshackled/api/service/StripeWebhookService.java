package com.unshackled.api.service;

import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.unshackled.api.model.SubscriptionModel;
import com.unshackled.api.repository.SubscriptionRepository;
import com.unshackled.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

/**
 * Service for processing Stripe webhook events and updating internal records.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StripeWebhookService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Transactional
    public void handleCheckoutCompleted(Event event) {
        Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
        if (session == null) {
            log.error("Failed to deserialize Stripe Session from event");
            return;
        }

        String userIdStr = session.getMetadata().get("userId");
        if (userIdStr == null) {
            log.error("No userId found in session metadata for checkout session: {}", session.getId());
            return;
        }

        UUID userId = UUID.fromString(userIdStr);
        String stripeSubId = session.getSubscription();

        log.info("Processing checkout completion for user: {} with subscription: {}", userId, stripeSubId);

        // Update user status
        userRepository.updatePremiumStatus(userId, "premium");

        // Create or update subscription record
        SubscriptionModel subModel = new SubscriptionModel(
                null,
                userId,
                stripeSubId,
                session.getCustomer(),
                "premium",
                "active",
                OffsetDateTime.now(), // Fallback
                null,
                false,
                null,
                null
        );
        subscriptionRepository.upsert(subModel);
    }

    @Transactional
    public void handleSubscriptionUpdated(Event event) {
        Subscription subscription = (Subscription) event.getDataObjectDeserializer().getObject().orElse(null);
        if (subscription == null) return;

        log.info("Processing subscription update for: {}", subscription.getId());

        subscriptionRepository.findByStripeSubscriptionId(subscription.getId()).ifPresent(sub -> {
            SubscriptionModel updated = new SubscriptionModel(
                    sub.id(),
                    sub.userId(),
                    subscription.getId(),
                    subscription.getCustomer(),
                    "premium",
                    subscription.getStatus(),
                    OffsetDateTime.ofInstant(Instant.ofEpochSecond(subscription.getCurrentPeriodStart()), ZoneOffset.UTC),
                    OffsetDateTime.ofInstant(Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()), ZoneOffset.UTC),
                    subscription.getCancelAtPeriodEnd(),
                    sub.createdAt(),
                    OffsetDateTime.now()
            );
            subscriptionRepository.upsert(updated);

            // If status is no longer active/trialing, downgrade user?
            // Actually handleSubscriptionDeleted is for full deletion.
            // But if status is 'past_due' or 'unpaid', we might want to restrict access.
            if (!"active".equals(subscription.getStatus()) && !"trialing".equals(subscription.getStatus())) {
                userRepository.updatePremiumStatus(sub.userId(), "free");
            } else {
                userRepository.updatePremiumStatus(sub.userId(), "premium");
            }
        });
    }

    @Transactional
    public void handleSubscriptionDeleted(Event event) {
        Subscription subscription = (Subscription) event.getDataObjectDeserializer().getObject().orElse(null);
        if (subscription == null) return;

        log.info("Processing subscription deletion for: {}", subscription.getId());

        subscriptionRepository.findByStripeSubscriptionId(subscription.getId()).ifPresent(sub -> {
            userRepository.updatePremiumStatus(sub.userId(), "free");
            subscriptionRepository.updateStatus(subscription.getId(), "canceled");
        });
    }
}
