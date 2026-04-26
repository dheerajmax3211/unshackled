package com.unshackled.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

/**
 * JDBC configuration providing JdbcTemplate as the primary database access method.
 * All repositories throughout the backend inject this JdbcTemplate.
 */
@Configuration
public class JdbcConfig {

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        // Fetch size hint for large result sets
        jdbcTemplate.setFetchSize(100);
        // Query timeout in seconds (30s default)
        jdbcTemplate.setQueryTimeout(30);
        return jdbcTemplate;
    }
}
