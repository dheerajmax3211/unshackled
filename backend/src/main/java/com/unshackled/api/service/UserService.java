package com.unshackled.api.service;

import com.unshackled.api.dto.CreateUserRequest;
import com.unshackled.api.dto.UpdateUserRequest;
import com.unshackled.api.dto.UserResponse;
import com.unshackled.api.exception.ForbiddenException;
import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.exception.ValidationException;
import com.unshackled.api.model.UserModel;
import com.unshackled.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Business logic for user management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse createUser(String authUserId, CreateUserRequest request) {
        UUID id = UUID.fromString(authUserId);

        // Optional: Check if user already exists
        if (userRepository.findById(id).isPresent()) {
            throw new ValidationException("User profile already exists for this account");
        }

        // Check if username is taken
        if (userRepository.existsByUsername(request.username())) {
            throw new ValidationException("Username is already taken");
        }

        UserModel newUser = new UserModel(
                id,
                request.username(),
                request.displayName(),
                request.avatarUrl(),
                request.bio(),
                request.country() != null ? request.country() : "IN",
                request.currency() != null ? request.currency() : "INR",
                request.isSupporter() != null ? request.isSupporter() : false,
                false, // onboardingCompleted
                null, // quitDate
                null, // pushSubscription
                null, // notificationPrefs
                null, // dailyReminderTime
                "free", // premiumStatus
                null, // stripeCustomerId
                request.leaderboardOptIn() != null ? request.leaderboardOptIn() : true,
                null, // createdAt (DB handles this)
                null  // updatedAt (DB handles this)
        );

        userRepository.insert(newUser);
        log.info("Created new user profile for ID: {}", id);

        // Fetch back to get DB-generated fields
        return getUserById(authUserId);
    }

    public UserResponse getUserById(String userId) {
        UUID id = UUID.fromString(userId);
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return UserResponse.fromModel(user);
    }

    public UserResponse getUserByUsername(String username) {
        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return UserResponse.fromModel(user);
    }

    public UserResponse updateUser(String authUserId, String targetUserId, UpdateUserRequest request) {
        if (!authUserId.equals(targetUserId)) {
            throw new ForbiddenException("You can only update your own profile");
        }

        UUID id = UUID.fromString(authUserId);

        // Ensure user exists
        userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        userRepository.update(id, request);
        log.info("Updated user profile for ID: {}", id);

        return getUserById(authUserId);
    }

    public UserModel deleteUser(String authUserId, String targetUserId) {
        if (!authUserId.equals(targetUserId)) {
            throw new ForbiddenException("You can only delete your own profile");
        }

        UUID id = UUID.fromString(authUserId);

        // Ensure user exists and get details
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        userRepository.deleteById(id);
        log.info("Deleted user profile for ID: {} (@{})", id, user.username());
        
        return user;
    }

    public void updatePremiumStatus(String userId, String status) {
        userRepository.updatePremiumStatus(UUID.fromString(userId), status);
        log.info("Debug: Updated premium status to {} for user {}", status, userId);
    }
}
