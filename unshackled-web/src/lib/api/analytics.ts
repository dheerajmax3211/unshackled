import { apiFetch } from "./client";
import { DashboardSummary, GlobalStats, HeatmapItem, MoneySavedBreakdown } from "./types";

/**
 * Retrieves a high-level summary of the user's progress for the main dashboard.
 * Includes total savings, days quit, active streaks, and recent achievements.
 */
export async function getDashboard(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>("/analytics/dashboard");
}

/**
 * Retrieves a detailed financial breakdown of savings for a specific habit.
 * 
 * @param userHabitId The UUID of the UserHabit entry.
 * @returns An object containing savings for today, week, month, and all-time.
 */
export async function getMoneySaved(userHabitId: string): Promise<MoneySavedBreakdown> {
  return apiFetch<MoneySavedBreakdown>(`/analytics/money/${userHabitId}`);
}

/**
 * Retrieves heatmap data representing check-in consistency over time.
 * 
 * @param userHabitId The UUID of the UserHabit entry.
 * @param months Number of months of history to fetch (default 12).
 * @returns A list of date-count pairs for rendering the activity heatmap.
 */
export async function getHeatmap(
  userHabitId: string,
  months: number = 12
): Promise<HeatmapItem[]> {
  return apiFetch<HeatmapItem[]>(`/analytics/heatmap/${userHabitId}?months=${months}`);
}

/**
 * Retrieves aggregated global statistics across all users.
 * Used for the community/landing page.
 */
export async function getGlobalStats(): Promise<GlobalStats> {
  return apiFetch<GlobalStats>("/analytics/global");
}
