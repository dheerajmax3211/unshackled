package com.unshackled.api.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a row in the `friends` database table.
 * Manages friend requests and the social graph.
 */
public record FriendModel(
        UUID id,
        UUID requesterId,
        UUID addresseeId,
        String status, // 'pending', 'accepted', 'declined', 'blocked'
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
