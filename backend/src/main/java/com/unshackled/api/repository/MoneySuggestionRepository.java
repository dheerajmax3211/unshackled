package com.unshackled.api.repository;

import com.unshackled.api.model.MoneySuggestionModel;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data access layer for money saving context suggestions.
 */
@Repository
@RequiredArgsConstructor
public class MoneySuggestionRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<MoneySuggestionModel> rowMapper = (rs, rowNum) -> new MoneySuggestionModel(
            rs.getObject("id", UUID.class),
            rs.getString("country_code"),
            rs.getBigDecimal("amount_min"),
            rs.getBigDecimal("amount_max"),
            rs.getString("suggestion"),
            rs.getString("category"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    /**
     * Finds a suggestion for what a saved amount could buy in a specific country.
     */
    public Optional<MoneySuggestionModel> findByCountryAndAmount(String country, BigDecimal amount) {
        String sql = """
            SELECT * FROM money_suggestions 
            WHERE country_code = ? 
            AND ? BETWEEN amount_min AND amount_max 
            ORDER BY RANDOM() 
            LIMIT 1
        """;
        List<MoneySuggestionModel> results = jdbcTemplate.query(sql, rowMapper, country, amount);
        return results.stream().findFirst();
    }
}
