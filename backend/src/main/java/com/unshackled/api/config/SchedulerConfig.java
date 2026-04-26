package com.unshackled.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration to enable Spring's scheduled task execution.
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Thread pool size is configured via application.yml: spring.task.scheduling.pool.size
}
