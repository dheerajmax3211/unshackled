/**
 * Formats a number as currency based on the provided code (defaults to INR).
 */
export function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates money saved based on habit configuration and clean days.
 * Mirrors backend calculation logic for optimistic UI updates.
 */
export function calculateMoneySaved(habitConfig: any, daysClean: number): number {
  if (!habitConfig) return 0;
  
  let dailyCost = 0;
  
  switch (habitConfig.habitId) {
    case 'smoking':
    case 'chewing_tobacco':
      dailyCost = (habitConfig.cigarettesPerDay || 0) * (habitConfig.costPerCigarette || 0);
      break;
    case 'drinking':
      // cost per week = costPerSession * sessionsPerWeek
      dailyCost = ((habitConfig.drinksPerWeek || 0) * (habitConfig.costPerSession || 0)) / 7;
      break;
    case 'vaping':
      dailyCost = ((habitConfig.podsPerWeek || 0) * (habitConfig.podCost || 0)) / 7;
      break;
    case 'sugar_junk_food':
    case 'gambling':
      dailyCost = (habitConfig.spendPerWeek || 0) / 7;
      break;
    case 'custom':
    case 'pornography':
    case 'social_media':
      dailyCost = habitConfig.customSpendPerDay || 0;
      break;
    default:
      dailyCost = 0;
  }

  return Math.floor(dailyCost * daysClean);
}
