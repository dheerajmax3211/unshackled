import { apiFetch } from "./client";
import { LeaderboardEntry } from "./types";

/**
 * Retrieves the leaderboard containing only the authenticated user's friends.
 * 
 * @returns A list of leaderboard entries for friends.
 */
export async function getFriendLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiFetch<LeaderboardEntry[]>("/leaderboard/friends");
}

/**
 * Retrieves the global leaderboard across all users.
 * 
 * @param limit The maximum number of entries to return (default 100).
 * @returns A list of leaderboard entries for the top users globally.
 */
export async function getGlobalLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
  return apiFetch<LeaderboardEntry[]>(`/leaderboard/global?limit=${limit}`);
}
