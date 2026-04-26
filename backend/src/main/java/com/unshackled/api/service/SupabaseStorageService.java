package com.unshackled.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Service to interact directly with Supabase Storage via REST APIs.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Generates a signed URL for a user to upload a file directly to Supabase from the client.
     */
    public String generateSignedUploadUrl(String bucket, String path, int expirySeconds) {
        String url = String.format("%s/storage/v1/object/upload/sign/%s/%s", supabaseUrl, bucket, path);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(serviceRoleKey);
        headers.set("apikey", serviceRoleKey);
        headers.set("Content-Type", "application/json");

        // Fix #20: Include expirySeconds in the request payload
        String requestBody = String.format("{\"expiresIn\": %d}", expirySeconds);
        
        try {
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> map = objectMapper.readValue(response.getBody(), Map.class);
                return supabaseUrl + "/storage/v1" + map.get("url").toString();
            } else {
                throw new RuntimeException("Failed to generate signed upload URL: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error generating signed upload URL for bucket {} path {}", bucket, path, e);
            throw new RuntimeException("Could not generate signed upload URL", e);
        }
    }

    public String getPublicUrl(String bucket, String path) {
        return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucket, path);
    }
    
    public void deleteFile(String bucket, String path) {
        String url = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucket, path);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(serviceRoleKey);
        headers.set("apikey", serviceRoleKey);
        
        try {
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
            log.info("Deleted file from storage: {}/{}", bucket, path);
        } catch (Exception e) {
            log.error("Failed to delete file from storage: {}/{}", bucket, path, e);
        }
    }

    public byte[] downloadFile(String urlStr) {
        // Simple download helper using RestTemplate
        return restTemplate.getForObject(urlStr, byte[].class);
    }
}
