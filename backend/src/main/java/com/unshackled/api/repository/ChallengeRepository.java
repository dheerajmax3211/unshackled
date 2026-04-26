package com.unshackled.api.repository;

import com.unshackled.api.model.ChallengeModel;
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
public class ChallengeRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ChallengeModel> rowMapper = (rs, rowNum) -> new ChallengeModel(
            rs.getObject("id", UUID.class),
            rs.getObject("challenger_id", UUID.class),
            rs.getObject("challenged_id", UUID.class),
            rs.getObject("user_habit_id", UUID.class),
            rs.getString("status"),
            rs.getString("message"),
            rs.getObject("response_deadline", OffsetDateTime.class),
            rs.getObject("responded_at", OffsetDateTime.class),
            rs.getObject("reviewed_at", OffsetDateTime.class),
            rs.getString("reviewer_note"),
            rs.getObject("exif_verified") != null ? rs.getBoolean("exif_verified") : null,
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("updated_at", OffsetDateTime.class)
    );

    public UUID insert(ChallengeModel model) {
        String sql = """
            INSERT INTO challenges (challenger_id, challenged_id, user_habit_id, message, response_deadline)
            VALUES (?, ?, ?, ?, ?)
            RETURNING id
        """;
        return jdbcTemplate.queryForObject(sql, UUID.class,
                model.challengerId(),
                model.challengedId(),
                model.userHabitId(),
                model.message(),
                model.responseDeadline()
        );
    }

    public Optional<ChallengeModel> findById(UUID id) {
        String sql = "SELECT * FROM challenges WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<ChallengeModel> findByChallengedId(UUID challengedId) {
        String sql = "SELECT * FROM challenges WHERE challenged_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, rowMapper, challengedId);
    }

    public List<ChallengeModel> findByChallengerId(UUID challengerId) {
        String sql = "SELECT * FROM challenges WHERE challenger_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, rowMapper, challengerId);
    }

    public void updateStatus(UUID id, String status, OffsetDateTime reviewedAt, OffsetDateTime respondedAt, Boolean exifVerified, String note) {
        String sql = """
            UPDATE challenges 
            SET status = ?, 
                reviewed_at = COALESCE(?, reviewed_at),
                responded_at = COALESCE(?, responded_at),
                exif_verified = COALESCE(?, exif_verified),
                reviewer_note = COALESCE(?, reviewer_note),
                updated_at = NOW()
            WHERE id = ?
        """;
        jdbcTemplate.update(sql, status, reviewedAt, respondedAt, exifVerified, note, id);
    }

    public List<ChallengeModel> findExpiredPending() {
        String sql = "SELECT * FROM challenges WHERE status = 'pending' AND response_deadline < NOW()";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public int countApprovedByUserId(UUID userId) {
        String sql = "SELECT COUNT(1) FROM challenges WHERE challenged_id = ? AND status = 'approved'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId);
        return count != null ? count : 0;
    }
}
