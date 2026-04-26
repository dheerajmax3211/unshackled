package com.unshackled.api.controller;

import com.unshackled.api.model.XpEventModel;
import com.unshackled.api.repository.XpEventRepository;
import com.unshackled.api.security.AuthenticatedUser;
import com.unshackled.api.service.XpService;
import com.unshackled.api.util.LevelDefinition;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for accessing a user's XP and leveling summary.
 */
@RestController
@RequestMapping("/api/xp")
@RequiredArgsConstructor
public class XpController {

    private final XpService xpService;
    private final XpEventRepository xpEventRepository;

    @GetMapping("/summary")
    public Map<String, Object> getXpSummary() {
        String authUserId = AuthenticatedUser.requireCurrentUserId();
        
        int totalXp = xpService.getTotalXp(authUserId);
        LevelDefinition.Level currentLevel = LevelDefinition.getLevelForXp(totalXp);
        int xpToNext = LevelDefinition.getXpToNextLevel(totalXp);
        List<XpEventModel> recentEvents = xpEventRepository.findByUserId(UUID.fromString(authUserId), 10);

        return Map.of(
                "totalXp", totalXp,
                "currentLevel", currentLevel,
                "xpToNextLevel", xpToNext,
                "recentEvents", recentEvents
        );
    }
}
