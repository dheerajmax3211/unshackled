import { create } from "zustand";
import { UserHabit, Streak } from "@/lib/api/types";

interface HabitState {
  habits: UserHabit[];
  streaks: Record<string, Streak>; // Keyed by userHabitId
  loading: boolean;
  
  // Actions
  setHabits: (habits: UserHabit[]) => void;
  setStreaks: (streaks: Streak[]) => void;
  addHabit: (habit: UserHabit) => void;
  removeHabit: (habitId: string) => void;
  updateStreak: (userHabitId: string, streak: Streak) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Global store for user habits and their associated streaks.
 * Efficiently manages the user's progress state across multiple habits.
 */
export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  streaks: {},
  loading: false,

  /**
   * Initializes the habits list.
   */
  setHabits: (habits) => set({ habits }),

  /**
   * Initializes or updates the streaks map.
   * Converts the list of streaks from the API into a lookup record for O(1) access.
   */
  setStreaks: (streakList) => {
    const streakMap: Record<string, Streak> = {};
    streakList.forEach((s) => {
      streakMap[s.userHabitId] = s;
    });
    set({ streaks: streakMap });
  },

  /**
   * Appends a new habit to the list (e.g., after successful creation).
   */
  addHabit: (habit) =>
    set((state) => ({
      habits: [...state.habits, habit],
    })),

  /**
   * Removes a habit from the local state.
   */
  removeHabit: (habitId) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== habitId),
      // We also clean up the associated streak
      streaks: Object.fromEntries(
        Object.entries(state.streaks).filter(([id]) => id !== habitId)
      ),
    })),

  /**
   * Updates the streak for a specific habit (e.g., after a check-in).
   */
  updateStreak: (userHabitId, streak) =>
    set((state) => ({
      streaks: {
        ...state.streaks,
        [userHabitId]: streak,
      },
    })),

  /**
   * Manually toggles the loading state during API calls.
   */
  setLoading: (loading) => set({ loading }),
}));
