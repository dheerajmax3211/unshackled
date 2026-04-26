package com.unshackled.api.controller;

import com.unshackled.api.dto.CreateUserRequest;
import com.unshackled.api.dto.UpdateUserRequest;
import com.unshackled.api.dto.UserResponse;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing user profiles.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Create a new user profile.
     * Expected to be called once by the frontend immediately after Supabase Auth signup.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return userService.createUser(authUserId, request);
    }

    /**
     * Get the authenticated user's own profile.
     */
    @GetMapping("/me")
    public UserResponse getCurrentUser() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return userService.getUserById(authUserId);
    }

    /**
     * Update the authenticated user's own profile.
     */
    @PatchMapping("/me")
    public UserResponse updateCurrentUser(@Valid @RequestBody UpdateUserRequest request) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return userService.updateUser(authUserId, authUserId, request);
    }

    /**
     * Delete the authenticated user's own profile.
     * Triggers a GDPR cascade delete (partially implemented).
     */
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCurrentUser() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        userService.deleteUser(authUserId, authUserId);
    }

    /**
     * Get a user's public profile by their username.
     * Accessible by any authenticated user.
     */
    @GetMapping("/{username}")
    public UserResponse getUserByUsername(@PathVariable String username) {
        // We ensure the caller is authenticated (SecurityConfig rules),
        // but they can query any username.
        return userService.getUserByUsername(username);
    }
}
