import { apiFetch } from "./client";
import { AddHabitRequest, Habit, UserHabit } from "./types";

/**
 * Retrieves all pre-defined habits available in the system (Smoking, Drinking, etc.).
 * Used for rendering the habit selection interface.
 */
export async function getAllHabits(): Promise<Habit[]> {
  return apiFetch<Habit[]>("/habits");
}

/**
 * Retrieves all habits currently being tracked by the authenticated user.
 */
export async function getMyHabits(): Promise<UserHabit[]> {
  return apiFetch<UserHabit[]>("/habits/mine");
}

/**
 * Adds a new habit to the authenticated user's tracking list.
 * 
 * @param req Configuration and quit date for the new habit.
 */
export async function addHabit(req: AddHabitRequest): Promise<UserHabit> {
  return apiFetch<UserHabit>("/habits/mine", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

/**
 * Updates the configuration for an existing tracked habit.
 * 
 * @param id The UUID of the UserHabit entry.
 * @param req The updated configuration.
 */
export async function updateHabit(id: string, req: AddHabitRequest): Promise<UserHabit> {
  return apiFetch<UserHabit>(`/habits/mine/${id}`, {
    method: "PUT",
    body: JSON.stringify(req),
  });
}

/**
 * Deactivates tracking for a specific habit (soft delete).
 * 
 * @param id The UUID of the UserHabit entry.
 */
export async function deactivateHabit(id: string): Promise<void> {
  return apiFetch<void>(`/habits/mine/${id}`, {
    method: "DELETE",
  });
}

/**
 * Submits a daily check-in or a relapse (slip) for a specific habit.
 * 
 * @param req The check-in request data (notes, mood, userHabitId).
 */
export async function submitCheckIn(req: { userHabitId: string; notes?: string; mood?: string }): Promise<void> {
  return apiFetch<void>("/habits/check-in", {
    method: "POST",
    body: JSON.stringify(req),
  });
}
