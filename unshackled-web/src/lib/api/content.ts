import { apiFetch } from "./client";
import { DopamineSuggestion, HealthMilestone, MoneySuggestion, WithdrawalMessage } from "./types";

/**
 * Retrieves a context-specific withdrawal message for a user based on their quit duration.
 * 
 * @param habitId The UUID of the habit.
 * @param dayOffset The number of days since the quit date.
 * @returns A withdrawal message object or throws 404 if not found.
 */
export async function getWithdrawalMessage(
  habitId: string,
  dayOffset: number
): Promise<WithdrawalMessage> {
  return apiFetch<WithdrawalMessage>(`/content/withdrawal?habitId=${habitId}&dayOffset=${dayOffset}`);
}

/**
 * Retrieves a list of dopamine-replacement activities based on the user's quitting habits.
 * 
 * @param habits A comma-separated list of habit names/categories (e.g., "smoking,drinking").
 * @returns A list of dopamine suggestions.
 */
export async function getDopamineSuggestions(habits?: string): Promise<DopamineSuggestion[]> {
  const query = habits ? `?habits=${encodeURIComponent(habits)}` : "";
  return apiFetch<DopamineSuggestion[]>(`/content/dopamine${query}`);
}

/**
 * Retrieves a suggestion for what to buy with the money saved from quitting.
 * 
 * @param amount The current amount of money saved.
 * @param country The user's country code (default "IN").
 * @returns A money suggestion object or throws 404.
 */
export async function getMoneySuggestion(
  amount: number,
  country: string = "IN"
): Promise<MoneySuggestion> {
  return apiFetch<MoneySuggestion>(`/content/money?amount=${amount}&country=${country}`);
}

/**
 * Retrieves health milestones achieved based on the user's quit duration for a specific habit.
 * 
 * @param habitId The UUID of the habit.
 * @param dayOffset The number of days since the quit date.
 * @returns A list of health milestones achieved.
 */
export async function getHealthMilestones(
  habitId: string,
  dayOffset: number
): Promise<HealthMilestone[]> {
  return apiFetch<HealthMilestone[]>(`/content/health-milestones?habitId=${habitId}&dayOffset=${dayOffset}`);
}
