package com.unshackled.api.service;

import com.unshackled.api.dto.DashboardSummary;
import com.unshackled.api.dto.GlobalStats;
import com.unshackled.api.dto.HabitStreakItem;
import com.unshackled.api.dto.HeatmapItem;
import com.unshackled.api.dto.MoneySavedBreakdown;
import com.unshackled.api.dto.WeeklyReportData;
import com.unshackled.api.model.BadgeModel;
import com.unshackled.api.model.DopamineSuggestionModel;
import com.unshackled.api.model.HabitModel;
import com.unshackled.api.model.StreakModel;
import com.unshackled.api.model.UserHabitModel;
import com.unshackled.api.model.UserModel;
import com.unshackled.api.model.WithdrawalModel;
import com.unshackled.api.repository.BadgeRepository;
import com.unshackled.api.repository.CheckInRepository;
import com.unshackled.api.repository.HabitRepository;
import com.unshackled.api.repository.StreakRepository;
import com.unshackled.api.repository.UserHabitRepository;
import com.unshackled.api.repository.UserRepository;
import com.unshackled.api.util.LevelDefinition;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service for computing habit analytics and financial savings.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CheckInRepository checkInRepository;
    private final UserHabitRepository userHabitRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final StreakRepository streakRepository;
    private final BadgeRepository badgeRepository;
    private final XpService xpService;
    private final ContentService contentService;
    private final JdbcTemplate jdbcTemplate;

    // Fix #4: Thread-safe caching using volatile + AtomicReference
    private volatile GlobalStats cachedStats = null;
    private volatile long lastCacheUpdate = 0;
    private static final long CACHE_DURATION = 3600000; // 1 hour

    /**
     * Aggregates all key user data for the main dashboard view.
     */
    public DashboardSummary getDashboardSummary(String userId) {
        UUID uId = UUID.fromString(userId);
        List<UserHabitModel> activeHabits = userHabitRepository.findByUserId(uId);

        BigDecimal totalToday = BigDecimal.ZERO;
        BigDecimal totalWeek = BigDecimal.ZERO;
        BigDecimal totalMonth = BigDecimal.ZERO;
        BigDecimal totalAllTime = BigDecimal.ZERO;

        List<HabitStreakItem> habits = new ArrayList<>();
        List<String> habitSlugs = new ArrayList<>();

        UUID primaryHabitId = null;
        int maxStreak = -1;

        for (UserHabitModel uh : activeHabits) {
            MoneySavedBreakdown savings = getMoneySaved(uh.id());
            totalToday = totalToday.add(savings.today());
            totalWeek = totalWeek.add(savings.week());
            totalMonth = totalMonth.add(savings.month());
            totalAllTime = totalAllTime.add(savings.allTime());

            HabitModel hModel = habitRepository.findById(uh.habitId()).orElse(null);
            if (hModel != null) {
                int currentStreak = streakRepository.findByUserHabitId(uh.id())
                        .map(StreakModel::currentStreak)
                        .orElse(0);
                
                habits.add(new HabitStreakItem(uh.id(), hModel.displayName(), hModel.icon(), currentStreak, uh.isActive()));
                habitSlugs.add(hModel.slug());

                // Pick the habit with the highest streak to show specific content for (prioritizing active ones)
                if (uh.isActive() && (primaryHabitId == null || currentStreak >= maxStreak)) {
                    maxStreak = currentStreak;
                    primaryHabitId = uh.habitId(); // FIXED: Use the Global Habit ID for content lookup
                }
            }
        }

        // Gamification
        int totalXp = xpService.getTotalXp(userId);
        LevelDefinition.Level level = xpService.getUserLevel(userId);
        
        // Recent badges (top 5)
        List<BadgeModel> recentBadges = badgeRepository.findEarnedByUserId(uId).stream()
                .limit(5)
                .toList();

        // Content
        WithdrawalModel todayMessage = null;
        if (primaryHabitId != null) {
            todayMessage = contentService.getWithdrawalMessage(primaryHabitId, maxStreak).orElse(null);
        }

        List<DopamineSuggestionModel> dopamineSuggestions = 
                contentService.getDopamineSuggestions(habitSlugs);

        return new DashboardSummary(
                habits,
                totalToday,
                totalWeek,
                totalMonth,
                totalAllTime,
                level.levelNumber(),
                totalXp,
                recentBadges,
                todayMessage,
                dopamineSuggestions
        );
    }

    /**
     * Calculates the money saved for a specific user habit across different timeframes.
     */
    public MoneySavedBreakdown getMoneySaved(UUID userHabitId) {
        UserHabitModel userHabit = userHabitRepository.findById(userHabitId)
                .orElseThrow(() -> new IllegalArgumentException("User habit not found: " + userHabitId));

        HabitModel habit = habitRepository.findById(userHabit.habitId())
                .orElseThrow(() -> new IllegalArgumentException("Habit definition not found: " + userHabit.habitId()));

        LocalDate today = LocalDate.now();
        
        int allTimeClean = checkInRepository.countCleanDaysSince(userHabitId, LocalDate.of(2000, 1, 1));
        int monthClean = checkInRepository.countCleanDaysSince(userHabitId, today.minusDays(30));
        int weekClean = checkInRepository.countCleanDaysSince(userHabitId, today.minusDays(7));
        int todayClean = checkInRepository.countCleanDaysSince(userHabitId, today);

        return new MoneySavedBreakdown(
                calculateSavings(userHabit, habit.slug(), todayClean),
                calculateSavings(userHabit, habit.slug(), weekClean),
                calculateSavings(userHabit, habit.slug(), monthClean),
                calculateSavings(userHabit, habit.slug(), allTimeClean)
        );
    }

    /**
     * Calculates total money saved across all active habits for a user.
     */
    public double getUserSavings(String userId) {
        UUID uId = UUID.fromString(userId);
        List<UserHabitModel> activeHabits = userHabitRepository.findByUserId(uId);
        
        BigDecimal total = BigDecimal.ZERO;
        for (UserHabitModel uh : activeHabits) {
            MoneySavedBreakdown breakdown = getMoneySaved(uh.id());
            total = total.add(breakdown.allTime());
        }
        return total.doubleValue();
    }

    public List<HeatmapItem> getHeatmapData(UUID userHabitId, int months) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusMonths(months);

        return checkInRepository.findByUserHabitIdAndDateRange(userHabitId, start, end).stream()
                .map(checkIn -> new HeatmapItem(checkIn.checkinDate(), checkIn.status()))
                .toList();
    }

    /**
     * Returns platform-wide aggregate statistics with 1-hour caching.
     * Fix #4: Thread-safe via synchronized + volatile fields.
     */
    public synchronized GlobalStats getGlobalStats() {
        long now = System.currentTimeMillis();
        if (cachedStats != null && (now - lastCacheUpdate < CACHE_DURATION)) {
            return cachedStats;
        }

        // Fix #3: Use COALESCE in SQL to avoid null results on empty tables
        Long totalUsers = jdbcTemplate.queryForObject("SELECT COALESCE(COUNT(*), 0) FROM users", Long.class);
        Long totalHabits = jdbcTemplate.queryForObject("SELECT COALESCE(COUNT(*), 0) FROM user_habits", Long.class);
        Long totalCleanDays = jdbcTemplate.queryForObject("SELECT COALESCE(COUNT(*), 0) FROM check_ins WHERE status = 'clean'", Long.class);

        // Fix #15 + #22: Replace 'money' slug with actual habit slugs from seed data
        String moneySql = """
            WITH habit_clean_counts AS (
                SELECT user_habit_id, COUNT(*) as clean_days
                FROM check_ins
                WHERE status = 'clean'
                GROUP BY user_habit_id
            )
            SELECT COALESCE(SUM(
                CASE 
                    WHEN h.slug = 'smoking' THEN COALESCE(uh.cigarettes_per_day, 0) * COALESCE(uh.cost_per_cigarette, 0) * c.clean_days
                    WHEN h.slug = 'drinking' THEN COALESCE(uh.drinks_per_week, 0) * COALESCE(uh.cost_per_session, 0) / 7.0 * c.clean_days
                    WHEN h.slug = 'vaping' THEN COALESCE(uh.pods_per_week, 0) * COALESCE(uh.pod_cost, 0) / 7.0 * c.clean_days
                    WHEN h.slug IN ('sugar_junk_food', 'gambling') THEN COALESCE(uh.spend_per_week, 0) / 7.0 * c.clean_days
                    ELSE COALESCE(uh.custom_spend_per_day, 0) * c.clean_days
                END
            ), 0)
            FROM user_habits uh
            JOIN habits h ON uh.habit_id = h.id
            JOIN habit_clean_counts c ON uh.id = c.user_habit_id
        """;
        
        BigDecimal totalMoneySaved = jdbcTemplate.queryForObject(moneySql, BigDecimal.class);
        if (totalMoneySaved == null) totalMoneySaved = BigDecimal.ZERO;

        cachedStats = new GlobalStats(
                totalUsers != null ? totalUsers : 0L,
                totalHabits != null ? totalHabits : 0L,
                totalCleanDays != null ? totalCleanDays : 0L,
                totalMoneySaved.setScale(2, RoundingMode.HALF_UP)
        );
        lastCacheUpdate = now;
        
        return cachedStats;
    }

    /**
     * Calculates daily savings rate for a habit based on its slug and user configuration.
     * Fix #15: Properly handles all habit slugs from the seed data.
     */
    private BigDecimal calculateSavings(UserHabitModel config, String slug, int cleanDays) {
        if (cleanDays <= 0) return BigDecimal.ZERO;

        BigDecimal dailyRate = BigDecimal.ZERO;

        switch (slug) {
            case "smoking", "chewing_tobacco" -> {
                if (config.cigarettesPerDay() != null && config.costPerCigarette() != null) {
                    dailyRate = config.costPerCigarette().multiply(BigDecimal.valueOf(config.cigarettesPerDay()));
                }
            }
            case "drinking" -> {
                if (config.drinksPerWeek() != null && config.costPerSession() != null) {
                    dailyRate = config.costPerSession().multiply(BigDecimal.valueOf(config.drinksPerWeek()))
                            .divide(BigDecimal.valueOf(7), 2, RoundingMode.HALF_UP);
                }
            }
            case "vaping" -> {
                if (config.podsPerWeek() != null && config.podCost() != null) {
                    dailyRate = config.podCost().multiply(BigDecimal.valueOf(config.podsPerWeek()))
                            .divide(BigDecimal.valueOf(7), 2, RoundingMode.HALF_UP);
                }
            }
            case "sugar_junk_food", "gambling" -> {
                // Weekly spend-based habits
                if (config.spendPerWeek() != null) {
                    dailyRate = config.spendPerWeek().divide(BigDecimal.valueOf(7), 2, RoundingMode.HALF_UP);
                }
            }
            default -> {
                // Custom habits and time-based habits (pornography, social_media)
                if (config.customSpendPerDay() != null) {
                    dailyRate = config.customSpendPerDay();
                }
            }
        }

        return dailyRate.multiply(BigDecimal.valueOf(cleanDays)).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Computes time-series data for money saved (Daily, Weekly, Monthly).
     */
    public Map<String, List<Map<String, Object>>> getMoneyTimeSeries(UUID userHabitId) {
        UserHabitModel userHabit = userHabitRepository.findById(userHabitId)
                .orElseThrow(() -> new IllegalArgumentException("User habit not found"));
        HabitModel habit = habitRepository.findById(userHabit.habitId()).orElseThrow();
        
        LocalDate today = LocalDate.now();
        Map<String, List<Map<String, Object>>> series = new LinkedHashMap<>();

        // 1. Last 7 Days (Daily)
        List<Map<String, Object>> daily = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            int clean = checkInRepository.countCleanDaysSince(userHabitId, date) - 
                        checkInRepository.countCleanDaysSince(userHabitId, date.plusDays(1));
            // Actually, we want cumulative or per-day? Usually charts look better cumulative.
            // Let's provide absolute savings for that specific day.
            int dayClean = checkInRepository.countCleanDaysBetween(userHabitId, date, date);
            daily.add(Map.of("label", date.toString(), "value", calculateSavings(userHabit, habit.slug(), dayClean)));
        }
        series.put("daily", daily);

        // 2. Last 4 Weeks (Weekly)
        List<Map<String, Object>> weekly = new ArrayList<>();
        for (int i = 3; i >= 0; i--) {
            LocalDate start = today.minusWeeks(i).with(java.time.DayOfWeek.MONDAY);
            LocalDate end = start.plusDays(6);
            int weekClean = checkInRepository.countCleanDaysBetween(userHabitId, start, end);
            weekly.add(Map.of("label", "Week " + start.toString(), "value", calculateSavings(userHabit, habit.slug(), weekClean)));
        }
        series.put("weekly", weekly);

        // 3. Last 12 Months (Monthly)
        List<Map<String, Object>> monthly = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            LocalDate start = today.minusMonths(i).withDayOfMonth(1);
            LocalDate end = start.plusMonths(1).minusDays(1);
            int monthClean = checkInRepository.countCleanDaysBetween(userHabitId, start, end);
            monthly.add(Map.of("label", start.getMonth().name() + " " + start.getYear(), "value", calculateSavings(userHabit, habit.slug(), monthClean)));
        }
        series.put("monthly", monthly);

        return series;
    }

    public WeeklyReportData getWeeklyReportData(UUID userId) {
        UserModel user = userRepository.findById(userId).orElseThrow();
        List<UserHabitModel> habits = userHabitRepository.findByUserId(userId);

        int totalCleanDays = 0;
        BigDecimal totalSavings = BigDecimal.ZERO;
        List<WeeklyReportData.HabitProgress> progression = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(7);

        for (UserHabitModel uh : habits) {
            if (!uh.isActive()) continue;

            HabitModel hModel = habitRepository.findById(uh.habitId()).orElse(null);
            if (hModel == null) continue;

            int weekCleanCount = checkInRepository.countCleanDaysSince(uh.id(), sevenDaysAgo);
            BigDecimal weekSavings = calculateSavings(uh, hModel.slug(), weekCleanCount);
            
            int currentStreak = streakRepository.findByUserHabitId(uh.id())
                    .map(StreakModel::currentStreak)
                    .orElse(0);

            totalCleanDays += weekCleanCount;
            totalSavings = totalSavings.add(weekSavings);
            progression.add(new WeeklyReportData.HabitProgress(hModel.displayName(), currentStreak, weekCleanCount));
        }

        return new WeeklyReportData(
                userId,
                user.username(),
                totalCleanDays,
                totalSavings,
                progression
        );
    }
}
