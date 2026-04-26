/**
 * TypeScript interfaces matching the Unshackled Spring Boot backend models and DTOs.
 * Used for type-safe API communication.
 */

// --- Base Types ---

export interface UserResponse {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  country: string | null;
  currency: string;
  isSupporter: boolean;
  onboardingCompleted: boolean;
  quitDate: string | null; // ISO Date
  premiumStatus: 'FREE' | 'PREMIUM' | 'PRO' | 'free' | 'premium' | 'pro';
  leaderboardOptIn: boolean;
  createdAt: string; // ISO DateTime
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
}

export interface UserHabit {
  id: string;
  userId: string;
  habitId: string;
  quitDate: string;
  isActive: boolean;
  
  // Consumption stats (depend on habit type)
  cigarettesPerDay?: number;
  costPerCigarette?: number;
  drinksPerWeek?: number;
  costPerSession?: number;
  podsPerWeek?: number;
  podCost?: number;
  hoursPerDay?: number;
  platforms?: string[];
  spendPerWeek?: number;
  
  customDescription?: string;
  customTimePerDay?: number;
  customSpendPerDay?: number;
  
  createdAt: string;
  updatedAt: string;
}

// --- Stats & Summaries ---

export interface Streak {
  id: string;
  userHabitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
}

export interface HabitStreakItem {
  userHabitId: string;
  habitName: string;
  habitIcon: string;
  currentStreak: number;
}

export interface DashboardSummary {
  habits: HabitStreakItem[];
  totalSavedToday: number;
  totalSavedWeek: number;
  totalSavedMonth: number;
  totalSavedAllTime: number;
  level: number;
  xp: number;
  recentBadges: Badge[];
  todayMessage?: WithdrawalMessage;
  dopamineSuggestions: DopamineSuggestion[];
}

export interface MoneySavedBreakdown {
  today: number;
  week: number;
  month: number;
  allTime: number;
}

export interface Level {
  levelNumber: number;
  name: string;
  xpRequired: number;
}

export interface XpEvent {
  id: string;
  userId: string;
  eventType: string;
  xpAmount: number;
  referenceId: string | null;
  description: string;
  createdAt: string;
}

export interface XpSummary {
  totalXp: number;
  currentLevel: Level;
  xpToNextLevel: number;
  recentEvents: XpEvent[];
}

export interface HeatmapItem {
  date: string;
  count: number;
}

export interface GlobalStats {
  totalUsers: number;
  totalMoneySaved: number;
  totalLifeYearsReclaimed: number;
  activeChallenges: number;
}

// --- Social & Gamification ---

export interface CheckIn {
  id: string;
  userHabitId: string;
  checkInDate: string;
  notes: string | null;
  amountSaved: number;
  mood: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  triggerType: string;
  triggerValue: number | null;
  xpReward: number;
}

export interface BadgeStatus {
  badge: Badge;
  earned: boolean;
}

export interface Challenge {
  id: string;
  challengerId: string;
  challengedId: string;
  userHabitId: string;
  status: 'pending' | 'responded' | 'approved' | 'rejected' | 'expired' | 'verification_failed';
  message: string;
  responseDeadline: string;
  respondedAt?: string;
  reviewedAt?: string;
  reviewerNote?: string;
  exifVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Friend {
  id: string;
  friendId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  status: 'PENDING' | 'ACCEPTED';
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl: string | null;
  totalCleanDays: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  rank: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'SYSTEM' | 'CHALLENGE' | 'FRIEND' | 'STREAK' | 'BADGE';
  title: string;
  body: string;
  data?: string; // JSON string
  isRead: boolean;
  pushSent: boolean;
  emailSent: boolean;
  createdAt: string;
}

// --- Content & Support ---

export interface JournalEntry {
  id: string;
  userId: string;
  entryDate: string;
  content: string;
  moodScore: number;
  moodEmoji: string;
  triggers: string[];
  whatHelped: string | null;
  isShared: boolean;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryRequest {
  entryDate: string;
  content: string;
  moodScore: number;
  moodEmoji: string;
  triggers: string[];
  whatHelped?: string;
  isShared?: boolean;
  sharedWith?: string[];
}

export interface WithdrawalMessage {
  id: string;
  habitId: string;
  dayOffset: number;
  phase?: string;
  message: string;
  tone: string;
  createdAt: string;
}

export interface HealthMilestone {
  id: string;
  habitId: string;
  dayOffset: number;
  title: string;
  description: string;
  milestoneType: string;
  createdAt: string;
}

export interface DopamineSuggestion {
  id: string;
  title?: string;
  description?: string;
  activity: string;
  category: string;
  durationMinutes: number;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH';
  iconType?: string;
}

export interface MoneySuggestion {
  id: string;
  countryCode: string;
  amountMin: number;
  amountMax: number;
  suggestion: string;
  category: string;
}

// --- Subscription & Payments ---

export interface SubscriptionStatus {
  id: string;
  userId: string;
  plan: 'FREE' | 'PREMIUM' | 'PRO' | 'free' | 'premium' | 'pro';
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- API Requests ---

export interface AddHabitRequest {
  habitId: string;
  quitDate: string;
  
  // Smoking
  cigarettesPerDay?: number;
  costPerCigarette?: number;

  // Drinking
  drinksPerWeek?: number;
  costPerSession?: number;

  // Vaping
  podsPerWeek?: number;
  podCost?: number;

  // Time-based
  hoursPerDay?: number;
  platforms?: string[];

  // Money-based
  spendPerWeek?: number;

  // Custom
  customDescription?: string;
  customTimePerDay?: number;
  customSpendPerDay?: number;
}

export interface CheckInRequest {
  userHabitId: string;
  notes?: string;
  mood?: string;
}

export interface SendChallengeRequest {
  receiverId: string;
  userHabitId: string;
  type: 'PHOTO' | 'VIDEO' | 'GPS';
}

export interface CreateUserRequest {
  username: string;
  displayName: string;
  country?: string;
  currency?: string;
  isSupporter?: boolean;
}

export interface UpdateUserRequest {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  country?: string;
  currency?: string;
  leaderboardOptIn?: boolean;
}

export interface AddHabitRequest {
  habitId: string;
  quitDate: string;
  
  // Consumption stats
  cigarettesPerDay?: number;
  costPerCigarette?: number;
  drinksPerWeek?: number;
  costPerSession?: number;
  podsPerWeek?: number;
  podCost?: number;
  hoursPerDay?: number;
  platforms?: string[];
  spendPerWeek?: number;
  
  // Custom
  customDescription?: string;
  customTimePerDay?: number;
  customSpendPerDay?: number;
}

export interface OnboardingRequest {
  displayName: string;
  country: string;
  currency: string;
  isSupporter: boolean;
  quitDate: string;
  habits: AddHabitRequest[];
}

export interface DashboardSummary {
  habits: HabitSummary[];
  totalSavedToday: number;
  totalSavedWeek: number;
  totalSavedMonth: number;
  totalSavedAllTime: number;
  level: number;
  levelName: string;
  currentXp: number;
  nextLevelXp: number;
  withdrawalMessage?: WithdrawalMessage;
  dopamineSuggestions: DopamineSuggestion[];
}

export interface HabitSummary {
  userHabitId: string;
  habitName: string;
  habitIcon: string;
  currentStreak: number;
}

export interface PushSubscriptionRequest {
  endpoint: string;
  p256dh: string;
  auth: string;
}
