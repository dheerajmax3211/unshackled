/**
 * Returns the brand color class for a specific habit.
 */
export function getHabitColor(slug: string): string {
  const colors: Record<string, string> = {
    smoking: "text-rose-500",
    drinking: "text-amber-500",
    vaping: "text-cyan-500",
    porn: "text-purple-500",
    social_media: "text-blue-500",
    sugar: "text-pink-500",
    gambling: "text-emerald-500",
    custom: "text-brand-blue",
  };
  return colors[slug] || colors.custom;
}

/**
 * Returns the streak tier based on days clean.
 */
export function getStreakTier(days: number): 'beginner' | 'building' | 'strong' | 'legendary' {
  if (days >= 365) return 'legendary';
  if (days >= 90) return 'strong';
  if (days >= 30) return 'building';
  return 'beginner';
}

/**
 * Returns an encouraging milestone message.
 */
export function getMilestoneMessage(days: number): string {
  if (days >= 365) return "Absolute Sovereignty. You are a legend.";
  if (days >= 90) return "The chains are broken. Maintain the path.";
  if (days >= 30) return "One month of freedom. Your mind is clearing.";
  if (days >= 7) return "The first week is the hardest. You've conquered it.";
  return "Every clean hour counts. Stay focused.";
}
