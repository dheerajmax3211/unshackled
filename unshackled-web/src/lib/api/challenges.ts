import { apiFetch } from "./client";
import { Challenge, SendChallengeRequest } from "./types";

/**
 * Sends a new accountability challenge to a friend.
 * 
 * @param req The challenge request details (receiverId, type, habit).
 * @returns The newly created challenge object.
 */
export async function sendChallenge(req: SendChallengeRequest): Promise<Challenge> {
  return apiFetch<Challenge>("/challenges", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

/**
 * Retrieves a signed upload URL for providing proof for a challenge.
 * This URL points to the Supabase Storage bucket.
 * 
 * @param challengeId The UUID of the challenge.
 * @returns An object containing the signed upload URL.
 */
export async function getUploadUrl(challengeId: string): Promise<{ uploadUrl: string }> {
  return apiFetch<{ uploadUrl: string }>(`/challenges/upload-url/${challengeId}`);
}

/**
 * Confirms that the proof (photo/video) has been successfully uploaded to storage.
 * Triggers backend verification (e.g., EXIF check).
 * 
 * @param challengeId The UUID of the challenge.
 * @param storagePath The path where the file was saved in the storage bucket.
 * @returns A confirmation message.
 */
export async function confirmUpload(
  challengeId: string,
  storagePath: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/challenges/${challengeId}/confirm`, {
    method: "POST",
    body: JSON.stringify({ storagePath }),
  });
}

/**
 * Submits a review for a challenge received from a friend.
 * 
 * @param challengeId The UUID of the challenge.
 * @param approve Whether to approve or reject the proof.
 * @param note An optional note for the friend.
 * @returns A confirmation message.
 */
export async function reviewChallenge(
  challengeId: string,
  approve: boolean,
  note?: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/challenges/${challengeId}/review`, {
    method: "POST",
    body: JSON.stringify({ approve, note }),
  });
}

/**
 * Retrieves the challenge history (sent and received) for the authenticated user.
 * 
 * @returns A list of challenges.
 */
export async function getChallenges(): Promise<Challenge[]> {
  return apiFetch<Challenge[]>("/challenges");
}
