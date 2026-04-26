import * as z from "zod";

/**
 * Individual habit configuration schema within onboarding.
 */
const habitConfigSchema = z.object({
  habitId: z.string(),
  quitDate: z.string().or(z.date()),
  
  // Optional stats based on habit type
  cigarettesPerDay: z.number().min(0).optional(),
  costPerCigarette: z.number().min(0).optional(),
  drinksPerWeek: z.number().min(0).optional(),
  costPerSession: z.number().min(0).optional(),
  podsPerWeek: z.number().min(0).optional(),
  podCost: z.number().min(0).optional(),
  hoursPerDay: z.number().min(0).max(24).optional(),
  platforms: z.array(z.string()).optional(),
  spendPerWeek: z.number().min(0).optional(),
  
  // Custom
  customDescription: z.string().optional(),
  customTimePerDay: z.number().min(0).max(24).optional(),
  customSpendPerDay: z.number().min(0).optional(),
});

/**
 * Schema for the full onboarding flow payload.
 * Task F-18.2
 */
export const onboardingSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  country: z.string().min(2, "Please select a country."),
  currency: z.string().length(3, "Invalid currency code."),
  isSupporter: z.boolean(),
  quitDate: z.string().or(z.date()),
  habits: z.array(habitConfigSchema).min(1, "Please select at least one habit to break."),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;
