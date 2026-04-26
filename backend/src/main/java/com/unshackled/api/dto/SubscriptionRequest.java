package com.unshackled.api.dto;

public record SubscriptionRequest(
        String endpoint,
        String p256dh,
        String auth
) {}
