package com.unshackled.api.repository;

import com.unshackled.api.model.NotificationModel;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class NotificationRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<NotificationModel> rowMapper = (rs, rowNum) -> new NotificationModel(
            rs.getObject("id", UUID.class),
            rs.getObject("user_id", UUID.class),
            rs.getString("type"),
            rs.getString("title"),
            rs.getString("body"),
            rs.getString("data"),
            rs.getBoolean("is_read"),
            rs.getBoolean("push_sent"),
            rs.getBoolean("email_sent"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    public UUID insert(NotificationModel model) {
        String sql = """
            INSERT INTO notifications (user_id, type, title, body, data, push_sent, email_sent)
            VALUES (?, ?, ?, ?, ?::jsonb, ?, ?)
            RETURNING id
        """;
        return jdbcTemplate.queryForObject(sql, UUID.class,
                model.userId(),
                model.type(),
                model.title(),
                model.body(),
                model.data(),
                model.pushSent(),
                model.emailSent()
        );
    }

    public List<NotificationModel> findByUserId(UUID userId, boolean onlyUnread) {
        String sql = "SELECT * FROM notifications WHERE user_id = ?";
        if (onlyUnread) {
            sql += " AND is_read = FALSE";
        }
        sql += " ORDER BY created_at DESC LIMIT 50";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public java.util.Optional<NotificationModel> findById(UUID id) {
        String sql = "SELECT * FROM notifications WHERE id = ?";
        try {
            return java.util.Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return java.util.Optional.empty();
        }
    }

    public void markRead(UUID notificationId) {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE id = ?";
        jdbcTemplate.update(sql, notificationId);
    }

    public int markAllRead(UUID userId) {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE";
        return jdbcTemplate.update(sql, userId);
    }
}
