import { apiFetch } from "./client";
import { JournalEntry, JournalEntryRequest } from "./types";

/**
 * Saves or updates a journal entry for the authenticated user.
 * 
 * @param req The journal entry data (date, content, mood, triggers, etc.).
 * @returns The UUID of the created or updated entry.
 */
export async function saveEntry(req: JournalEntryRequest): Promise<string> {
  return apiFetch<string>("/journal", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

/**
 * Retrieves a list of journal entries for the current user.
 * 
 * @param limit The maximum number of entries to return (default 30).
 * @returns A list of journal entries.
 */
export async function getEntries(limit: number = 30): Promise<JournalEntry[]> {
  return apiFetch<JournalEntry[]>(`/journal?limit=${limit}`);
}

/**
 * Retrieves a specific journal entry by its date.
 * 
 * @param date The date of the entry in YYYY-MM-DD format.
 * @returns The journal entry for the requested date.
 */
export async function getEntry(date: string): Promise<JournalEntry> {
  return apiFetch<JournalEntry>(`/journal/${date}`);
}

/**
 * Retrieves journal entries shared with the current user by their friends.
 * 
 * @returns A list of shared journal entries.
 */
export async function getSharedEntries(): Promise<JournalEntry[]> {
  return apiFetch<JournalEntry[]>("/journal/shared");
}
