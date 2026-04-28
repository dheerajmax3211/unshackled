package com.unshackled.api.controller;

import com.unshackled.api.dto.JournalEntryRequest;
import com.unshackled.api.dto.JournalResponse;
import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.model.JournalEntryModel;
import com.unshackled.api.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Controller for managing personal journal entries and social sharing.
 */
@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService journalService;

    @PostMapping
    public ResponseEntity<JournalResponse> saveEntry(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody JournalEntryRequest request) {
        return ResponseEntity.ok(journalService.saveEntry(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<JournalEntryModel>> getEntries(
            @AuthenticationPrincipal String userId,
            @RequestParam(defaultValue = "30") int limit) {
        return ResponseEntity.ok(journalService.getEntries(userId, limit));
    }

    @GetMapping("/{date}")
    public ResponseEntity<JournalEntryModel> getEntry(
            @AuthenticationPrincipal String userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return journalService.getEntry(userId, date)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found for date: " + date));
    }

    @GetMapping("/shared")
    public ResponseEntity<List<JournalEntryModel>> getSharedEntries(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(journalService.getSharedEntries(userId));
    }
}
