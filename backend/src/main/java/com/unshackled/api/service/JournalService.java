package com.unshackled.api.service;

import com.unshackled.api.dto.JournalEntryRequest;
import com.unshackled.api.dto.JournalResponse;
import com.unshackled.api.model.JournalEntryModel;
import com.unshackled.api.repository.JournalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing user journal entries and awarding related XP.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalRepository journalRepository;
    private final XpService xpService;

    /**
     * Saves or updates a journal entry and awards XP if it's the first time for this date.
     */
    @Transactional
    public JournalResponse saveEntry(String userId, JournalEntryRequest request) {
        UUID uId = UUID.fromString(userId);
        
        // Check if entry already exists to determine if we should award XP
        boolean isNewEntry = journalRepository.findByUserIdAndDate(uId, request.entryDate()).isEmpty();

        JournalEntryModel model = new JournalEntryModel(
                null,
                uId,
                request.entryDate(),
                request.content(),
                request.moodScore(),
                request.moodEmoji(),
                request.triggers() != null ? request.triggers().toArray(new String[0]) : null,
                request.whatHelped(),
                request.isShared(),
                request.sharedWith() != null ? request.sharedWith().toArray(new UUID[0]) : null,
                null,
                null
        );

        UUID entryId = journalRepository.upsert(model);
        int xpEarned = 0;
        String message = isNewEntry ? "Journal entry created successfully" : "Journal entry updated successfully";

        if (isNewEntry) {
            // Award XP for the journal entry
            xpService.awardXp(userId, "journal_entry", XpService.JOURNAL_ENTRY, entryId, "Journal entry for " + request.entryDate());
            xpEarned += XpService.JOURNAL_ENTRY;
            
            // Award XP for mood logging if provided
            if (request.moodScore() != null) {
                xpService.awardXp(userId, "mood_logged", XpService.MOOD_LOGGED, entryId, "Mood logged for " + request.entryDate());
                xpEarned += XpService.MOOD_LOGGED;
            }
            message += ". XP awarded!";
        }

        return new JournalResponse(entryId, message, request.entryDate(), xpEarned);
    }

    public List<JournalEntryModel> getEntries(String userId, int limit) {
        return journalRepository.findByUserId(UUID.fromString(userId), limit);
    }

    public Optional<JournalEntryModel> getEntry(String userId, LocalDate date) {
        return journalRepository.findByUserIdAndDate(UUID.fromString(userId), date);
    }

    public List<JournalEntryModel> getSharedEntries(String viewerId) {
        return journalRepository.findSharedWithUser(UUID.fromString(viewerId));
    }
}
