"use client";

import { motion } from "framer-motion";

import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import ProblemSection from "@/components/landing/ProblemSection";
import ScienceSection from "@/components/landing/ScienceSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";

import { StreakCounter } from "@/components/app/StreakCounter";
import { CheckInCard } from "@/components/app/CheckInCard";
import { MoneySavedCard } from "@/components/app/MoneySavedCard";
import { HealthTimeline } from "@/components/app/HealthTimeline";
import { XpProgressBar } from "@/components/app/XpProgressBar";
import { LevelBadge } from "@/components/app/LevelBadge";
import { BadgeGrid } from "@/components/app/BadgeGrid";
import { HabitCard } from "@/components/app/HabitCard";
import { HabitSelector } from "@/components/app/HabitSelector";
import { WithdrawalCard } from "@/components/app/WithdrawalCard";
import { DopamineSuggestionCard } from "@/components/app/DopamineSuggestionCard";
import { LeaderboardTable } from "@/components/app/LeaderboardTable";
import { FriendCard } from "@/components/app/FriendCard";
import { NotificationDrawer } from "@/components/app/NotificationDrawer";
import { JournalCard } from "@/components/app/JournalCard";
import { JournalEntryForm } from "@/components/app/JournalEntryForm";
import { MoodTracker } from "@/components/app/MoodTracker";
import { PremiumGate } from "@/components/app/PremiumGate";

import { GlassCard } from "@/components/shared/GlassCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AnimatedButton } from "@/components/shared/AnimatedButton";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  mockDashboardSummary,
  mockHealthMilestones,
  mockWithdrawalMessages,
  mockBadges,
  mockLeaderboard,
  mockFriends,
  mockNotifications,
  mockJournalEntries,
  mockUserProfile,
  mockHabitCatalog,
  mockMoneySuggestions,
} from "@/lib/mock-data";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="relative py-16">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/[0.04]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-surface-darkest px-6 text-caption font-medium text-text-subtle uppercase tracking-widest">
          {label}
        </span>
      </div>
    </div>
  );
}

function ComponentShowcase({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16"
    >
      <div className="mb-6">
        <h3 className="text-heading-lg text-text-primary mb-1">{title}</h3>
        {description && (
          <p className="text-body-sm text-text-muted">{description}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

export default function PreviewPage() {
  return (
    <div className="relative">
      {/* ============= LANDING PAGE (FULL) ============= */}
      <HeroSection />
      <StatsSection />
      <ProblemSection />
      <ScienceSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />

      {/* ============= APP COMPONENTS SHOWCASE ============= */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <SectionDivider label="App Components" />

        {/* UI Primitives */}
        <ComponentShowcase
          title="UI Primitives"
          description="Base shadcn/ui components with Unshackled design system styling"
        >
          <GlassCard padding="lg" className="space-y-8">
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Buttons</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="premium">Premium</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Button Sizes</h4>
              <div className="flex flex-wrap items-end gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">X-Large</Button>
              </div>
            </div>
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Badges</h4>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="premium">Premium</Badge>
              </div>
            </div>
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Progress</h4>
              <div className="space-y-3 max-w-md">
                <Progress value={25} />
                <Progress value={50} />
                <Progress value={75} />
                <Progress value={100} />
              </div>
            </div>
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Input</h4>
              <div className="max-w-sm space-y-3">
                <Input placeholder="Enter your email..." />
                <Input placeholder="Search friends..." disabled />
              </div>
            </div>
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Tabs</h4>
              <Tabs defaultValue="tab1" className="max-w-sm">
                <TabsList>
                  <TabsTrigger value="tab1">Overview</TabsTrigger>
                  <TabsTrigger value="tab2">Details</TabsTrigger>
                  <TabsTrigger value="tab3">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                  <p className="text-body-sm text-text-muted p-4">Overview tab content</p>
                </TabsContent>
                <TabsContent value="tab2">
                  <p className="text-body-sm text-text-muted p-4">Details tab content</p>
                </TabsContent>
                <TabsContent value="tab3">
                  <p className="text-body-sm text-text-muted p-4">Settings tab content</p>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Switch & Avatar</h4>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Switch id="notifs" />
                  <label htmlFor="notifs" className="text-body-sm text-text-secondary">
                    Enable notifications
                  </label>
                </div>
                <Avatar>
                  <AvatarImage src={mockUserProfile.avatarUrl} />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </GlassCard>
        </ComponentShowcase>

        {/* Shared Components */}
        <ComponentShowcase
          title="Shared Components"
          description="Reusable glassmorphic and layout components"
        >
          <GlassCard padding="lg" className="space-y-8">
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">SectionHeader</h4>
              <SectionHeader
                title="This is a Section Header"
                subtitle="With a supporting subtitle that explains more"
                badge="New"
                color="amber"
              />
              <div className="mt-6">
                <SectionHeader
                  title="Health Milestones"
                  subtitle="Track your body's recovery day by day"
                  color="green"
                  alignment="left"
                />
              </div>
            </div>
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">AnimatedButton</h4>
              <div className="flex gap-4">
                <AnimatedButton variant="premium" size="xl">Get Started</AnimatedButton>
                <AnimatedButton variant="secondary" size="lg">Learn More</AnimatedButton>
              </div>
            </div>
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">GlassCard Variants</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard padding="sm">
                  <p className="text-body-sm text-text-secondary">Amber glow</p>
                </GlassCard>
                <GlassCard padding="sm">
                  <p className="text-body-sm text-text-secondary">Blue glow</p>
                </GlassCard>
                <GlassCard padding="sm">
                  <p className="text-body-sm text-text-secondary">Green glow</p>
                </GlassCard>
              </div>
            </div>
          </GlassCard>
        </ComponentShowcase>

        {/* Dashboard Core */}
        <ComponentShowcase
          title="Dashboard Core"
          description="Primary dashboard widgets — streaks and XP"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <StreakCounter
              habitName={mockDashboardSummary.habits[0].habitName}
              habitIcon={mockDashboardSummary.habits[0].habitIcon}
              currentStreak={mockDashboardSummary.habits[0].currentStreak}
              longestStreak={47}
            />
            <XpProgressBar
              xp={mockUserProfile.xp}
              xpToNextLevel={mockUserProfile.xpToNextLevel}
              level={mockUserProfile.level}
              levelName={mockUserProfile.levelName}
            />
          </div>
        </ComponentShowcase>

        {/* Check-in */}
        <ComponentShowcase
          title="Daily Check-in"
          description="The most important interaction — reporting clean or slipped"
        >
          <div className="max-w-lg">
            <CheckInCard />
          </div>
        </ComponentShowcase>

        {/* Money & Health */}
        <ComponentShowcase
          title="Money Saved & Health Timeline"
          description="Financial and health progress tracking"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <MoneySavedCard
              savedToday={310}
              savedWeek={2170}
              savedMonth={8680}
              savedAllTime={47200}
              currency="INR"
              suggestion={mockMoneySuggestions[3].suggestion}
            />
            <HealthTimeline
              milestones={mockHealthMilestones}
              currentDay={47}
            />
          </div>
        </ComponentShowcase>

        {/* Gamification */}
        <ComponentShowcase
          title="Gamification — Badges & Levels"
          description="XP, levels, and badge collection system"
        >
          <GlassCard padding="lg">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <LevelBadge level={1} levelName="Spark" size="sm" />
              <LevelBadge level={3} levelName="Flame" size="sm" />
              <LevelBadge level={5} levelName="Beacon" size="md" />
              <LevelBadge level={7} levelName="Reclaimer" size="md" />
              <LevelBadge level={10} levelName="Liberator" size="lg" />
              <LevelBadge level={20} levelName="Unshackled" size="lg" />
            </div>
            <BadgeGrid badges={mockBadges} />
          </GlassCard>
        </ComponentShowcase>

        {/* Habits */}
        <ComponentShowcase
          title="Habit Management"
          description="Habit cards and the habit selection catalog"
        >
          <div className="space-y-8">
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Habit Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                {mockDashboardSummary.habits.map((habit) => (
                  <HabitCard
                    key={habit.userHabitId}
                    habitName={habit.habitName}
                    habitIcon={habit.habitIcon}
                    currentStreak={habit.currentStreak}
                    isActive={habit.isActive}
                  />
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Habit Selector</h4>
              <div className="max-w-3xl">
                <HabitSelector
                  options={mockHabitCatalog.map(h => ({ slug: h.slug, displayName: h.displayName, icon: h.icon }))}
                  selected={null}
                  onSelect={() => {}}
                />
              </div>
            </div>
          </div>
        </ComponentShowcase>

        {/* Withdrawal & Dopamine */}
        <ComponentShowcase
          title="Withdrawal Empathy & Dopamine Suggestions"
          description="Emotional support and craving management tools"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="space-y-4">
              <WithdrawalCard
                message={mockWithdrawalMessages[1]}
                currentDay={47}
              />
              <WithdrawalCard
                message={mockWithdrawalMessages[0]}
                currentDay={47}
              />
            </div>
            <div className="space-y-4">
              {mockDashboardSummary.dopamineSuggestions.map((s) => (
                <DopamineSuggestionCard
                  key={s.id}
                  suggestion={s.suggestion}
                  category={s.category as "physical" | "social" | "creative" | "mindfulness"}
                  difficulty={s.difficulty as "easy" | "medium" | "hard"}
                />
              ))}
            </div>
          </div>
        </ComponentShowcase>

        {/* Social */}
        <ComponentShowcase
          title="Social & Friends"
          description="Friends, leaderboard, and notification components"
        >
          <GlassCard padding="lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-heading-sm text-text-secondary mb-4">Friends</h4>
                <div className="space-y-3">
                  {mockFriends.map((friend) => (
                    <FriendCard
                      key={friend.id}
                      id={friend.id}
                      username={friend.username}
                      displayName={friend.displayName}
                      avatarUrl={friend.avatarUrl}
                      currentStreak={friend.currentStreak}
                      status={friend.status as "accepted" | "pending"}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-heading-sm text-text-secondary mb-4">Leaderboard</h4>
                <LeaderboardTable entries={mockLeaderboard} currentUserId="you" />
              </div>
            </div>
          </GlassCard>
        </ComponentShowcase>

        {/* Notifications */}
        <ComponentShowcase
          title="Notification Drawer"
          description="In-app notification center"
        >
          <div className="max-w-md">
            <NotificationDrawer
              notifications={mockNotifications as any}
            />
          </div>
        </ComponentShowcase>

        {/* Journal */}
        <ComponentShowcase
          title="Journal System"
          description="Daily reflection, mood tracking, and journal entries"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <h4 className="text-heading-sm text-text-secondary mb-4">Journal Entries</h4>
              <div className="space-y-3">
                {mockJournalEntries.map((entry) => (
                  <JournalCard
                    key={entry.id}
                    entry={entry}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h4 className="text-heading-sm text-text-secondary mb-4">New Journal Entry</h4>
                <div className="max-w-lg">
                  <JournalEntryForm />
                </div>
              </div>
              <div>
                <h4 className="text-heading-sm text-text-secondary mb-4">Mood Tracker</h4>
                <div className="max-w-sm">
                  <MoodTracker
                    entries={mockJournalEntries.map((e) => ({
                      date: e.entryDate,
                      moodScore: e.moodScore,
                      moodEmoji: e.moodEmoji,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </ComponentShowcase>

        {/* Premium */}
        <ComponentShowcase
          title="Premium Gate"
          description="Upgrade prompt shown when free users hit limits"
        >
          <div className="max-w-md">
            <PremiumGate
              reason="You've reached the free tier limit for habit tracking"
              feature="unlimited habits and advanced analytics"
            />
          </div>
        </ComponentShowcase>
      </section>
    </div>
  );
}
