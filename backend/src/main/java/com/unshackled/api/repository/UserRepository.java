package com.unshackled.api.repository;

import com.unshackled.api.dto.UpdateUserRequest;
import com.unshackled.api.model.UserModel;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Data access layer for the users table using JdbcTemplate.
 */
@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    // Maps a ResultSet row to a UserModel record
    private final RowMapper<UserModel> rowMapper = (rs, rowNum) -> new UserModel(
            rs.getObject("id", UUID.class),
            rs.getString("username"),
            rs.getString("display_name"),
            rs.getString("avatar_url"),
            rs.getString("bio"),
            rs.getString("country"),
            rs.getString("currency"),
            rs.getBoolean("is_supporter"),
            rs.getBoolean("onboarding_completed"),
            rs.getDate("quit_date") != null ? rs.getDate("quit_date").toLocalDate() : null,
            rs.getString("push_subscription"),
            rs.getString("notification_prefs"),
            rs.getTime("daily_reminder_time") != null ? rs.getTime("daily_reminder_time").toLocalTime() : null,
            rs.getString("premium_status"),
            rs.getString("stripe_customer_id"),
            rs.getBoolean("leaderboard_opt_in"),
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("updated_at", OffsetDateTime.class)
    );

    public Optional<UserModel> findById(UUID id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            UserModel user = jdbcTemplate.queryForObject(sql, rowMapper, id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<UserModel> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
        try {
            UserModel user = jdbcTemplate.queryForObject(sql, rowMapper, username);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public boolean existsByUsername(String username) {
        String sql = "SELECT COUNT(1) FROM users WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    public java.util.List<UserModel> searchUsers(String query, UUID excludeUserId) {
        String searchPattern = "%" + query.toLowerCase() + "%";
        String sql = """
            SELECT * FROM users 
            WHERE id != ? 
            AND (LOWER(username) LIKE ? OR LOWER(display_name) LIKE ?)
            LIMIT 20
        """;
        return jdbcTemplate.query(sql, rowMapper, excludeUserId, searchPattern, searchPattern);
    }

    public void insert(UserModel user) {
        String sql = """
            INSERT INTO users (
                id, username, display_name, country, currency, is_supporter
            ) VALUES (?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                user.id(),
                user.username(),
                user.displayName(),
                user.country(),
                user.currency(),
                user.isSupporter()
        );
    }

    public void update(UUID id, UpdateUserRequest request) {
        // We dynamically build the update query based on non-null fields
        StringBuilder sql = new StringBuilder("UPDATE users SET updated_at = NOW()");
        java.util.List<Object> params = new java.util.ArrayList<>();

        if (request.displayName() != null) {
            sql.append(", display_name = ?");
            params.add(request.displayName());
        }
        if (request.avatarUrl() != null) {
            sql.append(", avatar_url = ?");
            params.add(request.avatarUrl());
        }
        if (request.bio() != null) {
            sql.append(", bio = ?");
            params.add(request.bio());
        }
        if (request.notificationPrefs() != null) {
            sql.append(", notification_prefs = ?::jsonb");
            params.add(request.notificationPrefs());
        }
        if (request.dailyReminderTime() != null) {
            sql.append(", daily_reminder_time = ?");
            params.add(request.dailyReminderTime());
        }
        if (request.leaderboardOptIn() != null) {
            sql.append(", leaderboard_opt_in = ?");
            params.add(request.leaderboardOptIn());
        }

        sql.append(" WHERE id = ?");
        params.add(id);

        jdbcTemplate.update(sql.toString(), params.toArray());
    }

    public void deleteById(UUID id) {
        // Note: Supabase usually handles full deletion via auth.users cascade,
        // but if we need to delete from public.users specifically:
        String sql = "DELETE FROM users WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public void updateStripeCustomerId(UUID id, String customerId) {
        String sql = "UPDATE users SET stripe_customer_id = ?, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, customerId, id);
    }

    public void updatePremiumStatus(UUID id, String status) {
        String sql = "UPDATE users SET premium_status = ?, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, status, id);
    }

    public java.util.List<UserModel> findUsersForDailyReminder(int utcHour) {
        // Query for users where the hour component of daily_reminder_time matches utcHour
        // AND notification_prefs contains "daily_reminder": true
        String sql = """
            SELECT * FROM users 
            WHERE EXTRACT(HOUR FROM daily_reminder_time) = ?
            AND notification_prefs ->> 'daily_reminder' = 'true'
        """;
        return jdbcTemplate.query(sql, rowMapper, utcHour);
    }

    public java.util.List<UserModel> findUsersForWeeklyReport() {
        // notification_prefs contains "weekly_report": true
        String sql = "SELECT * FROM users WHERE notification_prefs ->> 'weekly_report' = 'true'";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public java.util.List<UserModel> findAllSupporters() {
        String sql = "SELECT * FROM users WHERE is_supporter = TRUE";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public java.util.List<UserModel> findAcceptedFriends(UUID userId) {
        String sql = """
            SELECT DISTINCT u.* FROM users u
            JOIN friends f ON (f.requester_id = u.id OR f.addressee_id = u.id)
            WHERE (f.requester_id = ? OR f.addressee_id = ?)
            AND u.id != ?
            AND f.status = 'accepted'
        """;
        return jdbcTemplate.query(sql, rowMapper, userId, userId, userId);
    }
}
