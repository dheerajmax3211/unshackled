import * as z from "zod";

/**
 * Schema for adding a new habit outside of onboarding.
 * Task F-18.3
 */
export const addHabitSchema = z.object({
  habitId: z.string().min(1, "Please select a habit."),
  quitDate: z.string().or(z.date()),
  
  // Consumption stats (optional, but validated if present)
  cigarettesPerDay: z.number().min(0, "Must be positive.").optional(),
  costPerCigarette: z.number().min(0, "Must be positive.").optional(),
  
  drinksPerWeek: z.number().min(0).optional(),
  costPerSession: z.number().min(0).optional(),
  
  podsPerWeek: z.number().min(0).optional(),
  podCost: z.number().min(0).optional(),
  
  hoursPerDay: z.number().min(0).max(24).optional(),
  platforms: z.array(z.string()).optional(),
  
  spendPerWeek: z.number().min(0).optional(),
  
  // Custom
  customDescription: z.string().max(100).optional(),
  customTimePerDay: z.number().min(0).max(24).optional(),
  customSpendPerDay: z.number().min(0).optional(),
});

export type AddHabitValues = z.infer<typeof addHabitSchema>;
