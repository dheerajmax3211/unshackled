package com.unshackled.api.repository;

import com.unshackled.api.model.DopamineSuggestionModel;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Data access layer for dopamine replacement suggestions.
 */
@Repository
@RequiredArgsConstructor
public class DopamineSuggestionRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<DopamineSuggestionModel> rowMapper = (rs, rowNum) -> {
        java.sql.Array sqlArray = rs.getArray("habit_slugs");
        List<String> habitSlugs = null;
        if (sqlArray != null) {
            habitSlugs = Arrays.asList((String[]) sqlArray.getArray());
        }
        return new DopamineSuggestionModel(
                rs.getObject("id", UUID.class),
                rs.getString("suggestion"),
                rs.getString("category"),
                habitSlugs,
                rs.getString("difficulty"),
                rs.getObject("created_at", OffsetDateTime.class)
        );
    };

    /**
     * Picks N random suggestions relevant to the provided habit slugs, or general ones.
     */
    public List<DopamineSuggestionModel> findRandomByHabitSlugs(List<String> slugs, int count) {
        // PostgreSQL overlap operator (&&) and array constructor
        String sql = """
            SELECT * FROM dopamine_suggestions 
            WHERE habit_slugs && ?::text[] OR habit_slugs IS NULL 
            ORDER BY RANDOM() 
            LIMIT ?
        """;
        
        String[] slugArray = slugs.toArray(new String[0]);
        
        return jdbcTemplate.query(sql, ps -> {
            ps.setArray(1, ps.getConnection().createArrayOf("text", slugArray));
            ps.setInt(2, count);
        }, rowMapper);
    }
}
