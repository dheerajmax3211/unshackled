package com.unshackled.api.repository;

import com.unshackled.api.model.HabitModel;
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
 * Data access layer for the predefined 'habits' seed table.
 */
@Repository
@RequiredArgsConstructor
public class HabitRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<HabitModel> rowMapper = (rs, rowNum) -> new HabitModel(
            rs.getObject("id", UUID.class),
            rs.getString("slug"),
            rs.getString("display_name"),
            rs.getString("icon"),
            rs.getString("description"),
            rs.getInt("sort_order"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    public List<HabitModel> findAll() {
        String sql = "SELECT * FROM habits ORDER BY sort_order ASC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<HabitModel> findById(UUID id) {
        String sql = "SELECT * FROM habits WHERE id = ?";
        try {
            HabitModel habit = jdbcTemplate.queryForObject(sql, rowMapper, id);
            return Optional.ofNullable(habit);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<HabitModel> findBySlug(String slug) {
        String sql = "SELECT * FROM habits WHERE slug = ?";
        try {
            HabitModel habit = jdbcTemplate.queryForObject(sql, rowMapper, slug);
            return Optional.ofNullable(habit);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}
