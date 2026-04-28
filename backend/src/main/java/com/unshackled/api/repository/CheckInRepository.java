package com.unshackled.api.repository;

import com.unshackled.api.model.CheckInModel;
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
 * Data access layer for the check_ins table.
 */
@Repository
@RequiredArgsConstructor
public class CheckInRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<CheckInModel> rowMapper = (rs, rowNum) -> new CheckInModel(
            rs.getObject("id", UUID.class),
            rs.getObject("user_habit_id", UUID.class),
            rs.getDate("checkin_date").toLocalDate(),
            rs.getString("status"),
            rs.getString("mood"),
            rs.getString("slip_reason"),
            rs.getString("note"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    public UUID insert(CheckInModel model) {
        String sql = """
            INSERT INTO check_ins (user_habit_id, checkin_date, status, mood, slip_reason, note)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING id
        """;
        return jdbcTemplate.queryForObject(sql, UUID.class,
                model.userHabitId(),
                model.checkinDate(),
                model.status(),
                model.mood(),
                model.slipReason(),
                model.note()
        );
    }

    public Optional<CheckInModel> findByUserHabitIdAndDate(UUID userHabitId, LocalDate date) {
        String sql = "SELECT * FROM check_ins WHERE user_habit_id = ? AND checkin_date = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, userHabitId, date));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<CheckInModel> findByUserHabitId(UUID userHabitId, int limit) {
        String sql = "SELECT * FROM check_ins WHERE user_habit_id = ? ORDER BY checkin_date DESC LIMIT ?";
        return jdbcTemplate.query(sql, rowMapper, userHabitId, limit);
    }

    public boolean existsForToday(UUID userHabitId, LocalDate date) {
        String sql = "SELECT COUNT(1) FROM check_ins WHERE user_habit_id = ? AND checkin_date = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userHabitId, date);
        return count != null && count > 0;
    }

    public int countCleanDaysSince(UUID userHabitId, LocalDate date) {
        String sql = "SELECT COUNT(1) FROM check_ins WHERE user_habit_id = ? AND checkin_date >= ? AND status = 'clean'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userHabitId, date);
        return count != null ? count : 0;
    }

    public int countCleanDaysBetween(UUID userHabitId, LocalDate startDate, LocalDate endDate) {
        String sql = "SELECT COUNT(1) FROM check_ins WHERE user_habit_id = ? AND checkin_date BETWEEN ? AND ? AND status = 'clean'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userHabitId, startDate, endDate);
        return count != null ? count : 0;
    }

    public List<CheckInModel> findByUserHabitIdAndDateRange(UUID userHabitId, LocalDate startDate, LocalDate endDate) {
        String sql = "SELECT * FROM check_ins WHERE user_habit_id = ? AND checkin_date BETWEEN ? AND ? ORDER BY checkin_date ASC";
        return jdbcTemplate.query(sql, rowMapper, userHabitId, startDate, endDate);
    }

    public boolean hasSlippedSince(UUID userHabitId, LocalDate date) {
        String sql = "SELECT COUNT(1) FROM check_ins WHERE user_habit_id = ? AND checkin_date >= ? AND status = 'slipped'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userHabitId, date);
        return count != null && count > 0;
    }

    public void updateStatus(UUID id, String status, String mood, String slipReason, String note) {
        String sql = "UPDATE check_ins SET status = ?, mood = ?, slip_reason = ?, note = ? WHERE id = ?";
        jdbcTemplate.update(sql, status, mood, slipReason, note, id);
    }

    public List<CheckInWithUser> findSlipsForFollowUp() {
        // Find slips from 23-25 hours ago where no subsequent clean check-in exists for that habit
        String sql = """
            SELECT ci.id, ci.user_habit_id, uh.user_id, ci.created_at
            FROM check_ins ci
            JOIN user_habits uh ON ci.user_habit_id = uh.id
            WHERE ci.status = 'slipped'
            AND ci.created_at BETWEEN (NOW() - INTERVAL '25 hours') AND (NOW() - INTERVAL '23 hours')
            AND NOT EXISTS (
                SELECT 1 FROM check_ins ci2
                WHERE ci2.user_habit_id = ci.user_habit_id
                AND ci2.status = 'clean'
                AND ci2.created_at > ci.created_at
            )
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> new CheckInWithUser(
                rs.getObject("id", UUID.class),
                rs.getObject("user_habit_id", UUID.class),
                rs.getObject("user_id", UUID.class)
        ));
    }

    public record CheckInWithUser(UUID checkInId, UUID userHabitId, UUID userId) {}
}
