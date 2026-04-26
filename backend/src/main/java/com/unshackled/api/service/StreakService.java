package com.unshackled.api.service;

import com.unshackled.api.exception.ResourceNotFoundException;
import com.unshackled.api.model.StreakModel;
import com.unshackled.api.model.UserHabitModel;
import com.unshackled.api.repository.StreakRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StreakService {

    private final StreakRepository streakRepository;
    private final HabitService habitService;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Recomputes the streak from scratch by scanning history.
     */
    @Transactional
    public void recalculateStreak(UUID userHabitId) {
        String sql = "SELECT checkin_date, status FROM check_ins WHERE user_habit_id = ? ORDER BY checkin_date DESC";
        
        List<CheckInStatus> history = jdbcTemplate.query(sql, (rs, rowNum) -> new CheckInStatus(
                rs.getDate("checkin_date").toLocalDate(),
                rs.getString("status")
        ), userHabitId);

        int currentStreak = 0;
        int longestStreak = 0;
        int totalClean = 0;
        LocalDate lastDate = null;

        if (!history.isEmpty()) {
            lastDate = history.get(0).date();
            
            // Calculate current streak (counting backwards until a slip or missing day)
            LocalDate expectedDate = LocalDate.now();
            
            // If they haven't checked in today yet, the expected date to start counting from is yesterday
            if (!history.get(0).date().equals(expectedDate)) {
                expectedDate = LocalDate.now().minusDays(1);
            }

            for (CheckInStatus checkIn : history) {
                if (checkIn.status().equals("clean")) {
                    totalClean++;
                }

                // If this check-in is the day we expected and it's clean, add to current streak
                if (checkIn.date().equals(expectedDate) && checkIn.status().equals("clean")) {
                    currentStreak++;
                    expectedDate = expectedDate.minusDays(1);
                } else if (checkIn.date().isAfter(expectedDate)) {
                    // Ignore future dates if any
                    continue;
                } else {
                    // Break the current streak chain
                    expectedDate = LocalDate.MIN; // prevent further matches for current streak
                }
            }

            // Calculate longest streak (just iterate forward over all clean chains)
            int tempStreak = 0;
            LocalDate prevDate = null;
            // Iterate history backwards (chronological order)
            for (int i = history.size() - 1; i >= 0; i--) {
                CheckInStatus checkIn = history.get(i);
                if (checkIn.status().equals("clean")) {
                    if (prevDate == null || checkIn.date().equals(prevDate.plusDays(1))) {
                        tempStreak++;
                    } else {
                        tempStreak = 1; // broken chain (skipped days)
                    }
                } else {
                    tempStreak = 0; // slip
                }
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
                prevDate = checkIn.date();
            }
        }

        streakRepository.upsert(userHabitId, currentStreak, longestStreak, lastDate, totalClean);
        log.info("Recalculated streak for {}: current={}, longest={}, clean={}", userHabitId, currentStreak, longestStreak, totalClean);
    }

    public List<StreakModel> getStreakSummary(String userId) {
        List<UserHabitModel> habits = habitService.getUserHabits(userId);
        return habits.stream()
                .map(h -> streakRepository.findByUserHabitId(h.id())
                        .orElse(new StreakModel(null, h.id(), 0, 0, null, 0, null, null)))
                .collect(Collectors.toList());
    }

    @Transactional
    public void resetStreak(UUID userHabitId) {
        streakRepository.resetStreak(userHabitId);
        log.info("Reset streak for userHabit {}", userHabitId);
    }

    private record CheckInStatus(LocalDate date, String status) {}
}
