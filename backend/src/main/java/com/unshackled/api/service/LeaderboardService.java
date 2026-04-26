package com.unshackled.api.service;

import com.unshackled.api.dto.LeaderboardEntry;
import com.unshackled.api.model.FriendModel;
import com.unshackled.api.repository.FriendRepository;
import com.unshackled.api.util.LevelDefinition;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Service for computing friend and global leaderboards.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final FriendRepository friendRepository;
    private final JdbcTemplate jdbcTemplate;

    // Fix #4: Thread-safe caching using volatile fields
    private volatile List<LeaderboardEntry> cachedGlobalLeaderboard = null;
    private volatile long lastGlobalUpdate = 0;
    private static final long CACHE_DURATION = 900000; // 15 minutes

    private final RowMapper<LeaderboardEntry> entryRowMapper = (rs, rowNum) -> {
        int totalXp = rs.getInt("total_xp");
        int level = LevelDefinition.getLevelForXp(totalXp).levelNumber();
        
        return new LeaderboardEntry(
                rs.getObject("user_id", UUID.class),
                rs.getString("username"),
                rs.getString("avatar_url"),
                rs.getInt("total_clean_days"),
                rs.getInt("longest_streak"),
                totalXp,
                level,
                0 // Rank will be assigned later
        );
    };

    /**
     * Gets a leaderboard including the user and their accepted friends.
     * Fix #29: Uses parameterized IN clause built from controlled UUID list.
     */
    public List<LeaderboardEntry> getFriendLeaderboard(String userId) {
        UUID uId = UUID.fromString(userId);
        List<FriendModel> friends = friendRepository.findFriendsByUserId(uId);
        
        List<UUID> userIds = new ArrayList<>();
        userIds.add(uId);
        for (FriendModel f : friends) {
            userIds.add(f.requesterId().equals(uId) ? f.addresseeId() : f.requesterId());
        }

        if (userIds.isEmpty()) {
            return Collections.emptyList();
        }

        String sql = """
            SELECT 
                u.id as user_id, 
                u.username, 
                u.avatar_url,
                COALESCE(SUM(s.total_clean_days), 0) as total_clean_days,
                COALESCE(MAX(s.longest_streak), 0) as longest_streak,
                COALESCE((SELECT SUM(xp_amount) FROM xp_events WHERE user_id = u.id), 0) as total_xp
            FROM users u
            LEFT JOIN user_habits uh ON u.id = uh.user_id
            LEFT JOIN streaks s ON uh.id = s.user_habit_id
            WHERE u.id = ANY(?)
            GROUP BY u.id, u.username, u.avatar_url
            ORDER BY total_clean_days DESC
        """;

        // Fix #29: Use PostgreSQL's ANY(array) syntax instead of String.format with IN clause
        UUID[] idArray = userIds.toArray(new UUID[0]);
        java.sql.Array sqlArray;
        try {
            sqlArray = jdbcTemplate.getDataSource().getConnection().createArrayOf("uuid", idArray);
        } catch (Exception e) {
            log.error("Failed to create SQL array for leaderboard query", e);
            return Collections.emptyList();
        }

        List<LeaderboardEntry> entries = jdbcTemplate.query(sql, entryRowMapper, sqlArray);

        // Assign ranks
        return assignRanks(entries);
    }

    /**
     * Gets the top users globally who have opted in.
     * Fix #4: Thread-safe via synchronized + volatile fields.
     */
    public synchronized List<LeaderboardEntry> getGlobalLeaderboard(int limit) {
        long now = System.currentTimeMillis();
        if (cachedGlobalLeaderboard != null && (now - lastGlobalUpdate < CACHE_DURATION)) {
            return cachedGlobalLeaderboard.stream().limit(limit).toList();
        }

        String sql = """
            SELECT 
                u.id as user_id, 
                u.username, 
                u.avatar_url,
                COALESCE(SUM(s.total_clean_days), 0) as total_clean_days,
                COALESCE(MAX(s.longest_streak), 0) as longest_streak,
                COALESCE((SELECT SUM(xp_amount) FROM xp_events WHERE user_id = u.id), 0) as total_xp
            FROM users u
            LEFT JOIN user_habits uh ON u.id = uh.user_id
            LEFT JOIN streaks s ON uh.id = s.user_habit_id
            WHERE u.leaderboard_opt_in = true
            GROUP BY u.id, u.username, u.avatar_url
            ORDER BY total_clean_days DESC
            LIMIT 100
        """;

        List<LeaderboardEntry> entries = jdbcTemplate.query(sql, entryRowMapper);
        List<LeaderboardEntry> rankedEntries = assignRanks(entries);

        cachedGlobalLeaderboard = rankedEntries;
        lastGlobalUpdate = now;

        return rankedEntries.stream().limit(limit).toList();
    }

    /**
     * Helper to assign sequential rank numbers to leaderboard entries.
     */
    private List<LeaderboardEntry> assignRanks(List<LeaderboardEntry> entries) {
        List<LeaderboardEntry> ranked = new ArrayList<>();
        for (int i = 0; i < entries.size(); i++) {
            LeaderboardEntry old = entries.get(i);
            ranked.add(new LeaderboardEntry(
                old.userId(), old.username(), old.avatarUrl(),
                old.totalCleanDays(), old.longestStreak(),
                old.totalXp(), old.level(), i + 1
            ));
        }
        return ranked;
    }
}
