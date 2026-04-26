import { apiFetch } from "./client";
import { OnboardingRequest } from "./types";

/**
 * Submits the full onboarding payload to the backend.
 * This includes user profile setup and the initial habits selected.
 * 
 * @param req The onboarding request payload.
 * @returns A success message.
 */
export async function completeOnboarding(req: OnboardingRequest): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/onboarding/complete", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

/**
 * Checks the onboarding status of the currently authenticated user.
 * Primarily used by the application router to determine if a user should be 
 * redirected to the onboarding flow or the dashboard.
 * 
 * @returns An object containing the completion status.
 */
export async function getOnboardingStatus(): Promise<{ onboardingCompleted: boolean }> {
  return apiFetch<{ onboardingCompleted: boolean }>("/onboarding/status");
}
