export const mockGlobalStats = {
  totalUsers: 12483,
  totalHabitsTracked: 15342,
  totalCleanDays: 142857,
  totalMoneySaved: 28450000,
};

export const mockUserProfile = {
  id: "629d7989-2318-4f1d-be03-ebaee47e6fcc",
  username: "recovery_pro",
  displayName: "Alex Rivera",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera",
  bio: "Sharing my journey to stay accountable.",
  country: "IN",
  currency: "INR",
  isSupporter: false,
  premiumStatus: "free" as const,
  level: 7,
  xp: 4190,
  xpToNextLevel: 1810,
  levelName: "Reclaimer",
};

export const mockDashboardSummary = {
  habits: [
    { userHabitId: "2a77ddf7-18fc-4741-84a2-5371f789d67d", habitName: "Smoking", habitIcon: "🚬", currentStreak: 47, isActive: true },
    { userHabitId: "2ad05b82-66c3-4aa8-b4ad-3348ecd35569", habitName: "Social Media", habitIcon: "📱", currentStreak: 12, isActive: true },
  ],
  totalSavedToday: 310,
  totalSavedWeek: 2170,
  totalSavedMonth: 8680,
  totalSavedAllTime: 47200,
  level: 7,
  xp: 4190,
  recentBadges: [
    { id: "1", slug: "thirty_days", name: "30-Day Legend", description: "One month. Dopamine is rebuilding.", rarity: "epic", xpReward: 500 },
    { id: "2", slug: "two_weeks", name: "Two Week Titan", description: "14 days. Your cilia are regenerating.", rarity: "rare", xpReward: 200 },
    { id: "3", slug: "first_week", name: "First Week Warrior", description: "7 days. Your brain is already changing.", rarity: "common", xpReward: 100 },
  ],
  todayMessage: {
    id: "1",
    message: "Your lungs are already starting to clear. The carbon monoxide in your blood is dropping.",
    tone: "empathetic",
  },
  dopamineSuggestions: [
    { id: "1", suggestion: "Take a 5-minute ice-cold shower to trigger a massive natural dopamine spike.", category: "physical", difficulty: "hard" },
    { id: "2", suggestion: "Go for a 15-minute run. The 'runner's high' is a real biochemical reset.", category: "physical", difficulty: "medium" },
    { id: "3", suggestion: "Practice 4-7-8 breathing: In for 4, hold for 7, exhale for 8. Repeat 4 times.", category: "mindfulness", difficulty: "easy" },
  ],
};

export const mockHealthMilestones = [
  { dayOffset: 1, title: "CO Levels Normal", description: "Carbon monoxide levels in your blood have dropped to normal." },
  { dayOffset: 2, title: "Nerve Endings Regrow", description: "Your ability to smell and taste is enhanced as nerve endings start to regrow." },
  { dayOffset: 3, title: "Breathing Easier", description: "Your bronchial tubes have started to relax, making breathing easier." },
  { dayOffset: 7, title: "First Week Complete", description: "Your risk of heart attack begins to drop as blood thins and clots become less likely." },
  { dayOffset: 14, title: "Circulation Improving", description: "Blood flow to your hands and feet has improved significantly." },
  { dayOffset: 30, title: "Lungs Regenerating", description: "Cilia in your lungs have started to regrow, reducing infection risk." },
  { dayOffset: 90, title: "Dopamine Baseline", description: "Your dopamine receptors are nearly back to pre-addiction baseline." },
  { dayOffset: 365, title: "Heart Risk Halved", description: "Your risk of coronary heart disease is now half that of someone still using." },
];

export const mockWithdrawalMessages = [
  { dayOffset: 1, message: "Day 1. Your body is already starting to heal. You've made the hardest decision already — the decision to start." },
  { dayOffset: 3, message: "Day 3. This is the hardest day for most people. Your brain is fighting hard right now. That feeling of doom is a withdrawal symptom — it is not the truth.", tone: "empathetic" },
  { dayOffset: 7, message: "Day 7. You've made it through the worst. The physical dependence is breaking. From here, every day gets statistically easier." },
];

export const mockBadges = [
  { earned: true, badge: { slug: "first_day", name: "Day One", description: "You started. That's everything.", rarity: "common" } },
  { earned: true, badge: { slug: "first_week", name: "First Week Warrior", description: "7 days. Your brain is already changing.", rarity: "common" } },
  { earned: true, badge: { slug: "two_weeks", name: "Two Week Titan", description: "14 days. Your cilia are regenerating.", rarity: "rare" } },
  { earned: true, badge: { slug: "thirty_days", name: "30-Day Legend", description: "One month. Dopamine is rebuilding.", rarity: "epic" } },
  { earned: true, badge: { slug: "rising_again", name: "Rising Again", description: "Came back after a slip and held for 7 days.", rarity: "epic" } },
  { earned: true, badge: { slug: "money_saver_1k", name: "Saver", description: "Saved your first ₹1,000.", rarity: "common" } },
  { earned: true, badge: { slug: "money_saver_10k", name: "Smart Money", description: "Saved ₹10,000. That's a real number.", rarity: "rare" } },
  { earned: false, badge: { slug: "sixty_days", name: "60-Day Champion", description: "Two months. The habit is losing its grip.", rarity: "epic" } },
  { earned: false, badge: { slug: "ninety_days", name: "Ninety Day Sovereign", description: "Three months. You have reclaimed yourself.", rarity: "legendary" } },
  { earned: false, badge: { slug: "one_year", name: "Year One Legend", description: "One year. You are a different person now.", rarity: "legendary" } },
  { earned: false, badge: { slug: "accountability_champ", name: "Accountability Champ", description: "Completed 10 photo challenges.", rarity: "rare" } },
  { earned: false, badge: { slug: "dopamine_rebuilt", name: "Dopamine Rebuilt", description: "Hit Day 90. Your receptors are nearly baseline.", rarity: "legendary" } },
];

export const mockLeaderboard = [
  { userId: "1", username: "SuperQuitter", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuperQ", totalCleanDays: 145, longestStreak: 90, totalXp: 8500, level: 14, rank: 1 },
  { userId: "2", username: "warrior_three", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=W3", totalCleanDays: 89, longestStreak: 67, totalXp: 5200, level: 11, rank: 2 },
  { userId: "you", username: "You", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", totalCleanDays: 57, longestStreak: 47, totalXp: 4190, level: 7, rank: 3 },
  { userId: "3", username: "legend_608", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=L608", totalCleanDays: 42, longestStreak: 30, totalXp: 2800, level: 5, rank: 4 },
  { userId: "4", username: "phoenix_rising", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PR", totalCleanDays: 21, longestStreak: 14, totalXp: 1200, level: 3, rank: 5 },
];

export const mockFriends = [
  { id: "1", username: "warrior_three", displayName: "Sarah Chen", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=W3", currentStreak: 67, status: "accepted" },
  { id: "2", username: "phoenix_rising", displayName: "Marcus Webb", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PR", currentStreak: 14, status: "accepted" },
  { id: "3", username: "legend_608", displayName: "Priya Sharma", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=L608", currentStreak: 30, status: "accepted" },
];

export const mockNotifications = [
  { id: "1", type: "BADGE_EARNED", title: "New Badge Earned! 🏅", body: "You've earned the '30-Day Legend' badge.", isRead: false, createdAt: "2026-04-28T09:44:06Z" },
  { id: "2", type: "MILESTONE", title: "Achievement Unlocked! 🎉", body: "You hit 30 days! Incredible work.", isRead: false, createdAt: "2026-04-28T08:30:00Z" },
  { id: "3", type: "FRIEND_REQUEST", title: "New Friend Request", body: "legend_608 wants to connect.", isRead: false, createdAt: "2026-04-27T15:20:00Z" },
  { id: "4", type: "WITHDRAWAL", title: "Day 3 Ahead", body: "Day 3 is often the toughest. We've prepared some support for you.", isRead: true, createdAt: "2026-04-26T09:00:00Z" },
];

export const mockJournalEntries = [
  { id: "1", entryDate: "2026-04-28", content: "Today was challenging but I stayed strong. The afternoon cravings hit hard around 3 PM, but I went for a walk instead. Feeling proud.", moodScore: 8, moodEmoji: "😊", triggers: ["stress", "afternoon"], whatHelped: "Walking" },
  { id: "2", entryDate: "2026-04-27", content: "Had a great day. Barely thought about it. Exercise in the morning really set the tone. Starting to feel like myself again.", moodScore: 9, moodEmoji: "💪", triggers: [], whatHelped: "Morning exercise" },
  { id: "3", entryDate: "2026-04-26", content: "Was out with friends and felt the social pressure. Managed to say no. It was hard but I did it. Need to prepare better for social situations.", moodScore: 6, moodEmoji: "😤", triggers: ["social_pressure", "evening"], whatHelped: "Deep breathing" },
];

export const mockHabitCatalog = [
  { slug: "smoking", displayName: "Smoking", icon: "🚬" },
  { slug: "drinking", displayName: "Drinking", icon: "🍺" },
  { slug: "vaping", displayName: "Vaping", icon: "💨" },
  { slug: "chewing_tobacco", displayName: "Chewing Tobacco", icon: "🌿" },
  { slug: "pornography", displayName: "Pornography", icon: "🔞" },
  { slug: "social_media", displayName: "Social Media", icon: "📱" },
  { slug: "sugar_junk_food", displayName: "Sugar & Junk Food", icon: "🍩" },
  { slug: "gambling", displayName: "Gambling", icon: "🎰" },
  { slug: "custom", displayName: "Custom Habit", icon: "✏️" },
];

export const mockMoneySuggestions = [
  { amount: 3200, suggestion: "That's a road trip to Coorg — fuel, stay, and meals covered." },
  { amount: 8000, suggestion: "A brand new smartphone or a weekend getaway to Goa for two." },
  { amount: 15000, suggestion: "A round-trip flight to Thailand. Your addiction was costing you travel experiences." },
  { amount: 47200, suggestion: "A premium laptop or the start of an emergency fund. Freedom pays." },
];

export const mockLevels = [
  { level: 1, name: "Spark", xpRequired: 0 },
  { level: 2, name: "Kindling", xpRequired: 100 },
  { level: 3, name: "Flame", xpRequired: 300 },
  { level: 4, name: "Torch", xpRequired: 600 },
  { level: 5, name: "Beacon", xpRequired: 1000 },
  { level: 6, name: "Wildfire", xpRequired: 2000 },
  { level: 7, name: "Reclaimer", xpRequired: 4000 },
  { level: 8, name: "Guardian", xpRequired: 7000 },
  { level: 9, name: "Sentinel", xpRequired: 11000 },
  { level: 10, name: "Liberator", xpRequired: 16000 },
  { level: 15, name: "Sovereign", xpRequired: 50000 },
  { level: 20, name: "Unshackled", xpRequired: 75000 },
];
