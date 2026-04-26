import { apiFetch } from "./client";
import { Badge, BadgeStatus } from "./types";

/**
 * Retrieves the full list of badges available in the system, 
 * including whether the current user has earned each one.
 * 
 * @returns A list of badges with their earned status for the current user.
 */
export async function getBadges(): Promise<BadgeStatus[]> {
  return apiFetch<BadgeStatus[]>("/badges");
}

/**
 * Retrieves only the badges that the authenticated user has already earned.
 * 
 * @returns A list of earned badges.
 */
export async function getEarnedBadges(): Promise<Badge[]> {
  return apiFetch<Badge[]>("/badges/earned");
}
