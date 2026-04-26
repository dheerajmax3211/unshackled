package com.unshackled.api.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `challenge_media` database table.
 * Holds EXIF metadata and storage references for photographic proof.
 */
public record ChallengeMediaModel(
        UUID id,
        UUID challengeId,
        String storagePath,
        String publicUrl,
        OffsetDateTime exifTimestamp,
        BigDecimal exifGpsLat,
        BigDecimal exifGpsLng,
        String exifRaw, // JSON string
        Boolean isVerified,
        String verificationReason,
        OffsetDateTime createdAt
) {}
