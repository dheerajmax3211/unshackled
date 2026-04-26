import { apiFetch } from "./client";
import { DashboardSummary } from "./types";

/**
 * Retrieves a comprehensive summary for the dashboard.
 * Includes streaks, total money saved, levels, and active suggestions.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>("/dashboard/summary");
}
