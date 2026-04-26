package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `subscriptions` database table.
 * Tracks user premium status and Stripe link.
 */
public record SubscriptionModel(
        UUID id,
        UUID userId,
        String stripeSubscriptionId,
        String stripeCustomerId,
        String plan,
        String status,
        OffsetDateTime currentPeriodStart,
        OffsetDateTime currentPeriodEnd,
        Boolean cancelAtPeriodEnd,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
