import { http, HttpResponse, delay } from "msw";

export const handlers = [
  // Health check
  http.get("/api/health", async () => {
    await delay(200);
    return HttpResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  }),

  // User endpoints
  http.get("/api/users/me", async () => {
    await delay(300);
    return HttpResponse.json({
      id: "user-1",
      username: "arjun_s",
      displayName: "Arjun Sharma",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
      bio: "On a journey to quit smoking. Day 47!",
      country: "IN",
      currency: "INR",
      isSupporter: true,
      onboardingCompleted: true,
      xp: 2450,
      level: 7,
      levelName: "Reclaimer",
    });
  }),

  // Habits endpoints
  http.get("/api/habits", async () => {
    await delay(200);
    return HttpResponse.json([
      { id: "habit-1", slug: "smoking", displayName: "Smoking", icon: "🚬", sortOrder: 1 },
      { id: "habit-2", slug: "drinking", displayName: "Drinking", icon: "🍺", sortOrder: 2 },
      { id: "habit-3", slug: "vaping", displayName: "Vaping", icon: "💨", sortOrder: 3 },
      { id: "habit-4", slug: "social_media", displayName: "Social Media", icon: "📱", sortOrder: 4 },
    ]);
  }),

  http.get("/api/habits/mine", async () => {
    await delay(400);
    return HttpResponse.json([
      {
        id: "uh-1",
        habitId: "habit-1",
        habitName: "Smoking",
        habitIcon: "🚬",
        quitDate: "2026-03-18",
        currentStreak: 47,
        longestStreak: 47,
        isActive: true,
        cigarettesPerDay: 15,
        costPerCigarette: 8,
      },
    ]);
  }),

  // Check-in
  http.post("/api/checkins", async ({ request }) => {
    await delay(500);
    const body = await request.json() as { habitId: string; date: string; status: string };
    return HttpResponse.json({
      id: `checkin-${Date.now()}`,
      habitId: body.habitId,
      date: body.date,
      status: body.status,
      xpEarned: body.status === "clean" ? 15 : 5,
      streakUpdated: 48,
    });
  }),

  // Dashboard summary
  http.get("/api/dashboard", async () => {
    await delay(500);
    return HttpResponse.json({
      totalXp: 2450,
      level: 7,
      levelName: "Reclaimer",
      xpToNextLevel: 500,
      currentStreak: 47,
      longestStreak: 47,
      moneySaved: {
        today: 310,
        week: 2170,
        month: 8680,
        allTime: 47200,
      },
      habits: [
        {
          id: "uh-1",
          habitName: "Smoking",
          habitIcon: "🚬",
          currentStreak: 47,
          isActive: true,
        },
      ],
      healthMilestone: {
        dayOffset: 47,
        title: "Circulation restored",
        description: "Blood circulation has measurably improved. Physical activity is getting easier.",
      },
      recentBadges: [
        { id: "b1", name: "First Week Warrior", icon: "🏆", earned: true },
        { id: "b2", name: "Two Week Titan", icon: "💪", earned: true },
        { id: "b3", name: "30-Day Legend", icon: "⭐", earned: false },
      ],
      dopamineSuggestions: [
        { id: "d1", suggestion: "Take a 10-minute walk outside", category: "physical", difficulty: "easy" },
        { id: "d2", suggestion: "Call a friend or family member", category: "social", difficulty: "medium" },
      ],
    });
  }),

  // Leaderboard
  http.get("/api/leaderboard", async () => {
    await delay(400);
    return HttpResponse.json({
      entries: [
        { rank: 1, userId: "u1", username: "priya_k", displayName: "Priya Kumar", avatarUrl: null, streak: 92, xp: 8450, level: 12 },
        { rank: 2, userId: "u2", username: "rahul_v", displayName: "Rahul Verma", avatarUrl: null, streak: 78, xp: 6200, level: 10 },
        { rank: 3, userId: "u3", username: "arjun_s", displayName: "Arjun Sharma", avatarUrl: null, streak: 47, xp: 2450, level: 7, isCurrentUser: true },
        { rank: 4, userId: "u4", username: "neha_p", displayName: "Neha Patel", avatarUrl: null, streak: 35, xp: 1800, level: 6 },
        { rank: 5, userId: "u5", username: "vikram_r", displayName: "Vikram Rao", avatarUrl: null, streak: 28, xp: 1200, level: 5 },
      ],
      currentUserRank: 3,
    });
  }),

  // Friends
  http.get("/api/friends", async () => {
    await delay(300);
    return HttpResponse.json({
      friends: [
        { id: "f1", username: "priya_k", displayName: "Priya Kumar", avatarUrl: null, currentStreak: 92, status: "accepted" },
        { id: "f2", username: "rahul_v", displayName: "Rahul Verma", avatarUrl: null, currentStreak: 78, status: "accepted" },
      ],
      pending: [
        { id: "f3", username: "neha_p", displayName: "Neha Patel", avatarUrl: null, status: "pending" },
      ],
    });
  }),

  // Journal
  http.get("/api/journal", async () => {
    await delay(300);
    return HttpResponse.json({
      entries: [
        {
          id: "j1",
          entryDate: "2026-05-03",
          content: "Day 46. Feeling good today. Managed to avoid the urge to smoke after lunch. Went for a walk instead.",
          moodScore: 8,
          moodEmoji: "😊",
          triggers: ["after_meal", "stress"],
          whatHelped: ["walking", "deep_breathing"],
        },
        {
          id: "j2",
          entryDate: "2026-05-02",
          content: "Day 45. Had a cravings at a party but stayed strong. Reminded myself why I started.",
          moodScore: 7,
          moodEmoji: "💪",
          triggers: ["social_drinking"],
          whatHelped: ["accountability_call"],
        },
      ],
    });
  }),

  // Notifications
  http.get("/api/notifications", async () => {
    await delay(200);
    return HttpResponse.json({
      notifications: [
        { id: "n1", type: "milestone", title: "You're on fire!", body: "You hit Day 45! Keep going.", isRead: false, createdAt: "2026-05-02T10:00:00Z" },
        { id: "n2", type: "friend_milestone", title: "Priya hit 90 days", body: "Your friend achieved an incredible milestone!", isRead: true, createdAt: "2026-05-01T15:30:00Z" },
        { id: "n3", type: "challenge_received", title: "Challenge from Rahul", body: "Rahul challenged you to show proof by tonight.", isRead: false, createdAt: "2026-05-04T08:00:00Z" },
      ],
    });
  }),

  // Money suggestions
  http.get("/api/content/money-suggestions", async () => {
    await delay(150);
    return HttpResponse.json({
      suggestions: [
        { id: "ms1", amountMin: 0, amountMax: 1000, suggestion: "That's 10 Bollywood movies on streaming services", category: "entertainment" },
        { id: "ms2", amountMin: 1000, amountMax: 5000, suggestion: "That's a weekend trip to Pondicherry with stay", category: "travel" },
        { id: "ms3", amountMin: 5000, amountMax: 10000, suggestion: "That's a new smartphone with great features", category: "tech" },
        { id: "ms4", amountMin: 10000, amountMax: 50000, suggestion: "That's a road trip to Ladakh with friends", category: "adventure" },
        { id: "ms5", amountMin: 50000, amountMax: null, suggestion: "That's a down payment on your first car", category: "milestone" },
      ],
    });
  }),

  // Health milestones
  http.get("/api/content/health-milestones/:habitSlug", async ({ params }) => {
    await delay(150);
    const { habitSlug } = params;
    if (habitSlug === "smoking") {
      return HttpResponse.json({
        milestones: [
          { dayOffset: 0, title: "The decision", description: "Your body begins the moment you stop. Blood CO levels start dropping within hours." },
          { dayOffset: 1, title: "Oxygen flooding in", description: "Your blood oxygen is back to normal. Your heart rate and blood pressure are settling." },
          { dayOffset: 3, title: "The hardest day", description: "Nicotine is fully out of your body. This is withdrawal, not weakness." },
          { dayOffset: 14, title: "Lungs waking up", description: "Cilia in your lungs are regenerating. You may cough more — that is healing, not harm." },
          { dayOffset: 30, title: "Circulation restored", description: "Blood circulation has measurably improved. Physical activity is getting easier." },
          { dayOffset: 90, title: "Dopamine baseline", description: "Your dopamine receptors are nearly back to pre-smoking baseline. The grip is loosening." },
          { dayOffset: 365, title: "Heart attack risk halved", description: "Your risk of coronary heart disease is now half that of a smoker. You did this." },
        ],
      });
    }
    return HttpResponse.json({ milestones: [] });
  }),

  // Withdrawal messages
  http.get("/api/content/withdrawal-messages/:habitSlug/:dayOffset", async ({ params }) => {
    await delay(100);
    const messages: Record<number, { message: string; tone: string }> = {
      1: { message: "Day 1. Your body is already healing. The hard part starts now — but so do you.", tone: "encouraging" },
      3: { message: "Day 3. This is the hardest day for most people. Your brain is fighting hard right now. That feeling of doom is a withdrawal symptom — it is not the truth.", tone: "empathetic" },
      7: { message: "Day 7. One week. Your brain is rebuilding its reward system. It gets easier from here.", tone: "proud" },
      14: { message: "Day 14. Two weeks. Physical dependence is fading. The psychological work begins.", tone: "neutral" },
      30: { message: "Day 30. One month. You've proven it's possible. Your body thanks you.", tone: "proud" },
      90: { message: "Day 90. Three months. Dopamine receptors are nearly normalized. You're not the same person who started.", tone: "celebratory" },
    };
    const dayOffset = parseInt(params.dayOffset as string, 10);
    return HttpResponse.json(messages[dayOffset] || { message: "Keep going. Every day is progress.", tone: "supportive" });
  }),
];