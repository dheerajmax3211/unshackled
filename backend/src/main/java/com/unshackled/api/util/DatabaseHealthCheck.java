package com.unshackled.api.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Runs a simple health check query on application startup to verify
 * database connectivity to Supabase PostgreSQL.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseHealthCheck {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void checkDatabaseConnection() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result != null && result == 1) {
                log.info("✅ Database connection successful — Supabase PostgreSQL is reachable.");
            } else {
                log.warn("⚠️ Database returned unexpected result: {}", result);
            }
        } catch (Exception e) {
            log.error("❌ Database connection FAILED — check your SUPABASE_DB_URL, username, and password.", e);
        }
    }
}
