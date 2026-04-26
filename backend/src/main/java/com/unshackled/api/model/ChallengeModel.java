package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `challenges` database table.
 */
public record ChallengeModel(
        UUID id,
        UUID challengerId,
        UUID challengedId,
        UUID userHabitId,
        String status, // 'pending', 'responded', 'approved', 'rejected', 'expired', 'verification_failed'
        String message,
        OffsetDateTime responseDeadline,
        OffsetDateTime respondedAt,
        OffsetDateTime reviewedAt,
        String reviewerNote,
        Boolean exifVerified,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
