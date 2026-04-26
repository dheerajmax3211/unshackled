package com.unshackled.api.repository;

import com.unshackled.api.model.WithdrawalModel;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data access layer for withdrawal messages.
 */
@Repository
@RequiredArgsConstructor
public class WithdrawalRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<WithdrawalModel> rowMapper = (rs, rowNum) -> new WithdrawalModel(
            rs.getObject("id", UUID.class),
            rs.getObject("habit_id", UUID.class),
            rs.getInt("day_offset"),
            rs.getString("message"),
            rs.getString("tone"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    /**
     * Finds the most relevant withdrawal message for a specific habit and day.
     * Returns the message for the exact day or the closest day prior to it.
     * Precedence: Habit-specific messages over general messages.
     */
    public Optional<WithdrawalModel> findByHabitAndDay(UUID habitId, int dayOffset) {
        String sql = """
            SELECT * FROM withdrawal_messages 
            WHERE (habit_id = ? OR habit_id IS NULL) 
            AND day_offset <= ? 
            ORDER BY habit_id NULLS LAST, day_offset DESC 
            LIMIT 1
        """;
        List<WithdrawalModel> results = jdbcTemplate.query(sql, rowMapper, habitId, dayOffset);
        return results.stream().findFirst();
    }

    /**
     * Finds all withdrawal messages for all habits on a specific day.
     */
    public List<WithdrawalModel> findForAllHabitsOnDay(int dayOffset) {
        String sql = "SELECT * FROM withdrawal_messages WHERE day_offset = ?";
        return jdbcTemplate.query(sql, rowMapper, dayOffset);
    }
}
