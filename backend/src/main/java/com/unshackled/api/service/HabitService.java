package com.unshackled.api.service;

import com.unshackled.api.dto.AddHabitRequest;
import com.unshackled.api.exception.ForbiddenException;
import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.exception.ValidationException;
import com.unshackled.api.model.HabitModel;
import com.unshackled.api.model.UserHabitModel;
import com.unshackled.api.repository.HabitRepository;
import com.unshackled.api.repository.UserHabitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserHabitRepository userHabitRepository;
    private final com.unshackled.api.repository.UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    public List<HabitModel> getAllHabits() {
        return habitRepository.findAll();
    }

    public List<UserHabitModel> getUserHabits(String userId) {
        return userHabitRepository.findByUserId(UUID.fromString(userId));
    }

    @Transactional
    public UserHabitModel addHabit(String authUserId, String targetUserId, AddHabitRequest request) {
        if (!authUserId.equals(targetUserId)) {
            throw new ForbiddenException("Cannot add habit for another user");
        }

        UUID uId = UUID.fromString(authUserId);

        // Task B-19.8: Premium gating check
        com.unshackled.api.model.UserModel user = userRepository.findById(uId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", uId));
        
        if (!"premium".equals(user.premiumStatus())) {
            int activeCount = userHabitRepository.countActiveByUserId(uId);
            if (activeCount >= 1) {
                throw new com.unshackled.api.exception.PremiumRequiredException(
                    "Free tier users can only track one active habit. Please upgrade to Sovereign premium for unlimited habits."
                );
            }
        }

        // Ensure habit exists
        habitRepository.findById(request.habitId())
                .orElseThrow(() -> new ResourceNotFoundException("Habit", "id", request.habitId()));

        // Check if user already tracks this habit actively
        userHabitRepository.findByUserIdAndHabitId(uId, request.habitId())
                .ifPresent(h -> {
                    if (h.isActive()) {
                        throw new com.unshackled.api.exception.ValidationException("User is already actively tracking this habit");
                    }
                });

        UserHabitModel newModel = new UserHabitModel(
                null,
                uId,
                request.habitId(),
                request.quitDate(),
                true,
                request.cigarettesPerDay(),
                request.costPerCigarette(),
                request.drinksPerWeek(),
                request.costPerSession(),
                request.podsPerWeek(),
                request.podCost(),
                request.hoursPerDay(),
                request.platforms() != null ? request.platforms().toArray(new String[0]) : null,
                request.spendPerWeek(),
                request.customDescription(),
                request.customTimePerDay(),
                request.customSpendPerDay(),
                null, null
        );

        UUID userHabitId = userHabitRepository.insert(newModel);
        log.info("Added habit {} for user {}", request.habitId(), uId);

        // Task B-6.6 requirement: Create initial streak record
        String streakSql = """
            INSERT INTO streaks (user_habit_id, current_streak, longest_streak, last_checkin_date, total_clean_days)
            VALUES (?, 0, 0, NULL, 0)
        """;
        jdbcTemplate.update(streakSql, userHabitId);

        return userHabitRepository.findById(userHabitId)
                .orElseThrow(() -> new IllegalStateException("Failed to retrieve inserted habit"));
    }

    @Transactional
    public UserHabitModel updateHabitConfig(String authUserId, String targetUserId, UUID userHabitId, AddHabitRequest request) {
        if (!authUserId.equals(targetUserId)) {
            throw new ForbiddenException("Cannot update habit for another user");
        }

        UserHabitModel existing = userHabitRepository.findById(userHabitId)
                .orElseThrow(() -> new ResourceNotFoundException("UserHabit", "id", userHabitId));

        if (!existing.userId().toString().equals(authUserId)) {
            throw new ForbiddenException("This habit belongs to someone else");
        }

        userHabitRepository.update(userHabitId, request);
        log.info("Updated habit config for userHabitId {}", userHabitId);

        return userHabitRepository.findById(userHabitId).orElseThrow();
    }

    @Transactional
    public void deactivateHabit(String authUserId, String targetUserId, UUID userHabitId) {
        if (!authUserId.equals(targetUserId)) {
            throw new ForbiddenException("Cannot deactivate habit for another user");
        }

        UserHabitModel existing = userHabitRepository.findById(userHabitId)
                .orElseThrow(() -> new ResourceNotFoundException("UserHabit", "id", userHabitId));

        if (!existing.userId().toString().equals(authUserId)) {
            throw new ForbiddenException("This habit belongs to someone else");
        }

        userHabitRepository.deactivate(userHabitId);
        log.info("Deactivated userHabitId {}", userHabitId);
    }
}
