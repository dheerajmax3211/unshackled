package com.unshackled.api.repository;

import com.unshackled.api.model.HealthMilestoneModel;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Data access layer for scientific health milestones.
 */
@Repository
@RequiredArgsConstructor
public class HealthMilestoneRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<HealthMilestoneModel> rowMapper = (rs, rowNum) -> new HealthMilestoneModel(
            rs.getObject("id", UUID.class),
            rs.getObject("habit_id", UUID.class),
            rs.getInt("day_offset"),
            rs.getString("title"),
            rs.getString("description"),
            rs.getString("icon"),
            rs.getString("source_note"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    /**
     * Finds all health milestones achieved by a specific habit up to the current day.
     */
    public List<HealthMilestoneModel> findByHabitAndDayRange(UUID habitId, int dayOffset) {
        String sql = "SELECT * FROM health_milestones WHERE habit_id = ? AND day_offset <= ? ORDER BY day_offset ASC";
        return jdbcTemplate.query(sql, rowMapper, habitId, dayOffset);
    }
}
