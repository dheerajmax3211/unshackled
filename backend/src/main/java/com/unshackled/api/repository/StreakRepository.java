package com.unshackled.api.repository;

import com.unshackled.api.model.StreakModel;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data access layer for the streaks table.
 */
@Repository
@RequiredArgsConstructor
public class StreakRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<StreakModel> rowMapper = (rs, rowNum) -> new StreakModel(
            rs.getObject("id", UUID.class),
            rs.getObject("user_habit_id", UUID.class),
            rs.getInt("current_streak"),
            rs.getInt("longest_streak"),
            rs.getDate("last_checkin_date") != null ? rs.getDate("last_checkin_date").toLocalDate() : null,
            rs.getInt("total_clean_days"),
            rs.getBoolean("is_active"),
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("updated_at", OffsetDateTime.class)
    );

    public Optional<StreakModel> findByUserHabitId(UUID userHabitId) {
        String sql = """
            SELECT s.*, uh.is_active 
            FROM streaks s
            JOIN user_habits uh ON s.user_habit_id = uh.id
            WHERE s.user_habit_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, userHabitId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void upsert(UUID userHabitId, int current, int longest, LocalDate lastDate, int totalClean) {
        String sql = """
            INSERT INTO streaks (user_habit_id, current_streak, longest_streak, last_checkin_date, total_clean_days)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (user_habit_id) DO UPDATE SET
                current_streak = EXCLUDED.current_streak,
                longest_streak = GREATEST(streaks.longest_streak, EXCLUDED.longest_streak),
                last_checkin_date = EXCLUDED.last_checkin_date,
                total_clean_days = EXCLUDED.total_clean_days,
                updated_at = NOW()
        """;
        jdbcTemplate.update(sql, userHabitId, current, longest, lastDate, totalClean);
    }

    public void resetStreak(UUID userHabitId) {
        String sql = "UPDATE streaks SET current_streak = 0, updated_at = NOW() WHERE user_habit_id = ?";
        jdbcTemplate.update(sql, userHabitId);
    }

    public List<StreakModel> findTopStreaksByUserIds(List<UUID> userIds) {
        if (userIds == null || userIds.isEmpty()) return List.of();

        // Convert List<UUID> to Postgres UUID[]
        String sql = """
            SELECT s.*, uh.is_active FROM streaks s
            JOIN user_habits uh ON s.user_habit_id = uh.id
            WHERE uh.user_id = ANY(?)
            ORDER BY s.current_streak DESC
        """;
        
        java.sql.Array userIdsArray = null;
        try {
            // Using Spring's connection to create array is complex, easier to use in-clause or string conversion if driver supports it.
            // But since we use JdbcTemplate, passing UUID[] natively works with modern pgjdbc.
            UUID[] uuids = userIds.toArray(new UUID[0]);
            return jdbcTemplate.query(sql, rowMapper, (Object) uuids);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch top streaks", e);
        }
    }
}
