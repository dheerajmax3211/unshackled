package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PushSubscriptionModel(
        UUID id,
        UUID userId,
        String endpoint,
        String p256dh,
        String auth,
        OffsetDateTime createdAt
) {}
