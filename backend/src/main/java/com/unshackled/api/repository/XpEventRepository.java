package com.unshackled.api.repository;

import com.unshackled.api.model.XpEventModel;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Data access layer for xp_events.
 */
@Repository
@RequiredArgsConstructor
public class XpEventRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<XpEventModel> rowMapper = (rs, rowNum) -> new XpEventModel(
            rs.getObject("id", UUID.class),
            rs.getObject("user_id", UUID.class),
            rs.getString("event_type"),
            rs.getInt("xp_amount"),
            rs.getObject("reference_id", UUID.class),
            rs.getString("description"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    public void insert(XpEventModel model) {
        String sql = """
            INSERT INTO xp_events (user_id, event_type, xp_amount, reference_id, description)
            VALUES (?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                model.userId(),
                model.eventType(),
                model.xpAmount(),
                model.referenceId(),
                model.description()
        );
    }

    public int sumByUserId(UUID userId) {
        String sql = "SELECT SUM(xp_amount) FROM xp_events WHERE user_id = ?";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class, userId);
        return total != null ? total : 0;
    }

    public List<XpEventModel> findByUserId(UUID userId, int limit) {
        String sql = "SELECT * FROM xp_events WHERE user_id = ? ORDER BY created_at DESC LIMIT ?";
        return jdbcTemplate.query(sql, rowMapper, userId, limit);
    }

    public boolean existsByUserIdAndReferenceId(UUID userId, UUID referenceId) {
        if (referenceId == null) return false;
        String sql = "SELECT COUNT(1) FROM xp_events WHERE user_id = ? AND reference_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId, referenceId);
        return count != null && count > 0;
    }
}
