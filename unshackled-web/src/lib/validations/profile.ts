import * as z from "zod";

/**
 * Schema for updating user profile settings.
 * Task F-18.4
 */
export const updateProfileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(50),
  bio: z.string().max(200, "Bio must be under 200 characters.").optional(),
  avatarUrl: z.string().url("Please provide a valid image URL.").optional().or(z.literal("")),
  location: z.string().max(50).optional(),
  
  // Notification preferences
  notificationPrefs: z.object({
    dailyReminder: z.boolean().default(true),
    weeklyReport: z.boolean().default(true),
    challengeAlerts: z.boolean().default(true),
    friendMilestones: z.boolean().default(true),
  }).optional(),
  
  // Currency/Region
  currency: z.string().length(3).optional(),
  country: z.string().min(2).optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
