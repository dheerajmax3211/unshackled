package com.unshackled.api.controller;

import com.unshackled.api.model.DopamineSuggestionModel;
import com.unshackled.api.model.HealthMilestoneModel;
import com.unshackled.api.model.MoneySuggestionModel;
import com.unshackled.api.model.WithdrawalModel;
import com.unshackled.api.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @GetMapping("/withdrawal")
    public ResponseEntity<WithdrawalModel> getWithdrawal(
            @RequestParam UUID habitId,
            @RequestParam int dayOffset) {
        return contentService.getWithdrawalMessage(habitId, dayOffset)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dopamine")
    public ResponseEntity<List<DopamineSuggestionModel>> getDopamine(
            @RequestParam(required = false) String habits) {
        List<String> habitSlugs = (habits != null && !habits.isEmpty())
                ? Arrays.asList(habits.split(","))
                : List.of();
        return ResponseEntity.ok(contentService.getDopamineSuggestions(habitSlugs));
    }

    @GetMapping("/money")
    public ResponseEntity<MoneySuggestionModel> getMoney(
            @RequestParam(defaultValue = "IN") String country,
            @RequestParam BigDecimal amount) {
        return contentService.getMoneySuggestion(country, amount)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/health-milestones")
    public ResponseEntity<List<HealthMilestoneModel>> getHealthMilestones(
            @RequestParam UUID habitId,
            @RequestParam int dayOffset) {
        return ResponseEntity.ok(contentService.getHealthMilestones(habitId, dayOffset));
    }
}
