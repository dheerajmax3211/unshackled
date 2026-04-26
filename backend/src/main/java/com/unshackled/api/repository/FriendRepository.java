package com.unshackled.api.repository;

import com.unshackled.api.model.FriendModel;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class FriendRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<FriendModel> rowMapper = (rs, rowNum) -> new FriendModel(
            rs.getObject("id", UUID.class),
            rs.getObject("requester_id", UUID.class),
            rs.getObject("addressee_id", UUID.class),
            rs.getString("status"),
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("updated_at", OffsetDateTime.class)
    );

    public void insert(FriendModel model) {
        String sql = """
            INSERT INTO friends (requester_id, addressee_id, status)
            VALUES (?, ?, ?)
        """;
        jdbcTemplate.update(sql, model.requesterId(), model.addresseeId(), model.status());
    }

    public Optional<FriendModel> findByUserIds(UUID user1, UUID user2) {
        String sql = """
            SELECT * FROM friends 
            WHERE (requester_id = ? AND addressee_id = ?) 
               OR (requester_id = ? AND addressee_id = ?)
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, user1, user2, user2, user1));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
    
    public Optional<FriendModel> findById(UUID id) {
        String sql = "SELECT * FROM friends WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void updateStatus(UUID friendId, String status) {
        String sql = "UPDATE friends SET status = ?, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, status, friendId);
    }

    public List<FriendModel> findFriendsByUserId(UUID userId) {
        String sql = """
            SELECT * FROM friends 
            WHERE (requester_id = ? OR addressee_id = ?) AND status = 'accepted'
        """;
        return jdbcTemplate.query(sql, rowMapper, userId, userId);
    }

    public List<FriendModel> findPendingRequests(UUID userId) {
        String sql = "SELECT * FROM friends WHERE addressee_id = ? AND status = 'pending'";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public void deleteFriend(UUID friendId) {
        String sql = "DELETE FROM friends WHERE id = ?";
        jdbcTemplate.update(sql, friendId);
    }

    public int countAcceptedByUserId(UUID userId) {
        String sql = """
            SELECT COUNT(1) FROM friends 
            WHERE (requester_id = ? OR addressee_id = ?) AND status = 'accepted'
        """;
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId, userId);
        return count != null ? count : 0;
    }
}
