package com.unshackled.api.util;

/**
 * Defines the leveling progression based on total XP.
 */
public class LevelDefinition {

    public record Level(int levelNumber, String name, int xpRequired) {}

    public static final Level[] LEVELS = new Level[] {
            new Level(1, "Spark", 0),
            new Level(2, "Awakened", 150),
            new Level(3, "Grounded", 400),
            new Level(4, "Resolute", 800),
            new Level(5, "Rewiring", 1500),
            new Level(6, "Unbound", 2500),
            new Level(7, "Reclaimer", 4000),
            new Level(8, "Forged", 6000),
            new Level(9, "Enduring", 9000),
            new Level(10, "Reclaimed", 13000),
            new Level(15, "Sovereign", 30000),
            new Level(20, "Unshackled", 75000)
    };

    /**
     * Given an XP amount, returns the current Level object.
     */
    public static Level getLevelForXp(int xp) {
        Level currentLevel = LEVELS[0];
        for (Level level : LEVELS) {
            if (xp >= level.xpRequired()) {
                currentLevel = level;
            } else {
                break;
            }
        }
        return currentLevel;
    }

    /**
     * Given an XP amount, returns the XP required for the *next* level,
     * or -1 if at max level.
     */
    public static int getXpToNextLevel(int xp) {
        for (Level level : LEVELS) {
            if (xp < level.xpRequired()) {
                return level.xpRequired() - xp;
            }
        }
        return -1; // Max level reached
    }
}
