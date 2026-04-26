import * as z from "zod";

/**
 * Schema for creating or updating a journal entry.
 * Task F-18.5
 */
export const journalEntrySchema = z.object({
  content: z.string()
    .max(5000, "Entry is too long (max 5000 characters).")
    .optional()
    .or(z.literal("")),
  moodScore: z.number().min(1).max(10, "Mood score must be between 1 and 10."),
  triggers: z.array(z.string()).max(10, "Maximum of 10 triggers allowed.").optional(),
  isPublic: z.boolean().default(false),
});

export type JournalEntryValues = z.infer<typeof journalEntrySchema>;
