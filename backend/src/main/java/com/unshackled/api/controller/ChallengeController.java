package com.unshackled.api.controller;

import com.unshackled.api.dto.SendChallengeRequest;
import com.unshackled.api.model.ChallengeModel;
import com.unshackled.api.repository.ChallengeRepository;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.ChallengeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for the accountability challenge flow.
 */
@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService challengeService;
    private final ChallengeRepository challengeRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeModel sendChallenge(@Valid @RequestBody SendChallengeRequest request) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return challengeService.sendChallenge(authUserId, request);
    }

    @GetMapping("/upload-url/{challengeId}")
    public Map<String, String> getUploadUrl(@PathVariable UUID challengeId) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        String uploadUrl = challengeService.getSignedUploadUrlForChallenge(authUserId, challengeId);
        return Map.of("uploadUrl", uploadUrl);
    }

    @PostMapping("/{challengeId}/confirm")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> confirmUpload(
            @PathVariable UUID challengeId, 
            @RequestBody Map<String, String> payload
    ) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        String storagePath = payload.get("storagePath");
        
        if (storagePath == null || storagePath.isBlank()) {
            throw new IllegalArgumentException("storagePath is required");
        }
        
        challengeService.confirmUploadAndVerify(authUserId, challengeId, storagePath);
        return Map.of("message", "Upload confirmed and verified");
    }

    @PostMapping("/{challengeId}/review")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> reviewChallenge(
            @PathVariable UUID challengeId, 
            @RequestBody Map<String, Object> payload
    ) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        Boolean approve = (Boolean) payload.get("approve");
        String note = (String) payload.get("note");
        
        if (approve == null) {
            throw new IllegalArgumentException("approve boolean flag is required");
        }
        
        challengeService.reviewChallenge(authUserId, challengeId, approve, note);
        return Map.of("message", approve ? "Challenge approved" : "Challenge rejected");
    }

    @GetMapping
    public List<ChallengeModel> getHistory() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return challengeService.getChallengeHistory(authUserId);
    }

    @GetMapping("/{challengeId}")
    public ChallengeModel getDetail(@PathVariable UUID challengeId) {
        return challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));
    }
}
