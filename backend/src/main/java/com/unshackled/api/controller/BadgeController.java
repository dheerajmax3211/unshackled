package com.unshackled.api.controller;

import com.unshackled.api.model.BadgeModel;
import com.unshackled.api.repository.BadgeRepository;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for accessing user badges.
 */
@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService badgeService;
    private final BadgeRepository badgeRepository;

    @GetMapping
    public List<Map<String, Object>> getAllBadgesWithStatus() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return badgeService.getUserBadges(authUserId);
    }

    @GetMapping("/earned")
    public List<BadgeModel> getEarnedBadges() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        return badgeRepository.findEarnedByUserId(UUID.fromString(authUserId));
    }
}
