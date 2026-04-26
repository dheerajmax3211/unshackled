package com.unshackled.api.controller;

import com.unshackled.api.dto.FriendRequest;
import com.unshackled.api.model.FriendModel;
import com.unshackled.api.model.UserModel;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.FriendService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for managing the social graph.
 */
@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/request")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> sendRequest(@Valid @RequestBody FriendRequest request) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        friendService.sendFriendRequest(authUserId, request.addresseeUsername());
        return Map.of("message", "Friend request sent successfully");
    }

    @PutMapping("/{friendId}/respond")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> respondToRequest(@PathVariable UUID friendId, @RequestBody Map<String, String> payload) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        String response = payload.get("response");
        friendService.respondToRequest(authUserId, friendId, response);
        return Map.of("message", "Friend request " + response);
    }

    @GetMapping
    public List<FriendModel> getFriends() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        // Typically we would also fetch streak data for each friend to display in the UI.
        // For now, we return the friend records. The StreakController handles /api/streaks
        return friendService.getFriends(authUserId);
    }

    @GetMapping("/pending")
    public List<FriendModel> getPendingRequests() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return friendService.getPendingRequests(authUserId);
    }

    @DeleteMapping("/{friendId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFriend(@PathVariable UUID friendId) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        friendService.removeFriend(authUserId, friendId);
    }

    @GetMapping("/search")
    public List<UserModel> searchUsers(@RequestParam("q") String query) {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return friendService.searchUsers(query, authUserId);
    }
}
