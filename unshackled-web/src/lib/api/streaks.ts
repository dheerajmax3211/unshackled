import { apiFetch } from "./client";
import { Streak } from "./types";

/**
 * Retrieves a summary of all active streaks for the currently authenticated user.
 * 
 * @returns A list of streak models containing current and longest streak counts.
 */
export async function getMyStreaks(): Promise<Streak[]> {
  return apiFetch<Streak[]>("/streaks");
}

/**
 * Retrieves the streak information for a specific user habit.
 * 
 * @param userHabitId The UUID of the UserHabit entry.
 * @returns The streak model for the requested habit.
 */
export async function getStreakForHabit(userHabitId: string): Promise<Streak> {
  return apiFetch<Streak>(`/streaks/${userHabitId}`);
}
