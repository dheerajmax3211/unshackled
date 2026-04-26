package com.unshackled.api.service;

import com.unshackled.api.model.XpEventModel;
import com.unshackled.api.repository.XpEventRepository;
import com.unshackled.api.util.LevelDefinition;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for awarding XP and computing user levels.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class XpService {

    // XP Constants per Task B-10.5
    public static final int DAILY_CHECKIN = 25;
    public static final int STREAK_7_DAYS = 100;
    public static final int STREAK_30_DAYS = 500;
    public static final int STREAK_90_DAYS = 1000;
    public static final int CHALLENGE_RESPONDED = 50;
    public static final int CHALLENGE_APPROVED = 75;
    public static final int JOURNAL_ENTRY = 15;
    public static final int MOOD_LOGGED = 10;
    public static final int FRIEND_ADDED = 20;
    // BADGE_EARNED is variable and passed directly from BadgeService

    private final XpEventRepository xpEventRepository;

    @Transactional
    public void awardXp(String userId, String eventType, int amount, UUID referenceId, String description) {
        if (amount <= 0) return;

        UUID uId = UUID.fromString(userId);

        // Idempotency check: don't award twice for the same referenceId
        if (referenceId != null && xpEventRepository.existsByUserIdAndReferenceId(uId, referenceId)) {
            log.debug("XP already awarded for referenceId: {}. Skipping.", referenceId);
            return;
        }

        XpEventModel event = new XpEventModel(
                null,
                uId,
                eventType,
                amount,
                referenceId,
                description,
                null
        );

        xpEventRepository.insert(event);
        log.info("Awarded {} XP to user {} for {}", amount, userId, eventType);
    }

    public int getTotalXp(String userId) {
        return xpEventRepository.sumByUserId(UUID.fromString(userId));
    }

    public LevelDefinition.Level getUserLevel(String userId) {
        int totalXp = getTotalXp(userId);
        return LevelDefinition.getLevelForXp(totalXp);
    }

    public int getXpToNextLevel(String userId) {
        int totalXp = getTotalXp(userId);
        return LevelDefinition.getXpToNextLevel(totalXp);
    }
}
