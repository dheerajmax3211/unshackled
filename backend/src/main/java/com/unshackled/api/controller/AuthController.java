package com.unshackled.api.controller;

import com.unshackled.api.dto.LoginRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * REST Controller that proxies authentication requests to Supabase Auth.
 * This allows developers to obtain a valid JWT via Postman without implementing
 * the full Supabase Auth flow on the client side during testing.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthController {

    private final OkHttpClient httpClient = new OkHttpClient();

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;

    private final com.unshackled.api.service.UserService userService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    /**
     * Proxies a login request to Supabase GoTrue.
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        return proxyToSupabase("/auth/v1/token?grant_type=password", 
            String.format("{\"email\":\"%s\", \"password\":\"%s\"}", request.email(), request.password()));
    }

    /**
     * Full registration: Creates user in Supabase AND local database.
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody java.util.Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String username = requestBody.get("username");
        String displayName = requestBody.get("displayName");
        String country = requestBody.getOrDefault("country", "IN");
        String currency = requestBody.getOrDefault("currency", "INR");
        boolean isSupporter = Boolean.parseBoolean(requestBody.getOrDefault("isSupporter", "false"));
        String bio = requestBody.get("bio");
        String avatarUrl = requestBody.get("avatarUrl");
        boolean leaderboardOptIn = Boolean.parseBoolean(requestBody.getOrDefault("leaderboardOptIn", "true"));

        if (email == null || password == null || username == null || displayName == null) {
            return ResponseEntity.badRequest().body("{\"message\": \"email, password, username, and displayName are required\"}");
        }

        // 1. Signup at Supabase
        ResponseEntity<String> supabaseResponse = proxyToSupabase("/auth/v1/signup", 
            String.format("{\"email\":\"%s\", \"password\":\"%s\"}", email, password));

        if (supabaseResponse.getStatusCode() != HttpStatus.OK && supabaseResponse.getStatusCode() != HttpStatus.CREATED) {
            return supabaseResponse;
        }

        try {
            // 2. Parse the sub (ID) from Supabase response
            com.fasterxml.jackson.databind.JsonNode node = objectMapper.readTree(supabaseResponse.getBody());
            String sub = node.has("id") ? node.get("id").asText() : 
                        (node.has("user") ? node.get("user").get("id").asText() : null);

            if (sub != null) {
                // 3. Create in local DB
                com.unshackled.api.dto.CreateUserRequest localReq = new com.unshackled.api.dto.CreateUserRequest(
                    username, displayName, country, currency, isSupporter, bio, avatarUrl, leaderboardOptIn
                );
                userService.createUser(sub, localReq);
                log.info("Successfully synced new Supabase user {} to local database", sub);
            }
        } catch (Exception e) {
            log.error("Failed to sync Supabase user to local DB: {}", e.getMessage());
            // We return the supabase response anyway because the user was created there
        }

        return supabaseResponse;
    }

    @PostMapping("/debug/promote/{userId}")
    public ResponseEntity<String> promoteUser(@PathVariable String userId) {
        try {
            userService.updatePremiumStatus(userId, "premium");
            return ResponseEntity.ok("{\"message\": \"User promoted to Premium for testing.\"}");
        } catch (Exception e) {
            log.error("Promotion failed for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    private ResponseEntity<String> proxyToSupabase(String path, String jsonBody) {
        String url = supabaseUrl + path;
        okhttp3.RequestBody body = okhttp3.RequestBody.create(jsonBody, MediaType.parse("application/json"));
        Request supabaseRequest = new Request.Builder()
                .url(url)
                .addHeader("apikey", supabaseAnonKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = httpClient.newCall(supabaseRequest).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";
            return ResponseEntity.status(response.code()).body(responseBody);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"message\": \"Failed to connect to Supabase Auth: " + e.getMessage() + "\"}");
        }
    }
}
