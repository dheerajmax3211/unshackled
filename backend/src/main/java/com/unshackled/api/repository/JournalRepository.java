package com.unshackled.api.repository;

import com.unshackled.api.model.JournalEntryModel;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data access layer for the journal_entries table.
 */
@Repository
@RequiredArgsConstructor
public class JournalRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<JournalEntryModel> rowMapper = (rs, rowNum) -> {
        java.sql.Array triggersSql = rs.getArray("triggers");
        String[] triggers = triggersSql != null ? (String[]) triggersSql.getArray() : null;

        java.sql.Array sharedSql = rs.getArray("shared_with");
        UUID[] sharedWith = sharedSql != null ? (UUID[]) sharedSql.getArray() : null;

        return new JournalEntryModel(
                rs.getObject("id", UUID.class),
                rs.getObject("user_id", UUID.class),
                rs.getDate("entry_date").toLocalDate(),
                rs.getString("content"),
                rs.getObject("mood_score") != null ? rs.getInt("mood_score") : null,
                rs.getString("mood_emoji"),
                triggers,
                rs.getString("what_helped"),
                rs.getBoolean("is_shared"),
                sharedWith,
                rs.getObject("created_at", OffsetDateTime.class),
                rs.getObject("updated_at", OffsetDateTime.class)
        );
    };

    public UUID upsert(JournalEntryModel model) {
        String sql = """
            INSERT INTO journal_entries (
                user_id, entry_date, content, mood_score, mood_emoji, 
                triggers, what_helped, is_shared, shared_with
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (user_id, entry_date) DO UPDATE SET
                content = EXCLUDED.content,
                mood_score = EXCLUDED.mood_score,
                mood_emoji = EXCLUDED.mood_emoji,
                triggers = EXCLUDED.triggers,
                what_helped = EXCLUDED.what_helped,
                is_shared = EXCLUDED.is_shared,
                shared_with = EXCLUDED.shared_with,
                updated_at = NOW()
            RETURNING id
        """;

        return jdbcTemplate.execute(sql, (PreparedStatement ps) -> {
            ps.setObject(1, model.userId());
            ps.setDate(2, java.sql.Date.valueOf(model.entryDate()));
            ps.setString(3, model.content());
            ps.setObject(4, model.moodScore());
            ps.setString(5, model.moodEmoji());
            ps.setArray(6, ps.getConnection().createArrayOf("text", model.triggers() != null ? model.triggers() : new String[0]));
            ps.setString(7, model.whatHelped());
            ps.setBoolean(8, model.isShared() != null && model.isShared());
            ps.setArray(9, ps.getConnection().createArrayOf("uuid", model.sharedWith() != null ? model.sharedWith() : new UUID[0]));
            
            var rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getObject("id", UUID.class);
            }
            throw new RuntimeException("Failed to upsert journal entry");
        });
    }

    public List<JournalEntryModel> findByUserId(UUID userId, int limit) {
        String sql = "SELECT * FROM journal_entries WHERE user_id = ? ORDER BY entry_date DESC LIMIT ?";
        return jdbcTemplate.query(sql, rowMapper, userId, limit);
    }

    public Optional<JournalEntryModel> findByUserIdAndDate(UUID userId, LocalDate date) {
        String sql = "SELECT * FROM journal_entries WHERE user_id = ? AND entry_date = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, userId, java.sql.Date.valueOf(date)));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<JournalEntryModel> findSharedWithUser(UUID viewerId) {
        String sql = "SELECT * FROM journal_entries WHERE is_shared = TRUE AND ? = ANY(shared_with) ORDER BY entry_date DESC";
        return jdbcTemplate.query(sql, rowMapper, viewerId);
    }
}
