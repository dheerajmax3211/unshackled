package com.unshackled.api.service;

import com.unshackled.api.dto.OnboardingRequest;
import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.model.UserModel;
import com.unshackled.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service orchestrating the multi-step onboarding flow.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OnboardingService {

    private static final int ONBOARDING_XP = 50;

    private final UserRepository userRepository;
    private final HabitService habitService;
    private final XpService xpService;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Completes the onboarding flow transactionally:
     * 1. Updates the user profile with details and sets onboarding_completed = true.
     * 2. Iterates over the selected habits and tracks them via HabitService.
     * 3. Awards initial onboarding XP.
     */
    @Transactional
    public void completeOnboarding(String userId, OnboardingRequest request) {
        UUID uId = UUID.fromString(userId);

        UserModel user = userRepository.findById(uId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", uId));

        if (user.onboardingCompleted() != null && user.onboardingCompleted()) {
            throw new IllegalStateException("User has already completed onboarding");
        }

        // 1. Update user profile
        String updateSql = """
            UPDATE users SET 
                display_name = ?, 
                country = ?, 
                currency = ?, 
                is_supporter = ?, 
                quit_date = ?, 
                onboarding_completed = TRUE, 
                updated_at = NOW()
            WHERE id = ?
        """;
        jdbcTemplate.update(updateSql,
                request.displayName(),
                request.country() != null ? request.country() : "IN",
                request.currency() != null ? request.currency() : "INR",
                request.isSupporter() != null ? request.isSupporter() : false,
                request.quitDate(),
                uId
        );

        // 2. Insert habits via HabitService (which also initializes streaks)
        request.habits().forEach(habitReq -> {
            habitService.addHabit(userId, userId, habitReq);
        });

        // 3. Award initial onboarding XP
        xpService.awardXp(userId, "onboarding_complete", ONBOARDING_XP, null, "Completed onboarding");

        log.info("User {} successfully completed onboarding with {} tracked habits", uId, request.habits().size());
    }
}
