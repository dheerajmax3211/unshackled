package com.unshackled.api.controller;

import com.unshackled.api.model.NotificationModel;
import com.unshackled.api.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ResponseEntity<Void> markRead(@PathVariable UUID id) {
        notificationRepository.markRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        notificationRepository.markAllRead(userId);
        return ResponseEntity.ok().build();
    }
}
