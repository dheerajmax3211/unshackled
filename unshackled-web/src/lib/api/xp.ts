import { apiFetch } from "./client";
import { XpSummary } from "./types";

/**
 * Retrieves the experience points (XP) and leveling summary for the authenticated user.
 * This includes total XP, current level details, XP needed for the next level, 
 * and a history of recent XP-earning events.
 * 
 * @returns A comprehensive XP and leveling summary.
 */
export async function getXpSummary(): Promise<XpSummary> {
  return apiFetch<XpSummary>("/xp/summary");
}
