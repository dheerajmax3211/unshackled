package com.unshackled.api.repository;

import com.unshackled.api.model.PushSubscriptionModel;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PushSubscriptionRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<PushSubscriptionModel> rowMapper = (rs, rowNum) -> new PushSubscriptionModel(
            rs.getObject("id", UUID.class),
            rs.getObject("user_id", UUID.class),
            rs.getString("endpoint"),
            rs.getString("p256dh_key"),
            rs.getString("auth_key"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    public void insert(UUID userId, String endpoint, String p256dh, String auth) {
        String sql = """
            INSERT INTO push_subscriptions (user_id, endpoint, p256dh_key, auth_key)
            VALUES (?, ?, ?, ?)
            ON CONFLICT (user_id, endpoint) DO UPDATE 
            SET p256dh_key = EXCLUDED.p256dh_key,
                auth_key = EXCLUDED.auth_key,
                created_at = NOW()
        """;
        jdbcTemplate.update(sql, userId, endpoint, p256dh, auth);
    }

    public List<PushSubscriptionModel> findByUserId(UUID userId) {
        String sql = "SELECT * FROM push_subscriptions WHERE user_id = ?";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public void deleteByEndpoint(String endpoint) {
        String sql = "DELETE FROM push_subscriptions WHERE endpoint = ?";
        jdbcTemplate.update(sql, endpoint);
    }
}
