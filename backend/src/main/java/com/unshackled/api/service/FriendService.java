package com.unshackled.api.service;

import com.unshackled.api.exception.ForbiddenException;
import com.unshackled.api.exception.PremiumRequiredException;
import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.exception.ValidationException;
import com.unshackled.api.model.FriendModel;
import com.unshackled.api.model.UserModel;
import com.unshackled.api.repository.FriendRepository;
import com.unshackled.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service for managing the social graph.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final com.unshackled.api.service.NotificationService notificationService;
    private final XpService xpService;

    @Transactional
    public void sendFriendRequest(String requesterId, String addresseeUsername) {
        UUID reqId = UUID.fromString(requesterId);

        UserModel addressee = userRepository.findByUsername(addresseeUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", addresseeUsername));

        if (reqId.equals(addressee.id())) {
            throw new ValidationException("You cannot send a friend request to yourself");
        }

        UserModel requester = userRepository.findById(reqId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reqId));

        // Task B-19.9: Premium gating check
        boolean isPremiumOrSupporter = "premium".equalsIgnoreCase(requester.premiumStatus()) || Boolean.TRUE.equals(requester.isSupporter());
        if (!isPremiumOrSupporter) {
            int friendCount = friendRepository.countAcceptedByUserId(reqId);
            if (friendCount >= 3) {
                throw new com.unshackled.api.exception.PremiumRequiredException(
                    "Free tier users can only have up to 3 friends. Please upgrade to Sovereign premium or become a supporter for unlimited friends."
                );
            }
        }

        // Check if relationship already exists
        friendRepository.findByUserIds(reqId, addressee.id()).ifPresent(f -> {
            throw new ValidationException("A relationship already exists between you and this user (status: " + f.status() + ")");
        });

        FriendModel model = new FriendModel(
                null,
                reqId,
                addressee.id(),
                "pending",
                null,
                null
        );

        friendRepository.insert(model);
        
        // Push notification to addressee
        notificationService.sendNotification(
                addressee.id(),
                "FRIEND_REQUEST",
                "New Friend Request! \uD83D\uDC4B",
                requester.displayName() + " wants to be your friend.",
                Map.of("requesterId", requesterId, "requesterName", requester.displayName()),
                false
        );
        
        log.info("User {} sent a friend request to {}", reqId, addressee.id());
    }

    @Transactional
    public void respondToRequest(String userId, UUID friendId, String response) {
        UUID uId = UUID.fromString(userId);

        FriendModel friendRecord = friendRepository.findById(friendId)
                .orElseThrow(() -> new ResourceNotFoundException("FriendRecord", "id", friendId));

        if (!friendRecord.addresseeId().equals(uId)) {
            throw new ForbiddenException("You are not the addressee of this friend request");
        }

        if (!friendRecord.status().equals("pending")) {
            throw new ValidationException("This request is no longer pending");
        }

        if ("accepted".equalsIgnoreCase(response)) {
            // Fix #18: Enforce premium check on the addressee as well
            UserModel acceptingUser = userRepository.findById(uId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", uId));
            boolean isPremiumOrSupporterAcceptor = "premium".equalsIgnoreCase(acceptingUser.premiumStatus()) || Boolean.TRUE.equals(acceptingUser.isSupporter());
            if (!isPremiumOrSupporterAcceptor) {
                int acceptingFriendCount = friendRepository.countAcceptedByUserId(uId);
                if (acceptingFriendCount >= 3) {
                    throw new PremiumRequiredException("Free-tier users can have a maximum of 3 friends. Upgrade or become a supporter to unlock unlimited connections.");
                }
            }
            
            friendRepository.updateStatus(friendId, "accepted");
            xpService.awardXp(userId, "friend_added", XpService.FRIEND_ADDED, friendId, "Accepted friend request");
            xpService.awardXp(friendRecord.requesterId().toString(), "friend_added", XpService.FRIEND_ADDED, friendId, "Friend request accepted");
            log.info("User {} accepted friend request from {}", uId, friendRecord.requesterId());
        } else if ("declined".equalsIgnoreCase(response)) {
            friendRepository.updateStatus(friendId, "declined");
            log.info("User {} declined friend request from {}", uId, friendRecord.requesterId());
        } else {
            throw new ValidationException("Invalid response. Use 'accepted' or 'declined'");
        }
    }

    public List<FriendModel> getFriends(String userId) {
        return friendRepository.findFriendsByUserId(UUID.fromString(userId));
    }

    public List<FriendModel> getPendingRequests(String userId) {
        return friendRepository.findPendingRequests(UUID.fromString(userId));
    }

    public void removeFriend(String userId, UUID friendId) {
        UUID uId = UUID.fromString(userId);
        FriendModel friendRecord = friendRepository.findById(friendId)
                .orElseThrow(() -> new ResourceNotFoundException("FriendRecord", "id", friendId));

        if (!friendRecord.requesterId().equals(uId) && !friendRecord.addresseeId().equals(uId)) {
            throw new ForbiddenException("You can only remove your own friends");
        }

        friendRepository.deleteFriend(friendId);
        log.info("User {} removed friend record {}", uId, friendId);
    }

    public List<UserModel> searchUsers(String query, String excludeUserId) {
        if (query == null || query.trim().length() < 3) {
            return List.of();
        }
        return userRepository.searchUsers(query.trim(), UUID.fromString(excludeUserId));
    }
}
