import { apiFetch } from "./client";
import { CheckIn, CheckInRequest } from "./types";

/**
 * Submits a daily check-in for a specific habit.
 * This triggers streak updates, savings calculations, and XP rewards on the backend.
 * 
 * @param req The check-in request payload (userHabitId, notes, mood).
 * @returns The check-in response containing XP earned and status.
 */
export async function submitCheckIn(req: CheckInRequest): Promise<{ checkIn: CheckIn; xpEarned: number }> {
  return apiFetch<{ checkIn: CheckIn; xpEarned: number }>("/checkins", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

/**
 * Retrieves the check-in history for a specific user habit over a given period.
 * 
 * @param userHabitId The UUID of the UserHabit entry.
 * @param days The number of days to look back (default 30).
 * @returns A list of check-in entries.
 */
export async function getCheckInHistory(
  userHabitId: string,
  days: number = 30
): Promise<CheckIn[]> {
  return apiFetch<CheckIn[]>(`/checkins/history/${userHabitId}?days=${days}`);
}

/**
 * Checks if the authenticated user has already checked in for at least one habit today.
 * 
 * @returns An object containing the today's check-in status.
 */
export async function getTodayStatus(): Promise<{ hasCheckedInToday: boolean }> {
  return apiFetch<{ hasCheckedInToday: boolean }>("/checkins/today");
}
