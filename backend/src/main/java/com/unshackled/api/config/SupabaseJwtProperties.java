package com.unshackled.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Type-safe configuration properties for Supabase integration.
 * Populated from the {@code supabase.*} section of application.yml.
 *
 * <p>Required environment variables:
 * <ul>
 *   <li>{@code SUPABASE_URL} — project URL (e.g., https://xxxx.supabase.co)</li>
 *   <li>{@code SUPABASE_JWT_SECRET} — JWT secret from Supabase project settings</li>
 *   <li>{@code SUPABASE_SERVICE_ROLE_KEY} — service role key for admin operations</li>
 *   <li>{@code SUPABASE_ANON_KEY} — anonymous key for client-side operations</li>
 * </ul>
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "supabase")
public class SupabaseJwtProperties {

    /**
     * The Supabase project URL (e.g., https://xxxx.supabase.co).
     * Used for Storage API calls and Auth admin operations.
     */
    private String url;

    /**
     * The Supabase anonymous key. Used in limited scenarios where
     * the backend acts as a client.
     */
    private String anonKey;

    /**
     * The Supabase service role key. Bypasses RLS for server-side
     * operations like Storage signed URLs and Auth admin actions.
     */
    private String serviceRoleKey;

    /**
     * The JWT secret from Supabase project settings (Settings → API → JWT Secret).
     * Used to verify HS256-signed tokens issued by Supabase Auth.
     */
    private String jwtSecret;
}
