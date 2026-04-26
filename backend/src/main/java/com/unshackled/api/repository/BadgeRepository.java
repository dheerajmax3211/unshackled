package com.unshackled.api.repository;

import com.unshackled.api.model.BadgeModel;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data access layer for both badges and user_badges.
 */
@Repository
@RequiredArgsConstructor
public class BadgeRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<BadgeModel> badgeRowMapper = (rs, rowNum) -> new BadgeModel(
            rs.getObject("id", UUID.class),
            rs.getString("slug"),
            rs.getString("name"),
            rs.getString("description"),
            rs.getString("icon_url"),
            rs.getString("rarity"),
            rs.getInt("xp_reward"),
            rs.getString("trigger_type"),
            rs.getObject("trigger_value") != null ? rs.getInt("trigger_value") : null,
            rs.getString("habit_slug"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    public List<BadgeModel> findAll() {
        return jdbcTemplate.query("SELECT * FROM badges", badgeRowMapper);
    }

    public Optional<BadgeModel> findBySlug(String slug) {
        String sql = "SELECT * FROM badges WHERE slug = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, badgeRowMapper, slug));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<BadgeModel> findEarnedByUserId(UUID userId) {
        String sql = """
            SELECT b.* FROM badges b
            JOIN user_badges ub ON b.id = ub.badge_id
            WHERE ub.user_id = ?
            ORDER BY ub.earned_at DESC
        """;
        return jdbcTemplate.query(sql, badgeRowMapper, userId);
    }

    public boolean hasEarned(UUID userId, UUID badgeId) {
        String sql = "SELECT COUNT(1) FROM user_badges WHERE user_id = ? AND badge_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId, badgeId);
        return count != null && count > 0;
    }

    public void award(UUID userId, UUID badgeId) {
        String sql = "INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?) ON CONFLICT DO NOTHING";
        jdbcTemplate.update(sql, userId, badgeId);
    }
}
