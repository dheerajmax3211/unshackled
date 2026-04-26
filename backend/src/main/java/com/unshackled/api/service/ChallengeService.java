package com.unshackled.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unshackled.api.dto.ExifResult;
import com.unshackled.api.dto.SendChallengeRequest;
import com.unshackled.api.exception.ForbiddenException;
import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.exception.ValidationException;
import com.unshackled.api.model.ChallengeMediaModel;
import com.unshackled.api.model.ChallengeModel;
import com.unshackled.api.model.FriendModel;
import com.unshackled.api.repository.ChallengeMediaRepository;
import com.unshackled.api.repository.ChallengeRepository;
import com.unshackled.api.repository.FriendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service managing the core accountability challenge flow.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ChallengeMediaRepository mediaRepository;
    private final FriendRepository friendRepository;
    private final SupabaseStorageService storageService;
    private final ExifExtractionService exifService;
    private final StreakService streakService;
    private final NotificationService notificationService;
    private final XpService xpService;
    private final ObjectMapper objectMapper;

    @Transactional
    public ChallengeModel sendChallenge(String challengerId, SendChallengeRequest request) {
        UUID challengerUuid = UUID.fromString(challengerId);

        if (challengerUuid.equals(request.challengedUserId())) {
            throw new ValidationException("You cannot challenge yourself");
        }

        // Verify friendship
        FriendModel friendRecord = friendRepository.findByUserIds(challengerUuid, request.challengedUserId())
                .orElseThrow(() -> new ForbiddenException("You can only challenge accepted friends"));

        if (!"accepted".equalsIgnoreCase(friendRecord.status())) {
            throw new ForbiddenException("Friend request must be accepted first");
        }

        ChallengeModel model = new ChallengeModel(
                null,
                challengerUuid,
                request.challengedUserId(),
                request.userHabitId(),
                "pending",
                request.message(),
                OffsetDateTime.now().plusMinutes(10), // 10 minute response window!
                null,
                null,
                null,
                null,
                null,
                null
        );

        UUID challengeId = challengeRepository.insert(model);
        
        // Push notification to challenged user
        notificationService.sendNotification(
                request.challengedUserId(),
                "CHALLENGE_RECEIVED",
                "New Challenge! \uD83D\uDCAA",
                "Your supporter has challenged you to prove you're clean right now!",
                Map.of("challengeId", challengeId.toString(), "challengerId", challengerId),
                true
        );
        
        xpService.awardXp(challengerId, "challenge_sent", 10, challengeId, "Sent accountability challenge");

        log.info("User {} sent challenge {} to {}", challengerId, challengeId, request.challengedUserId());
        return challengeRepository.findById(challengeId).orElseThrow();
    }

    public String getSignedUploadUrlForChallenge(String userId, UUID challengeId) {
        ChallengeModel challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "id", challengeId));

        if (!challenge.challengedId().toString().equals(userId)) {
            throw new ForbiddenException("You are not the challenged party");
        }

        if (!"pending".equalsIgnoreCase(challenge.status())) {
            throw new ValidationException("Challenge is not pending");
        }

        if (OffsetDateTime.now().isAfter(challenge.responseDeadline())) {
            challengeRepository.updateStatus(challengeId, "expired", null, null, null, null);
            throw new ValidationException("This challenge has expired");
        }

        String path = String.format("challenges/%s/%s.jpg", challengeId, UUID.randomUUID());
        return storageService.generateSignedUploadUrl("proofs", path, 300); // 5 min expiry
    }

    @Transactional
    public void confirmUploadAndVerify(String userId, UUID challengeId, String storagePath) {
        ChallengeModel challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "id", challengeId));

        if (!challenge.challengedId().toString().equals(userId)) {
            throw new ForbiddenException("You are not the challenged party");
        }

        if (!"pending".equalsIgnoreCase(challenge.status())) {
            throw new ValidationException("Challenge is no longer pending");
        }

        // Fix #27: Check deadline expiry on upload confirmation too
        if (OffsetDateTime.now().isAfter(challenge.responseDeadline())) {
            challengeRepository.updateStatus(challengeId, "expired", null, null, null, "Expired during upload");
            throw new ValidationException("This challenge has expired. The response deadline has passed.");
        }

        String publicUrl = storageService.getPublicUrl("proofs", storagePath);
        
        // Extract EXIF
        ExifResult exif = exifService.extractExif(publicUrl);
        boolean isVerified = false;
        String reason = null;

        if (exif.hasMissingTimestamp()) {
            reason = "Missing EXIF timestamp metadata. Ensure your camera settings allow location/time data.";
        } else {
            // Verify timestamp is within 10 minutes of challenge creation
            Instant challengeCreated = challenge.createdAt().toInstant();
            Instant photoTime = exif.timestamp();
            
            long diffSeconds = Math.abs(challengeCreated.getEpochSecond() - photoTime.getEpochSecond());
            
            // Allow photos taken up to 10 minutes before OR after the challenge was issued
            if (diffSeconds > 600) {
                reason = "Photo timestamp is too old or inaccurate. Photo must be taken right now.";
            } else {
                isVerified = true;
            }
        }

        // Save Media Record
        String rawJson = "{}";
        try {
            rawJson = objectMapper.writeValueAsString(exif.rawTags());
        } catch (Exception ignored) {}

        ChallengeMediaModel media = new ChallengeMediaModel(
                null,
                challengeId,
                storagePath,
                publicUrl,
                exif.timestamp() != null ? exif.timestamp().atOffset(ZoneOffset.UTC) : null,
                exif.gpsLat() != null ? BigDecimal.valueOf(exif.gpsLat()) : null,
                exif.gpsLng() != null ? BigDecimal.valueOf(exif.gpsLng()) : null,
                rawJson,
                isVerified,
                reason,
                null
        );

        mediaRepository.insert(media);

        // Update Challenge
        String newStatus = isVerified ? "responded" : "verification_failed";
        challengeRepository.updateStatus(challengeId, newStatus, null, OffsetDateTime.now(), isVerified, null);

        if (isVerified) {
            xpService.awardXp(userId, "challenge_responded", XpService.CHALLENGE_RESPONDED, challengeId, "Successfully uploaded proof");
            
            // Push notification to Challenger to review
            notificationService.sendNotification(
                    challenge.challengerId(),
                    "CHALLENGE_RESPONDED",
                    "Challenge Proof Received! \uD83D\uDCE4",
                    "A friend has uploaded proof for your challenge. Review it now!",
                    Map.of("challengeId", challengeId.toString(), "challengedId", userId),
                    false
            );
        }
        log.info("Challenge {} confirmed. EXIF Verified: {}", challengeId, isVerified);
    }

    @Transactional
    public void reviewChallenge(String challengerId, UUID challengeId, boolean approve, String note) {
        ChallengeModel challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "id", challengeId));

        if (!challenge.challengerId().toString().equals(challengerId)) {
            throw new ForbiddenException("You are not the challenger");
        }

        if (!"responded".equalsIgnoreCase(challenge.status()) && !"verification_failed".equalsIgnoreCase(challenge.status())) {
            throw new ValidationException("Challenge is not ready for review");
        }

        String status = approve ? "approved" : "rejected";
        challengeRepository.updateStatus(challengeId, status, OffsetDateTime.now(), challenge.respondedAt(), challenge.exifVerified(), note);

        if (approve) {
            xpService.awardXp(challenge.challengedId().toString(), "challenge_approved", XpService.CHALLENGE_APPROVED, challengeId, "Accountability proof approved");
        } else {
            // Rejected means they lied or relapsed
            if (challenge.userHabitId() != null) {
                streakService.resetStreak(challenge.userHabitId());
                log.info("Streak reset for userHabit {} due to rejected challenge", challenge.userHabitId());
                
                // Send Empathy Message
                notificationService.sendEmpathyMessage(challenge.challengedId(), challenge.userHabitId());
            }
        }
    }

    public List<ChallengeModel> getChallengeHistory(String userId) {
        UUID uId = UUID.fromString(userId);
        List<ChallengeModel> sent = challengeRepository.findByChallengerId(uId);
        List<ChallengeModel> received = challengeRepository.findByChallengedId(uId);

        // Fix #7: Create a new mutable list instead of mutating the returned list
        List<ChallengeModel> all = new ArrayList<>(sent);
        all.addAll(received);
        all.sort((a, b) -> b.createdAt().compareTo(a.createdAt()));
        return all;
    }
}
