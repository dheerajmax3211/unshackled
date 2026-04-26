import * as z from "zod";

/**
 * Schema for sending a challenge to a friend.
 * Task F-18.5 (Modified from Arch)
 */
export const sendChallengeSchema = z.object({
  challengedUserId: z.string().uuid("Invalid user selected."),
  habitId: z.string().min(1, "Please select a habit to challenge."),
  message: z.string().max(200, "Message cannot exceed 200 characters.").optional(),
});

/**
 * Schema for responding to a challenge with proof.
 */
export const challengeResponseSchema = z.object({
  proofImageUrl: z.string().url("Proof image is required."),
  note: z.string().max(200).optional(),
});

export type SendChallengeValues = z.infer<typeof sendChallengeSchema>;
export type ChallengeResponseValues = z.infer<typeof challengeResponseSchema>;
