package com.unshackled.api.repository;

import com.unshackled.api.model.SubscriptionModel;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Data access layer for the subscriptions table.
 */
@Repository
@RequiredArgsConstructor
public class SubscriptionRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<SubscriptionModel> rowMapper = (rs, rowNum) -> new SubscriptionModel(
            rs.getObject("id", UUID.class),
            rs.getObject("user_id", UUID.class),
            rs.getString("stripe_subscription_id"),
            rs.getString("stripe_customer_id"),
            rs.getString("plan"),
            rs.getString("status"),
            rs.getObject("current_period_start", OffsetDateTime.class),
            rs.getObject("current_period_end", OffsetDateTime.class),
            rs.getObject("cancel_at_period_end") != null && rs.getBoolean("cancel_at_period_end"),
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("updated_at", OffsetDateTime.class)
    );

    public Optional<SubscriptionModel> findByUserId(UUID userId) {
        String sql = "SELECT * FROM subscriptions WHERE user_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<SubscriptionModel> findByStripeSubscriptionId(String stripeSubId) {
        String sql = "SELECT * FROM subscriptions WHERE stripe_subscription_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, stripeSubId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void upsert(SubscriptionModel model) {
        String sql = """
            INSERT INTO subscriptions (
                user_id, stripe_subscription_id, stripe_customer_id, plan, status, 
                current_period_start, current_period_end, cancel_at_period_end
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (user_id) DO UPDATE SET
                stripe_subscription_id = EXCLUDED.stripe_subscription_id,
                stripe_customer_id = EXCLUDED.stripe_customer_id,
                plan = EXCLUDED.plan,
                status = EXCLUDED.status,
                current_period_start = EXCLUDED.current_period_start,
                current_period_end = EXCLUDED.current_period_end,
                cancel_at_period_end = EXCLUDED.cancel_at_period_end,
                updated_at = NOW()
        """;
        jdbcTemplate.update(sql,
                model.userId(),
                model.stripeSubscriptionId(),
                model.stripeCustomerId(),
                model.plan(),
                model.status(),
                model.currentPeriodStart(),
                model.currentPeriodEnd(),
                model.cancelAtPeriodEnd()
        );
    }

    public void updateStatus(String stripeSubId, String status) {
        String sql = "UPDATE subscriptions SET status = ?, updated_at = NOW() WHERE stripe_subscription_id = ?";
        jdbcTemplate.update(sql, status, stripeSubId);
    }
}
