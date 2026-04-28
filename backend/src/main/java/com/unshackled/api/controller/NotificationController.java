package com.unshackled.api.controller;

import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.model.NotificationModel;
import com.unshackled.api.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<NotificationModel>> getNotifications(
            @RequestParam(defaultValue = "false") boolean onlyUnread,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(notificationRepository.findByUserId(userId, onlyUnread));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markRead(@PathVariable UUID id) {
        NotificationModel notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        notificationRepository.markRead(id);
        
        return ResponseEntity.ok(Map.of(
            "message", "Notification '" + notification.title() + "' marked as read",
            "type", notification.type()
        ));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllRead(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        int count = notificationRepository.markAllRead(userId);
        
        return ResponseEntity.ok(Map.of(
            "message", count > 0 
                ? "Successfully marked " + count + " notifications as read" 
                : "No unread notifications to mark",
            "count", count
        ));
    }
}
