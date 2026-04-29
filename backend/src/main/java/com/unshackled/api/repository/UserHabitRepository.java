package com.unshackled.api.repository;

import com.unshackled.api.dto.UpdateHabitRequest;
import com.unshackled.api.model.UserHabitModel;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Array;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data access layer for the user_habits table.
 */
@Repository
@RequiredArgsConstructor
public class UserHabitRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<UserHabitModel> rowMapper = (rs, rowNum) -> {
        Array platformsArray = rs.getArray("platforms");
        String[] platforms = platformsArray != null ? (String[]) platformsArray.getArray() : null;

        return new UserHabitModel(
                rs.getObject("id", UUID.class),
                rs.getObject("user_id", UUID.class),
                rs.getObject("habit_id", UUID.class),
                rs.getDate("quit_date") != null ? rs.getDate("quit_date").toLocalDate() : null,
                rs.getBoolean("is_active"),
                rs.getObject("cigarettes_per_day") != null ? rs.getInt("cigarettes_per_day") : null,
                rs.getBigDecimal("cost_per_cigarette"),
                rs.getObject("drinks_per_week") != null ? rs.getInt("drinks_per_week") : null,
                rs.getBigDecimal("cost_per_session"),
                rs.getObject("pods_per_week") != null ? rs.getInt("pods_per_week") : null,
                rs.getBigDecimal("pod_cost"),
                rs.getBigDecimal("hours_per_day"),
                platforms,
                rs.getBigDecimal("spend_per_week"),
                rs.getString("custom_description"),
                rs.getBigDecimal("custom_time_per_day"),
                rs.getBigDecimal("custom_spend_per_day"),
                rs.getObject("created_at", OffsetDateTime.class),
                rs.getObject("updated_at", OffsetDateTime.class)
        );
    };

    public Optional<UserHabitModel> findById(UUID id) {
        String sql = "SELECT * FROM user_habits WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<UserHabitModel> findByUserId(UUID userId) {
        String sql = "SELECT * FROM user_habits WHERE user_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public Optional<UserHabitModel> findByUserIdAndHabitId(UUID userId, UUID habitId) {
        String sql = "SELECT * FROM user_habits WHERE user_id = ? AND habit_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, userId, habitId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public UUID insert(UserHabitModel model) {
        String sql = """
            INSERT INTO user_habits (
                user_id, habit_id, quit_date, cigarettes_per_day, cost_per_cigarette,
                drinks_per_week, cost_per_session, pods_per_week, pod_cost,
                hours_per_day, platforms, spend_per_week, custom_description,
                custom_time_per_day, custom_spend_per_day
            ) VALUES (
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?
            ) RETURNING id
        """;

        String[] platformsArray = model.platforms() != null ? model.platforms() : new String[0];

        return jdbcTemplate.queryForObject(sql, UUID.class,
                model.userId(), model.habitId(), model.quitDate(),
                model.cigarettesPerDay(), model.costPerCigarette(),
                model.drinksPerWeek(), model.costPerSession(),
                model.podsPerWeek(), model.podCost(),
                model.hoursPerDay(),
                platformsArray.length > 0 ? platformsArray : null,
                model.spendPerWeek(), model.customDescription(),
                model.customTimePerDay(), model.customSpendPerDay()
        );
    }

    public void update(UUID id, UpdateHabitRequest request) {
        StringBuilder sql = new StringBuilder("UPDATE user_habits SET updated_at = NOW()");
        List<Object> params = new ArrayList<>();

        if (request.quitDate() != null) {
            sql.append(", quit_date = ?");
            params.add(request.quitDate());
        }

        if (request.cigarettesPerDay() != null) {
            sql.append(", cigarettes_per_day = ?");
            params.add(request.cigarettesPerDay());
        }
        if (request.costPerCigarette() != null) {
            sql.append(", cost_per_cigarette = ?");
            params.add(request.costPerCigarette());
        }
        if (request.drinksPerWeek() != null) {
            sql.append(", drinks_per_week = ?");
            params.add(request.drinksPerWeek());
        }
        if (request.costPerSession() != null) {
            sql.append(", cost_per_session = ?");
            params.add(request.costPerSession());
        }
        if (request.podsPerWeek() != null) {
            sql.append(", pods_per_week = ?");
            params.add(request.podsPerWeek());
        }
        if (request.podCost() != null) {
            sql.append(", pod_cost = ?");
            params.add(request.podCost());
        }
        if (request.hoursPerDay() != null) {
            sql.append(", hours_per_day = ?");
            params.add(request.hoursPerDay());
        }
        if (request.platforms() != null && !request.platforms().isEmpty()) {
            sql.append(", platforms = ?");
            params.add(request.platforms().toArray(new String[0]));
        }
        if (request.spendPerWeek() != null) {
            sql.append(", spend_per_week = ?");
            params.add(request.spendPerWeek());
        }
        if (request.customDescription() != null) {
            sql.append(", custom_description = ?");
            params.add(request.customDescription());
        }
        if (request.customTimePerDay() != null) {
            sql.append(", custom_time_per_day = ?");
            params.add(request.customTimePerDay());
        }
        if (request.customSpendPerDay() != null) {
            sql.append(", custom_spend_per_day = ?");
            params.add(request.customSpendPerDay());
        }
        if (request.isActive() != null) {
            sql.append(", is_active = ?");
            params.add(request.isActive());
        }

        sql.append(" WHERE id = ?");
        params.add(id);

        jdbcTemplate.update(sql.toString(), params.toArray());
    }

    public void deactivate(UUID id) {
        String sql = "UPDATE user_habits SET is_active = FALSE, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public int countActiveByUserId(UUID userId) {
        String sql = "SELECT COUNT(1) FROM user_habits WHERE user_id = ? AND is_active = TRUE";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId);
        return count != null ? count : 0;
    }

    public List<UserHabitWithSlug> findAllActiveWithSlugs() {
        String sql = """
            SELECT uh.user_id, uh.id as user_habit_id, uh.quit_date, h.slug, uh.habit_id
            FROM user_habits uh
            JOIN habits h ON uh.habit_id = h.id
            WHERE uh.is_active = TRUE
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> new UserHabitWithSlug(
                rs.getObject("user_id", UUID.class),
                rs.getObject("user_habit_id", UUID.class),
                rs.getObject("habit_id", UUID.class),
                rs.getDate("quit_date") != null ? rs.getDate("quit_date").toLocalDate() : null,
                rs.getString("slug")
        ));
    }

    public record UserHabitWithSlug(UUID userId, UUID userHabitId, UUID habitId, java.time.LocalDate quitDate, String habitSlug) {}
}
