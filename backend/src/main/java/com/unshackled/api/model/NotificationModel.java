package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

public record NotificationModel(
        UUID id,
        UUID userId,
        String type,
        String title,
        String body,
        String data, // JSON string
        Boolean isRead,
        Boolean pushSent,
        Boolean emailSent,
        OffsetDateTime createdAt
) {}
