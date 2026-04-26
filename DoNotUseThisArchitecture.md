# Architecture: BreakFree

> *A gamified, socially accountable, emotionally intelligent web platform that helps people quit smoking, drinking, and other bad habits — powered by streaks, real-money savings math, dopamine science, peer accountability with cryptographic image verification, and deep empathy for what withdrawal actually feels like.*

---

## Section 1: Product Philosophy & UX Principles

### 1.1 Emotional Design Philosophy

BreakFree is not a productivity app. It is a companion for people going through one of the hardest things a human can do — breaking free from chemical and behavioral addiction. Every pixel, animation, word choice, and notification is designed through the lens of **compassionate behavioral science**.

Five pillars:

1. **Never shame. Always support.** A relapse is not a failure — it is a data point. When a user logs a slip, they are met with warmth, encouragement, and a clear path back.
2. **Make the invisible visible.** Addiction thrives in fog — users often do not realize how much money they spend, how much time they lose, or how much their body is healing. BreakFree makes all of this concretely visible through real-time savings counters, health recovery timelines backed by medical literature, and streak visualizations.
3. **Replace the dopamine, don't just remove it.** When a person quits an addictive substance, their dopamine receptor density (particularly D2 receptors) is significantly reduced. Recovery takes 3–14 months. BreakFree actively suggests healthy dopamine replacements calibrated to the user's recovery stage.
4. **Social accountability is the strongest lever.** A 2024 meta-analysis found gamification combined with social accountability doubles abstinence rates (RR 2.12). BreakFree's friend system, challenge system, and supporter roles harness this.
5. **Celebrate every single day.** Every day clean is a victory. XP, badges, streak animations, and milestone celebrations are neurologically meaningful dopamine events that reinforce positive behavior.

### 1.2 Withdrawal Science Embedded in the Product

- **Nicotine (Smoking/Vaping/Chewing Tobacco):** Peak withdrawal days 3, 7, 21. Dopamine normalization: 3–12 months. Lung cilia regeneration: week 2+. Cardiovascular normalization: day 1+.
- **Alcohol:** Peak withdrawal days 2–4 (medically dangerous — app includes disclaimer). Sleep disruption 1–2 weeks. Liver normalization: 4–8 weeks. Dopamine normalization: 3–14 months.
- **Pornography:** Dopamine desensitization recovery: 8–12 weeks. Flatline period: weeks 2–6.
- **Social Media:** Dopamine normalization: 4–8 weeks. Attention span recovery: 2–4 weeks. FOMO peaks week 1.
- **Sugar/Junk Food:** Withdrawal symptoms peak days 2–5. Insulin sensitivity improvement: 2–4 weeks.
- **Gambling:** Urge intensity peaks weeks 1–2. Dopamine normalization: 3–6 months.

### 1.3 Feature Justification Table

| Feature | Scientific / Behavioral Justification |
|---|---|
| Streak counter | Variable-ratio reinforcement; loss aversion is one of the strongest behavioral motivators |
| Money saved calculator | Makes abstract cost concrete; leverages prospect theory |
| Health timeline | Tangible proof of recovery when the user cannot feel it yet |
| Withdrawal empathy messages | Reduces isolation; validates experience; prevents "something is wrong with me" spiraling |
| Dopamine substitution suggestions | Directly addresses the neurological deficit; prevents anhedonia-caused relapse |
| Friend challenges with photo proof | Social accountability with verification; removes plausible deniability with compassion |
| EXIF verification | Prevents gaming with old photos; builds genuine trust between accountability partners |
| XP and badges | Gamification doubles abstinence rates; provides dopamine hits replacing substance-derived ones |
| Journal | Expressive writing reduces stress hormones; identifying triggers is core CBT |
| Supporter role | Expands the support network to non-addicts |
| Relapse recovery flow | Prevents shame spiraling; reframes relapse as a step, not an endpoint |

### 1.4 Copy & Language Guidelines

- **Never use:** "failed," "fell off the wagon," "weak," "addict" (as noun), "clean up your act"
- **Always use:** "slipped," "had a tough day," "healing," "recovering," "building strength," "brave"
- **Loading states:** Never spinners. Always micro-copy: "Counting your clean hours…", "Calculating how much richer you are…"
- **Empty states:** Always warm. Empty journal: "This is your space. When you're ready, we're here." Empty friends: "Recovery is better together. Find your people."

---

## Section 2: System Architecture Overview

### 2.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │           Next.js App (Vercel)                             │  │
│  │  Pages ─ Components ─ Three.js ─ Service Worker (Push)     │  │
│  │                    │                                       │  │
│  │           API Client Layer (Typed Fetch)                   │  │
│  │                    │                                       │  │
│  │       Supabase Client (Auth + Realtime + Storage)          │  │
│  └────────────┬───────┼───────────────────────────────────────┘  │
└───────────────┼───────┼──────────────────────────────────────────┘
                │       │
    ┌───────────▼──┐    │
    │  Supabase    │    │    ┌─────────────────────────────────┐
    │  - Auth      │    └───▶│  Spring Boot Backend (Railway)  │
    │  - Realtime  │         │  - REST API Controllers         │
    │  - Storage   │         │  - JWT Auth Filter               │
    │  - Postgres ◄──────────│  - Services (EXIF, Push, Email) │
    └──────────────┘         │  - Stripe Webhooks              │
                             │  - Scheduled Jobs               │
                             │  - JDBC → Supabase Postgres     │
                             └──────────┬──────────────────────┘
                                        │
                                 ┌──────▼──────┐
                                 │   Stripe    │
                                 │  (Payments) │
                                 └─────────────┘
```

### 2.2 Technology Stack

| Technology | Role | Justification |
|---|---|---|
| Next.js (App Router, TS) | Frontend | Server components for SEO, app router, TypeScript safety |
| Spring Boot (Java 21) | Backend API | Enterprise-grade, EXIF libraries, strong Stripe SDK, scheduled jobs |
| Supabase (PostgreSQL) | DB + Auth + Realtime + Storage | Unified platform; built-in RLS; real-time subscriptions; auth OOTB |
| Stripe | Payments | Industry standard subscription billing + webhooks |
| Vercel | Frontend hosting | Native Next.js support, edge functions, auto-deploy |
| Railway | Backend hosting | Simple Docker deploy, good Spring Boot DX, affordable |
| Three.js | 3D animations | WebGL standard for emotional, immersive UI moments |
| Resend | Email | Modern API, excellent deliverability, React Email support |
| Web Push (VAPID) | Push notifications | No app store needed; works on all modern browsers; free |

### 2.3 Data Flow: Onboarding

```
User visits /signup → Supabase Auth creates account → redirect /onboarding/habits
→ User selects habits from card grid → Per-habit config pages
→ POST /api/v1/onboarding/complete (all habit data)
→ Spring Boot: writes user_habits, user_profiles, xp_events, notification_preferences
→ Frontend plays Three.js "New Beginning" animation → redirect /dashboard
```

### 2.4 Data Flow: Daily Check-In

```
User clicks "I'm clean today ✓" or "I slipped"
→ POST /api/v1/check-ins { habit_id, status, date }
→ Spring Boot validates (no duplicate, valid JWT, user owns habit)
→ If "clean": insert check_in, recalc streak, award XP, check milestone → notify
→ If "slipped": insert check_in, reset streak, award honesty XP, schedule 24h follow-up
→ Return updated streak + XP + badges + empathetic message (if slipped)
→ Frontend: update dashboard / play animation / show recovery flow
```

### 2.5 Data Flow: Friend Challenge with Image Verification

```
Challenger: POST /api/v1/challenges { target_user_id, habit_id }
→ Create challenge (status: pending, 1hr expiry) → Push notify target
→ Target opens app → takes 1-3 photos (camera API) → uploads to Supabase Storage
→ POST /api/v1/challenges/{id}/respond { media_urls }
→ Spring Boot downloads images → EXIF extraction (timestamp, GPS)
→ Validate: timestamp within 10min of challenge creation?
   ├── Valid → mark "verified" → notify challenger
   ├── Missing EXIF → mark "absent" → notify with warning
   └── Too old → mark "failed" → flag + notify
→ Challenger reviews → POST /api/v1/challenges/{id}/review { verdict }
→ Approved: streak continues, both earn XP
→ Rejected: streak resets → empathetic recovery flow
```

### 2.6 Data Flow: Payment

```
User clicks "Upgrade" → POST /api/v1/payments/checkout-session
→ Spring Boot creates Stripe Checkout Session → return URL
→ Frontend redirects to Stripe → User pays
→ Stripe webhook → POST /api/v1/webhooks/stripe (checkout.session.completed)
→ Spring Boot: verify signature, update users.subscription_status = 'premium'
→ Create subscription record → premium features unlocked
```

---

## Section 3: Database Schema (Supabase / PostgreSQL)

### 3.1 Table: `users`

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(30) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    country_code VARCHAR(3) DEFAULT 'IN',
    currency_code VARCHAR(3) DEFAULT 'INR',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    user_type VARCHAR(20) NOT NULL DEFAULT 'recoverer'
        CHECK (user_type IN ('recoverer', 'supporter')),
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'free'
        CHECK (subscription_status IN ('free', 'premium', 'cancelled')),
    stripe_customer_id VARCHAR(255),
    xp_total INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    notification_time TIME DEFAULT '09:00:00',
    push_subscription JSONB,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    quit_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_subscription ON public.users(subscription_status);
```

### 3.2 Table: `habits`

```sql
CREATE TABLE public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon_url TEXT,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    has_cost BOOLEAN NOT NULL DEFAULT TRUE,
    cost_unit VARCHAR(20),
    frequency_unit VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Seed: smoking, drinking, vaping, chewing_tobacco, pornography,
-- social_media, sugar_junk_food, gambling, custom
```

### 3.3 Table: `user_habits`

```sql
CREATE TABLE public.user_habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.habits(id),
    custom_name VARCHAR(100),
    custom_description TEXT,
    frequency_value DECIMAL(10,2),
    frequency_unit VARCHAR(20),
    cost_per_unit DECIMAL(10,2),
    cost_currency VARCHAR(3) DEFAULT 'INR',
    platforms TEXT[],
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    total_clean_days INTEGER NOT NULL DEFAULT 0,
    total_money_saved DECIMAL(12,2) NOT NULL DEFAULT 0,
    quit_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, habit_id)
);
CREATE INDEX idx_user_habits_user ON public.user_habits(user_id);
CREATE INDEX idx_user_habits_streak ON public.user_habits(current_streak DESC);
```

### 3.4 Table: `check_ins`

```sql
CREATE TABLE public.check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_habit_id UUID NOT NULL REFERENCES public.user_habits(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('clean', 'slipped')),
    slip_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_habit_id, check_in_date)
);
CREATE INDEX idx_check_ins_user_habit_date ON public.check_ins(user_habit_id, check_in_date DESC);
```

### 3.5 Table: `streaks`

```sql
CREATE TABLE public.streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_habit_id UUID NOT NULL REFERENCES public.user_habits(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    length INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    broken_by VARCHAR(20) CHECK (broken_by IN ('slip', 'missed_checkin', 'challenge_rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_streaks_user_habit ON public.streaks(user_habit_id, is_active);
```

### 3.6 Table: `challenges`

```sql
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenger_id UUID NOT NULL REFERENCES public.users(id),
    target_id UUID NOT NULL REFERENCES public.users(id),
    habit_id UUID REFERENCES public.habits(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'responded', 'approved', 'rejected', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL,
    responded_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_challenges_target ON public.challenges(target_id, status);
CREATE INDEX idx_challenges_challenger ON public.challenges(challenger_id);
```

### 3.7 Table: `challenge_media`

```sql
CREATE TABLE public.challenge_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    file_size_bytes INTEGER,
    mime_type VARCHAR(50),
    exif_timestamp TIMESTAMPTZ,
    exif_gps_lat DECIMAL(10,8),
    exif_gps_lon DECIMAL(11,8),
    exif_device_make VARCHAR(100),
    exif_device_model VARCHAR(100),
    metadata_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (metadata_status IN ('pending', 'verified', 'failed', 'absent')),
    verification_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_challenge_media_challenge ON public.challenge_media(challenge_id);
```

### 3.8 Table: `friends`

```sql
CREATE TABLE public.friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(requester_id, addressee_id),
    CHECK (requester_id <> addressee_id)
);
CREATE INDEX idx_friends_addressee ON public.friends(addressee_id, status);
CREATE INDEX idx_friends_requester ON public.friends(requester_id, status);
```

### 3.9 Table: `notifications`

```sql
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    sent_via VARCHAR(20)[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
```

### 3.10 Table: `journal_entries`

```sql
CREATE TABLE public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    content TEXT,
    mood VARCHAR(20) CHECK (mood IN ('great', 'good', 'okay', 'tough', 'terrible')),
    mood_emoji VARCHAR(10),
    triggers TEXT[],
    coping_strategies TEXT[],
    is_shared_with_supporters BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_journal_user_date ON public.journal_entries(user_id, entry_date DESC);
```

### 3.11 Table: `badges`

```sql
CREATE TABLE public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
    category VARCHAR(50) NOT NULL,
    trigger_condition JSONB NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.12 Table: `user_badges`

```sql
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id),
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    habit_id UUID REFERENCES public.habits(id),
    UNIQUE(user_id, badge_id)
);
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
```

### 3.13 Table: `xp_events`

```sql
CREATE TABLE public.xp_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    xp_amount INTEGER NOT NULL,
    description TEXT,
    reference_id UUID,
    reference_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_xp_events_user ON public.xp_events(user_id, created_at DESC);
```

### 3.14 Table: `subscriptions`

```sql
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255) NOT NULL,
    stripe_price_id VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
```

### 3.15 Table: `health_milestones`

```sql
CREATE TABLE public.health_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id),
    hours_after_quit INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    body_system VARCHAR(100),
    source_citation TEXT,
    icon VARCHAR(50),
    sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_health_milestones_habit ON public.health_milestones(habit_id, hours_after_quit);
```

### 3.16 Table: `withdrawal_messages`

```sql
CREATE TABLE public.withdrawal_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id),
    day_range_start INTEGER NOT NULL,
    day_range_end INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    symptoms TEXT[],
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'intense', 'peak')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_withdrawal_habit ON public.withdrawal_messages(habit_id, day_range_start);
```

### 3.17 Table: `dopamine_suggestions`

```sql
CREATE TABLE public.dopamine_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration_minutes INTEGER,
    applicable_habits UUID[],
    recovery_stage VARCHAR(30),
    icon VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.18 Table: `money_suggestions`

```sql
CREATE TABLE public.money_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code VARCHAR(3) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    min_amount DECIMAL(12,2) NOT NULL,
    max_amount DECIMAL(12,2) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    icon VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_money_suggestions ON public.money_suggestions(country_code, min_amount);
```

### 3.19 Table: `notification_preferences`

```sql
CREATE TABLE public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    daily_checkin_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    streak_milestones BOOLEAN NOT NULL DEFAULT TRUE,
    friend_milestones BOOLEAN NOT NULL DEFAULT TRUE,
    challenge_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    relapse_support BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_report_push BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_report_email BOOLEAN NOT NULL DEFAULT TRUE,
    withdrawal_warnings BOOLEAN NOT NULL DEFAULT TRUE,
    supporter_summary BOOLEAN NOT NULL DEFAULT TRUE,
    leaderboard_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### 3.20 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users: anyone can read profiles, only own can update/insert
CREATE POLICY users_select ON public.users FOR SELECT USING (true);
CREATE POLICY users_update ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY users_insert ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- User Habits: own + friends can view
CREATE POLICY user_habits_own ON public.user_habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_habits_friends ON public.user_habits FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.friends WHERE status = 'accepted'
        AND ((requester_id = auth.uid() AND addressee_id = user_id)
          OR (addressee_id = auth.uid() AND requester_id = user_id)))
);

-- Check-ins, Streaks, XP Events, Subscriptions, Notification Prefs: own only
CREATE POLICY check_ins_own ON public.check_ins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY streaks_own ON public.streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY xp_events_own ON public.xp_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY subscriptions_own ON public.subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY notif_prefs_own ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Challenges: both parties can view, challenger creates, both can update
CREATE POLICY challenges_view ON public.challenges FOR SELECT
    USING (auth.uid() = challenger_id OR auth.uid() = target_id);
CREATE POLICY challenges_create ON public.challenges FOR INSERT
    WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY challenges_update ON public.challenges FOR UPDATE
    USING (auth.uid() = challenger_id OR auth.uid() = target_id);

-- Challenge Media: visible to challenge participants, target inserts
CREATE POLICY challenge_media_view ON public.challenge_media FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.challenges WHERE challenges.id = challenge_id
        AND (challenges.challenger_id = auth.uid() OR challenges.target_id = auth.uid()))
);
CREATE POLICY challenge_media_insert ON public.challenge_media FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.challenges WHERE challenges.id = challenge_id
        AND challenges.target_id = auth.uid())
);

-- Friends: both parties can view, requester creates, addressee updates
CREATE POLICY friends_view ON public.friends FOR SELECT
    USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY friends_create ON public.friends FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY friends_update ON public.friends FOR UPDATE USING (auth.uid() = addressee_id);

-- Notifications: own only
CREATE POLICY notifications_own ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Journal: own only
CREATE POLICY journal_own ON public.journal_entries FOR ALL USING (auth.uid() = user_id);

-- User Badges: own for write, public for read
CREATE POLICY user_badges_own ON public.user_badges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_badges_view ON public.user_badges FOR SELECT USING (true);

-- Reference tables: read-only for all authenticated users
CREATE POLICY habits_read ON public.habits FOR SELECT USING (true);
CREATE POLICY badges_read ON public.badges FOR SELECT USING (true);
CREATE POLICY health_milestones_read ON public.health_milestones FOR SELECT USING (true);
CREATE POLICY withdrawal_messages_read ON public.withdrawal_messages FOR SELECT USING (true);
CREATE POLICY dopamine_suggestions_read ON public.dopamine_suggestions FOR SELECT USING (true);
CREATE POLICY money_suggestions_read ON public.money_suggestions FOR SELECT USING (true);
```

---

## Section 4: Spring Boot Backend — Step-by-Step Build Plan

### Step 1: Project Initialization

> Bootstrap the Spring Boot project with all dependencies and folder structure.

- [ ] **Task 1.1:** Generate Spring Boot project via Spring Initializr — Java 21, Gradle (Kotlin DSL), Spring Boot 3.3.x, Group: `com.breakfree`, Artifact: `breakfree-api`. Dependencies: Spring Web, Spring Data JPA, Spring Security, Spring Validation, PostgreSQL Driver, Lombok, Actuator.
- [ ] **Task 1.2:** Add extra dependencies to `build.gradle.kts`: `com.stripe:stripe-java:26.1.0`, `nl.martijndwars:web-push:5.1.1`, `com.drewnoakes:metadata-extractor:2.19.0`, `com.resend:resend-java:3.0.0`, `io.jsonwebtoken:jjwt-api/impl/jackson:0.12.5`, `org.bouncycastle:bcprov-jdk18on:1.78`.
- [ ] **Task 1.3:** Create package structure under `src/main/java/com/breakfree/api/`: `config/`, `controller/`, `service/`, `repository/`, `model/entity/`, `model/dto/request/`, `model/dto/response/`, `model/enums/`, `security/`, `scheduler/`, `util/`, `exception/`.
- [ ] **Task 1.4:** Create `application.yml` with placeholder configs for: server port (8080), datasource (Supabase PostgreSQL), JWT secret, Stripe keys, Resend API key, Web Push VAPID keys, CORS origins.
- [ ] **Task 1.5:** Create `application-dev.yml` with dev overrides (debug logging, relaxed CORS).
- [ ] **Task 1.6:** Create `application-prod.yml` with prod overrides (strict CORS, info logging, connection pool sizing).
- [ ] **Task 1.7:** Create `.env.example` listing every required environment variable with descriptions.

### Step 2: Entity Layer

> Create all JPA entity classes mapping to the database schema.

- [ ] **Task 2.1:** Configure HikariCP in `application.yml`: JDBC URL, pool size 10, `spring.jpa.hibernate.ddl-auto: validate`.
- [ ] **Task 2.2:** Create `User.java` entity mapping to `public.users`. All columns, `@PreUpdate` for `updated_at`.
- [ ] **Task 2.3:** Create `Habit.java` entity mapping to `public.habits`.
- [ ] **Task 2.4:** Create `UserHabit.java` entity with `@ManyToOne` to `User` and `Habit`.
- [ ] **Task 2.5:** Create `CheckIn.java` entity with `@ManyToOne` to `User` and `UserHabit`.
- [ ] **Task 2.6:** Create `Streak.java` entity mapping to `public.streaks`.
- [ ] **Task 2.7:** Create `Challenge.java` entity with `@ManyToOne` for challenger and target `User`.
- [ ] **Task 2.8:** Create `ChallengeMedia.java` entity with `@ManyToOne` to `Challenge`.
- [ ] **Task 2.9:** Create `Friend.java` entity with `@ManyToOne` for requester and addressee `User`.
- [ ] **Task 2.10:** Create `Notification.java` entity.
- [ ] **Task 2.11:** Create `JournalEntry.java` entity.
- [ ] **Task 2.12:** Create `Badge.java` entity.
- [ ] **Task 2.13:** Create `UserBadge.java` entity.
- [ ] **Task 2.14:** Create `XpEvent.java` entity.
- [ ] **Task 2.15:** Create `Subscription.java` entity.
- [ ] **Task 2.16:** Create `HealthMilestone.java` entity.
- [ ] **Task 2.17:** Create `WithdrawalMessage.java` entity.
- [ ] **Task 2.18:** Create `DopamineSuggestion.java` entity.
- [ ] **Task 2.19:** Create `MoneySuggestion.java` entity.
- [ ] **Task 2.20:** Create `NotificationPreference.java` entity.
- [ ] **Task 2.21:** Create all enums in `model/enums/`: `UserType`, `SubscriptionStatus`, `CheckInStatus`, `ChallengeStatus`, `FriendshipStatus`, `MetadataStatus`, `BadgeRarity`, `Mood`, `WithdrawalSeverity`, `NotificationType`, `StreakBrokenBy`.

### Step 3: Repository Layer

> Create all Spring Data JPA repositories with custom query methods.

- [ ] **Task 3.1:** Create `UserRepository.java` — methods: `findByUsername`, `findByStripeCustomerId`, `searchByUsernameContainingIgnoreCase(String, Pageable)`.
- [ ] **Task 3.2:** Create `HabitRepository.java` — method: `findBySlug`.
- [ ] **Task 3.3:** Create `UserHabitRepository.java` — methods: `findByUserId`, `findByUserIdAndHabitId`, `findByUserIdAndIsActiveTrue`.
- [ ] **Task 3.4:** Create `CheckInRepository.java` — methods: `findByUserHabitIdAndCheckInDateBetween`, `findByUserHabitIdOrderByCheckInDateDesc`, `existsByUserHabitIdAndCheckInDate`, `countByUserHabitIdAndStatus`.
- [ ] **Task 3.5:** Create `StreakRepository.java` — methods: `findByUserHabitIdAndIsActiveTrue`, `findTopByUserHabitIdOrderByLengthDesc`.
- [ ] **Task 3.6:** Create `ChallengeRepository.java` — methods: `findByTargetIdAndStatus`, `findByChallengerIdOrderByCreatedAtDesc`, `findByStatusAndExpiresAtBefore`.
- [ ] **Task 3.7:** Create `ChallengeMediaRepository.java` — method: `findByChallengeId`.
- [ ] **Task 3.8:** Create `FriendRepository.java` — methods: `findPendingRequestsForUser`, `findAcceptedFriendsForUser` (custom `@Query` with UNION for bidirectional lookup).
- [ ] **Task 3.9:** Create `NotificationRepository.java` — methods: `findByUserIdOrderByCreatedAtDesc(Pageable)`, `countByUserIdAndIsReadFalse`, `markAllAsReadForUser` (`@Modifying @Query`).
- [ ] **Task 3.10:** Create `JournalEntryRepository.java` — methods: `findByUserIdOrderByEntryDateDesc(Pageable)`, `findByUserIdAndEntryDate`.
- [ ] **Task 3.11:** Create `BadgeRepository.java` — method: `findBySlug`.
- [ ] **Task 3.12:** Create `UserBadgeRepository.java` — methods: `findByUserId`, `existsByUserIdAndBadgeId`.
- [ ] **Task 3.13:** Create `XpEventRepository.java` — methods: `findByUserIdOrderByCreatedAtDesc(Pageable)`, `sumXpByUserId` (custom `@Query`).
- [ ] **Task 3.14:** Create `SubscriptionRepository.java` — methods: `findByUserId`, `findByStripeSubscriptionId`.
- [ ] **Task 3.15:** Create `HealthMilestoneRepository.java` — method: `findByHabitIdOrderByHoursAfterQuitAsc`.
- [ ] **Task 3.16:** Create `WithdrawalMessageRepository.java` — custom `@Query` to find message where day falls within `day_range_start` and `day_range_end` for a given habit.
- [ ] **Task 3.17:** Create `DopamineSuggestionRepository.java` — custom query by applicable habit and recovery stage.
- [ ] **Task 3.18:** Create `MoneySuggestionRepository.java` — method to find by country code where amount falls within min/max range.
- [ ] **Task 3.19:** Create `NotificationPreferenceRepository.java` — method: `findByUserId`.

### Step 4: Security — Supabase JWT Authentication

> Implement JWT-based auth that validates Supabase tokens on every request.

- [ ] **Task 4.1:** Create `SupabaseJwtConfig.java` in `config/` — reads Supabase JWT secret from env vars, exposes as `@Bean`.
- [ ] **Task 4.2:** Create `JwtAuthenticationFilter.java` in `security/` extending `OncePerRequestFilter` — extracts Bearer token, parses/validates JWT, extracts `sub` claim (user UUID), sets `SecurityContextHolder`.
- [ ] **Task 4.3:** Create `SecurityConfig.java` in `config/` — `SecurityFilterChain` bean: disable CSRF, configure CORS, stateless sessions, add JWT filter, permit `/api/v1/webhooks/**` and `/actuator/health`, require auth for all else.
- [ ] **Task 4.4:** Create `AuthenticatedUser.java` utility in `security/` with static method `getCurrentUserId()` returning `UUID` from SecurityContext.
- [ ] **Task 4.5:** Create `CorsConfig.java` in `config/` — `WebMvcConfigurer` bean with allowed origins (Vercel URL), methods (GET/POST/PUT/DELETE/PATCH/OPTIONS), headers.

### Step 5: Exception Handling

> Create global exception handler and custom exception types.

- [ ] **Task 5.1:** Create custom exceptions in `exception/`: `ResourceNotFoundException`, `BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `ConflictException`, `RateLimitExceededException`.
- [ ] **Task 5.2:** Create `ErrorResponse.java` DTO with: `int status`, `String error`, `String message`, `Instant timestamp`.
- [ ] **Task 5.3:** Create `GlobalExceptionHandler.java` (`@RestControllerAdvice`) — handle each custom exception with correct HTTP status codes, handle `MethodArgumentNotValidException`, and generic `Exception` as 500 fallback.

### Step 6: User Service & Controller

> Implement user profile management and search.

- [ ] **Task 6.1:** Create User request DTOs: `CreateUserRequest`, `UpdateUserRequest`.
- [ ] **Task 6.2:** Create User response DTOs: `UserProfileResponse`, `UserSearchResponse`.
- [ ] **Task 6.3:** Create `UserService.java` — methods: `createUser`, `getUserProfile`, `updateUserProfile`, `searchUsers`, `getPublicProfile`.
- [ ] **Task 6.4:** Create `UserController.java` — endpoints: `POST /api/v1/users`, `GET /api/v1/users/me`, `PUT /api/v1/users/me`, `GET /api/v1/users/{id}`, `GET /api/v1/users/search?q={query}`.

### Step 7: Habit Service & Controller

> Implement habit listing and user habit configuration.

- [ ] **Task 7.1:** Create `AddUserHabitRequest.java` DTO.
- [ ] **Task 7.2:** Create `HabitResponse.java` and `UserHabitResponse.java` DTOs.
- [ ] **Task 7.3:** Create `HabitService.java` — methods: `getAllHabits`, `addUserHabit`, `getUserHabits`, `updateUserHabit`, `deactivateUserHabit`.
- [ ] **Task 7.4:** Create `HabitController.java` — endpoints: `GET /api/v1/habits`, `POST /api/v1/users/me/habits`, `GET /api/v1/users/me/habits`, `PUT /api/v1/users/me/habits/{id}`, `DELETE /api/v1/users/me/habits/{id}`.

### Step 8: Onboarding Service & Controller

> Handle the complete onboarding flow as a single transactional endpoint.

- [ ] **Task 8.1:** Create `OnboardingRequest.java` DTO — list of habit configs + user profile fields + user type.
- [ ] **Task 8.2:** Create `OnboardingService.java` with `completeOnboarding(UUID userId, OnboardingRequest req)` — `@Transactional`: updates user profile, creates user_habit records, initializes notification prefs, awards onboarding XP, sets `onboarding_completed = true`.
- [ ] **Task 8.3:** Create `OnboardingController.java` — endpoint: `POST /api/v1/onboarding/complete`.

### Step 9: Check-In Service & Streak Calculation

> Handle daily check-ins and compute streaks.

- [ ] **Task 9.1:** Create `CheckInRequest.java` DTO (userHabitId, status, slipAmount, notes).
- [ ] **Task 9.2:** Create `CheckInResponse.java` DTO (check-in record + updated streak + XP earned + badges + empathetic message if slipped).
- [ ] **Task 9.3:** Create `StreakService.java` — methods: `calculateCurrentStreak(UUID userHabitId)` (count consecutive clean days backwards), `updateStreak(UUID userHabitId)`, `checkMilestone(int streakLength)`.
- [ ] **Task 9.4:** Create `CheckInService.java` — `recordCheckIn(UUID userId, CheckInRequest req)`: validate no duplicate, insert check_in, call StreakService, award XP, check badge triggers, trigger milestone notifications.
- [ ] **Task 9.5:** Create `CheckInController.java` — endpoints: `POST /api/v1/check-ins`, `GET /api/v1/check-ins?habitId={id}&from={date}&to={date}`.

### Step 10: Challenge Service, EXIF Extraction & Controller

> Implement challenge lifecycle including image upload and EXIF verification.

- [ ] **Task 10.1:** Create challenge DTOs: `CreateChallengeRequest`, `RespondChallengeRequest`, `ReviewChallengeRequest`.
- [ ] **Task 10.2:** Create `ChallengeResponse.java` and `ChallengeListResponse.java` DTOs.
- [ ] **Task 10.3:** Create `ExifExtractionService.java` — method: `extractMetadata(InputStream)` returns `ExifMetadata` DTO (timestamp, GPS, device info, hasExifData). Uses `metadata-extractor` library.
- [ ] **Task 10.4:** Create `ChallengeService.java` — methods: `createChallenge` (validate friendship, 1hr expiry, push notify), `respondToChallenge` (download images, EXIF extract, create media records), `reviewChallenge` (validate caller, update status, reset streak if rejected, award XP if approved).
- [ ] **Task 10.5:** Create `StorageService.java` — methods: `generateSignedUploadUrl(bucket, path)`, `downloadFile(path)` returning `InputStream`. Uses Supabase Storage REST API.
- [ ] **Task 10.6:** Create `ChallengeController.java` — endpoints: `POST /api/v1/challenges`, `GET /api/v1/challenges/received`, `GET /api/v1/challenges/sent`, `POST /api/v1/challenges/{id}/respond`, `POST /api/v1/challenges/{id}/review`, `GET /api/v1/challenges/{id}`, `POST /api/v1/storage/upload-url`.

### Step 11: Friends Service & Controller

> Implement friend requests, acceptance, and listing.

- [ ] **Task 11.1:** Create `FriendRequestAction.java` DTO (action: accept/decline/block).
- [ ] **Task 11.2:** Create `FriendResponse.java` and `FriendListResponse.java` DTOs.
- [ ] **Task 11.3:** Create `FriendService.java` — methods: `sendFriendRequest`, `respondToRequest`, `getFriends`, `getPendingRequests`, `removeFriend`.
- [ ] **Task 11.4:** Create `FriendController.java` — endpoints: `POST /api/v1/friends/request/{userId}`, `PUT /api/v1/friends/{id}/respond`, `GET /api/v1/friends`, `GET /api/v1/friends/pending`, `DELETE /api/v1/friends/{id}`.

### Step 12: Notification Service

> Implement push notifications, email, and notification management.

- [ ] **Task 12.1:** Create `WebPushService.java` — `sendPushNotification(UUID userId, String title, String body, Map data)`: reads push subscription from DB, sends via web-push library with VAPID keys. Handle expired subscriptions.
- [ ] **Task 12.2:** Create `EmailService.java` — `sendEmail(to, subject, htmlBody)` via Resend SDK. Template methods: `sendWelcomeEmail`, `sendWeeklyReport`, `sendStreakMilestoneEmail`.
- [ ] **Task 12.3:** Create `NotificationService.java` — `createNotification(userId, type, title, body, data)`: inserts into DB AND dispatches via push/email per user preferences. Also: `getNotifications(Pageable)`, `markAsRead`, `markAllAsRead`, `getUnreadCount`.
- [ ] **Task 12.4:** Create `NotificationController.java` — endpoints: `GET /api/v1/notifications`, `PUT /api/v1/notifications/{id}/read`, `PUT /api/v1/notifications/read-all`, `GET /api/v1/notifications/unread-count`, `POST /api/v1/notifications/push-subscription`, `PUT /api/v1/notifications/preferences`, `GET /api/v1/notifications/preferences`.

### Step 13: Gamification — XP & Badges

> Implement XP system, leveling, and badge awarding.

- [ ] **Task 13.1:** Create `XpService.java` — `awardXp(userId, eventType, amount, description, referenceId, referenceType)`: insert XP event, update user's `xp_total`, check level-up. Also: `getXpHistory(Pageable)`.
- [ ] **Task 13.2:** Create `LevelService.java` — `calculateLevel(totalXp)` using thresholds from Section 8. `getLevelName(level)`. `checkLevelUp(userId, oldXp, newXp)` triggers notification if level changed.
- [ ] **Task 13.3:** Create `BadgeService.java` — `checkAndAwardBadges(userId, triggerEvent, context)`: evaluate all badge conditions, award new badges, send notifications. `getUserBadges(userId)`.
- [ ] **Task 13.4:** Create `GamificationController.java` — endpoints: `GET /api/v1/gamification/xp`, `GET /api/v1/gamification/level`, `GET /api/v1/gamification/badges`, `GET /api/v1/gamification/badges/all`, `GET /api/v1/gamification/leaderboard`.

### Step 14: Analytics Service & Controller

> Implement analytics queries for habits, savings, health, and global stats.

- [ ] **Task 14.1:** Create `AnalyticsService.java` — methods: `getStreakCalendar(userId, userHabitId, year, month)` (heatmap data), `getMoneySaved(userId, userHabitId, period)`, `getCravingCorrelation(userId, userHabitId)`, `getCheckInTrends(userId)`.
- [ ] **Task 14.2:** Create `GlobalStatsService.java` — `getGlobalStats()` returns cached totals (users by habit, money saved, clean days). Use `@Cacheable` with 1-hour TTL.
- [ ] **Task 14.3:** Create `HealthTimelineService.java` — `getHealthTimeline(userId, userHabitId)`, `getActiveWithdrawalMessage(userId, userHabitId)`, `getDopamineSuggestions(userId)`, `getMoneySuggestions(userId, userHabitId)`.
- [ ] **Task 14.4:** Create `AnalyticsController.java` — endpoints: `GET /api/v1/analytics/streak-calendar`, `GET /api/v1/analytics/money-saved`, `GET /api/v1/analytics/cravings`, `GET /api/v1/analytics/health-timeline`, `GET /api/v1/analytics/withdrawal-message`, `GET /api/v1/analytics/dopamine-suggestions`, `GET /api/v1/analytics/money-suggestions`, `GET /api/v1/analytics/global-stats`.

### Step 15: Journal Service & Controller

> Implement private journaling and mood tracking.

- [ ] **Task 15.1:** Create `JournalEntryRequest.java` DTO (content, mood, moodEmoji, triggers[], copingStrategies[], isSharedWithSupporters).
- [ ] **Task 15.2:** Create `JournalService.java` — methods: `createEntry`, `updateEntry`, `getEntries(Pageable)`, `getEntryByDate`, `deleteEntry`, `getSharedEntries(supporterId)`.
- [ ] **Task 15.3:** Create `JournalController.java` — endpoints: `POST /api/v1/journal`, `PUT /api/v1/journal/{id}`, `GET /api/v1/journal`, `GET /api/v1/journal/date/{date}`, `DELETE /api/v1/journal/{id}`, `GET /api/v1/journal/shared`.

### Step 16: Payments — Stripe Integration

> Implement Stripe subscriptions: checkout, portal, and webhooks.

- [ ] **Task 16.1:** Create `StripeConfig.java` — initialize Stripe API key from env vars.
- [ ] **Task 16.2:** Create `PaymentService.java` — methods: `createCheckoutSession(userId, priceId, successUrl, cancelUrl)`, `createPortalSession(userId, returnUrl)`, `handleWebhookEvent(payload, sigHeader)`.
- [ ] **Task 16.3:** Implement webhook handlers in `PaymentService`: `handleCheckoutCompleted` (set user premium, create subscription), `handleSubscriptionUpdated`, `handleSubscriptionDeleted` (set cancelled), `handleInvoicePaymentFailed` (email user).
- [ ] **Task 16.4:** Create `PaymentController.java` — endpoints: `POST /api/v1/payments/checkout-session`, `POST /api/v1/payments/portal-session`, `GET /api/v1/payments/subscription`.
- [ ] **Task 16.5:** Create `StripeWebhookController.java` — endpoint: `POST /api/v1/webhooks/stripe` (no auth, signature-verified).

### Step 17: Scheduled Jobs

> Implement cron-based automated notifications and maintenance.

- [ ] **Task 17.1:** Create `SchedulerConfig.java` — `@EnableScheduling` + thread pool config.
- [ ] **Task 17.2:** Create `DailyCheckInReminderJob.java` — runs every minute, finds users whose `notification_time` matches current hour (timezone-adjusted) who haven't checked in today, sends push.
- [ ] **Task 17.3:** Create `StreakMilestoneJob.java` — daily at midnight UTC, scans for milestone hits (1, 3, 7, 14, 30, 60, 90, 180, 365), sends notifications + awards badges.
- [ ] **Task 17.4:** Create `WeeklyReportJob.java` — every Monday 9 AM, generates per-user weekly summary, sends via email + push.
- [ ] **Task 17.5:** Create `WithdrawalWarningJob.java` — daily, checks if user is on a "hard day" for their habit type, sends preemptive empathy notification.
- [ ] **Task 17.6:** Create `RelapseFollowUpJob.java` — hourly, finds users who slipped 24h ago, sends encouraging follow-up.
- [ ] **Task 17.7:** Create `ChallengeExpiryJob.java` — every 15 min, marks expired challenges.
- [ ] **Task 17.8:** Create `SupporterSummaryJob.java` — weekly, generates supported friends' progress summary for supporters, sends via email.

### Step 18: Rate Limiting

> Prevent API abuse.

- [ ] **Task 18.1:** Create `RateLimitConfig.java` — in-memory rate limiter (Bucket4j or custom). Limits: check-in 10/min, challenges 5/min, search 20/min, uploads 10/min, general 100/min per user.
- [ ] **Task 18.2:** Create `RateLimitFilter.java` — servlet filter that checks limits before processing, returns 429 when exceeded.

### Step 19: Premium Feature Gating

> Enforce subscription-based feature limits.

- [ ] **Task 19.1:** Create `PremiumService.java` — methods: `isPremium(userId)`, `canAddHabit(userId)` (free: 1 habit), `canAddFriend(userId)` (free: 3 friends), `hasAdvancedAnalytics(userId)`.
- [ ] **Task 19.2:** Create `@RequiresPremium` annotation + `PremiumCheckAspect.java` (Spring AOP) — checks subscription, throws `ForbiddenException` if not premium.

### Step 20: Docker & Deployment

> Containerize for Railway deployment.

- [ ] **Task 20.1:** Create `Dockerfile` — multi-stage build: JDK 21 build stage, JRE 21 runtime stage, expose 8080.
- [ ] **Task 20.2:** Create `docker-compose.yml` for local dev with PostgreSQL container.
- [ ] **Task 20.3:** Create `.dockerignore` — exclude `.git`, `build/`, `.gradle/`, `.env`, `node_modules`.
- [ ] **Task 20.4:** Create `railway.toml` for Railway deployment config.

### Step 21: Database Seed Data

> Populate reference tables with initial data.

- [ ] **Task 21.1:** Create `data.sql` seed script for `habits` table — 9 records (smoking, drinking, vaping, chewing_tobacco, pornography, social_media, sugar_junk_food, gambling, custom).
- [ ] **Task 21.2:** Create seed data for `health_milestones` — at least 30 entries across all habits (sourced from medical literature).
- [ ] **Task 21.3:** Create seed data for `withdrawal_messages` — at least 40 entries covering each habit's withdrawal timeline.
- [ ] **Task 21.4:** Create seed data for `dopamine_suggestions` — at least 25 suggestions across categories (exercise, social, creative, music, mindfulness).
- [ ] **Task 21.5:** Create seed data for `money_suggestions` — at least 30 suggestions for India (INR) covering ranges from ₹100 to ₹50,000+.
- [ ] **Task 21.6:** Create seed data for `badges` — all badges defined in Section 8 with trigger conditions as JSONB.
- [ ] **Task 21.7:** Create Supabase migration file `001_initial_schema.sql` containing all CREATE TABLE statements from Section 3.
- [ ] **Task 21.8:** Create Supabase migration file `002_rls_policies.sql` containing all RLS policies from Section 3.20.
- [ ] **Task 21.9:** Create Supabase migration file `003_seed_data.sql` containing all seed INSERT statements.

---

## Section 5: Next.js Frontend — Step-by-Step Build Plan

### Step 22: Project Setup

> Bootstrap the Next.js project with all tooling.

- [ ] **Task 22.1:** Create Next.js project: `npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`.
- [ ] **Task 22.2:** Install UI dependencies: `npm install @supabase/supabase-js @supabase/ssr three @react-three/fiber @react-three/drei zustand react-hook-form zod @hookform/resolvers lucide-react`.
- [ ] **Task 22.3:** Install shadcn/ui: `npx -y shadcn@latest init`. Configure with dark mode, New York style.
- [ ] **Task 22.4:** Add shadcn components: `npx shadcn@latest add button card dialog input label select tabs toast badge avatar dropdown-menu sheet progress separator switch textarea tooltip`.
- [ ] **Task 22.5:** Install chart library: `npm install recharts`.
- [ ] **Task 22.6:** Install date utility: `npm install date-fns`.
- [ ] **Task 22.7:** Create `.env.local.example` listing: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
- [ ] **Task 22.8:** Configure `next.config.js` for image domains (Supabase Storage).
- [ ] **Task 22.9:** Create global CSS design tokens in `src/app/globals.css`: color palette (warm amber/gold for streaks, cool blue for savings, soft green for health, gentle rose for empathy), dark mode as default, typography (Inter from Google Fonts).

### Step 23: Supabase Client & Auth

> Set up Supabase client and authentication hooks.

- [ ] **Task 23.1:** Create `src/lib/supabase/client.ts` — browser-side Supabase client using `createBrowserClient`.
- [ ] **Task 23.2:** Create `src/lib/supabase/server.ts` — server-side Supabase client using `createServerClient` with cookie handling.
- [ ] **Task 23.3:** Create `src/lib/supabase/middleware.ts` — Supabase auth middleware for refreshing sessions.
- [ ] **Task 23.4:** Create `src/middleware.ts` — Next.js middleware that uses Supabase middleware, protects routes (redirect unauthenticated users to `/login`, redirect authenticated users away from `/login` and `/signup`).
- [ ] **Task 23.5:** Create `src/hooks/useAuth.ts` — custom hook returning: `user`, `session`, `loading`, `signOut`, `signIn`, `signUp`.
- [ ] **Task 23.6:** Create `src/providers/AuthProvider.tsx` — context provider that wraps the app with auth state, listens to Supabase auth state changes.

### Step 24: API Client Layer

> Create typed fetch wrappers for every Spring Boot endpoint.

- [ ] **Task 24.1:** Create `src/lib/api/client.ts` — base fetch wrapper that: attaches Supabase JWT as Bearer token, handles errors, parses JSON, supports GET/POST/PUT/DELETE.
- [ ] **Task 24.2:** Create `src/lib/api/users.ts` — typed functions: `createUser`, `getMyProfile`, `updateMyProfile`, `getPublicProfile`, `searchUsers`.
- [ ] **Task 24.3:** Create `src/lib/api/habits.ts` — typed functions: `getAllHabits`, `addUserHabit`, `getMyHabits`, `updateUserHabit`, `deactivateUserHabit`.
- [ ] **Task 24.4:** Create `src/lib/api/onboarding.ts` — typed function: `completeOnboarding`.
- [ ] **Task 24.5:** Create `src/lib/api/checkins.ts` — typed functions: `recordCheckIn`, `getCheckInHistory`.
- [ ] **Task 24.6:** Create `src/lib/api/challenges.ts` — typed functions: `createChallenge`, `getReceivedChallenges`, `getSentChallenges`, `respondToChallenge`, `reviewChallenge`, `getChallengeDetails`, `getUploadUrl`.
- [ ] **Task 24.7:** Create `src/lib/api/friends.ts` — typed functions: `sendFriendRequest`, `respondToRequest`, `getFriends`, `getPendingRequests`, `removeFriend`.
- [ ] **Task 24.8:** Create `src/lib/api/notifications.ts` — typed functions: `getNotifications`, `markAsRead`, `markAllAsRead`, `getUnreadCount`, `registerPushSubscription`, `updatePreferences`, `getPreferences`.
- [ ] **Task 24.9:** Create `src/lib/api/gamification.ts` — typed functions: `getXpHistory`, `getLevel`, `getMyBadges`, `getAllBadges`, `getLeaderboard`.
- [ ] **Task 24.10:** Create `src/lib/api/analytics.ts` — typed functions: `getStreakCalendar`, `getMoneySaved`, `getCravings`, `getHealthTimeline`, `getWithdrawalMessage`, `getDopamineSuggestions`, `getMoneySuggestions`, `getGlobalStats`.
- [ ] **Task 24.11:** Create `src/lib/api/journal.ts` — typed functions: `createEntry`, `updateEntry`, `getEntries`, `getEntryByDate`, `deleteEntry`, `getSharedEntries`.
- [ ] **Task 24.12:** Create `src/lib/api/payments.ts` — typed functions: `createCheckoutSession`, `createPortalSession`, `getSubscription`.
- [ ] **Task 24.13:** Create `src/lib/api/types.ts` — all TypeScript interfaces/types that mirror the backend DTOs: `User`, `Habit`, `UserHabit`, `CheckIn`, `Streak`, `Challenge`, `ChallengeMedia`, `Friend`, `Notification`, `JournalEntry`, `Badge`, `UserBadge`, `XpEvent`, `Subscription`, `HealthMilestone`, `WithdrawalMessage`, `DopamineSuggestion`, `MoneySuggestion`, `NotificationPreference`, and all request/response types.

### Step 25: State Management (Zustand)

> Set up global state stores. Zustand chosen over Context for: less boilerplate, no provider nesting, built-in persistence, better performance via selective subscriptions.

- [ ] **Task 25.1:** Create `src/stores/authStore.ts` — state: `user`, `session`, `loading`. Actions: `setUser`, `setSession`, `clearAuth`.
- [ ] **Task 25.2:** Create `src/stores/habitStore.ts` — state: `habits`, `userHabits`, `loading`. Actions: `fetchHabits`, `fetchUserHabits`, `addHabit`, `updateHabit`.
- [ ] **Task 25.3:** Create `src/stores/notificationStore.ts` — state: `notifications`, `unreadCount`, `preferences`. Actions: `fetchNotifications`, `markRead`, `fetchUnreadCount`.
- [ ] **Task 25.4:** Create `src/stores/dashboardStore.ts` — state: `streaks`, `savings`, `healthTimeline`, `withdrawalMessage`, `dopamineSuggestions`, `moneySuggestions`. Actions for fetching each.

### Step 26: Layout & Navigation

> Build the app shell with navigation, sidebar, and responsive layout.

- [ ] **Task 26.1:** Create `src/app/layout.tsx` — root layout with: dark mode body class, Inter font, AuthProvider, Toaster, metadata (title, description, OG tags).
- [ ] **Task 26.2:** Create `src/app/(auth)/layout.tsx` — auth pages layout (centered card, no sidebar).
- [ ] **Task 26.3:** Create `src/app/(app)/layout.tsx` — authenticated app layout with sidebar navigation and top bar.
- [ ] **Task 26.4:** Create `src/components/layout/Sidebar.tsx` — navigation links: Dashboard, Friends, Journal, Analytics, Settings, Premium. Show user avatar, level, XP bar. Collapsible on mobile.
- [ ] **Task 26.5:** Create `src/components/layout/TopBar.tsx` — notification bell with unread count badge, user dropdown menu, mobile menu toggle.
- [ ] **Task 26.6:** Create `src/components/layout/MobileNav.tsx` — bottom navigation bar for mobile (Dashboard, Friends, Journal, Profile).

### Step 27: Landing Page

> Build the public marketing landing page.

- [ ] **Task 27.1:** Create `src/app/page.tsx` — landing page with: hero section with Three.js animated background, value propositions, feature highlights, social proof (global stats), CTA buttons (Sign Up, Learn More).
- [ ] **Task 27.2:** Create `src/components/landing/HeroSection.tsx` — headline, subheadline, animated CTA buttons, Three.js particle background.
- [ ] **Task 27.3:** Create `src/components/landing/FeatureGrid.tsx` — card grid showcasing key features with icons and descriptions.
- [ ] **Task 27.4:** Create `src/components/landing/GlobalStatsBar.tsx` — animated counters showing global stats ("20,432 users quit smoking, ₹1.2 crore saved").
- [ ] **Task 27.5:** Create `src/components/landing/Footer.tsx` — links, copyright, social media.

### Step 28: Auth Pages

> Build signup and login pages.

- [ ] **Task 28.1:** Create `src/app/(auth)/signup/page.tsx` — signup form (email, password, confirm password) with validation (react-hook-form + zod). On submit: Supabase auth signUp, then redirect to onboarding.
- [ ] **Task 28.2:** Create `src/app/(auth)/login/page.tsx` — login form (email, password) with validation. On submit: Supabase auth signInWithPassword, redirect to dashboard.
- [ ] **Task 28.3:** Create `src/app/(auth)/forgot-password/page.tsx` — password reset request form.
- [ ] **Task 28.4:** Create `src/components/auth/AuthCard.tsx` — reusable card wrapper for auth forms with logo and warm messaging.

### Step 29: Onboarding Flow

> Build the multi-step onboarding experience.

- [ ] **Task 29.1:** Create `src/app/(app)/onboarding/layout.tsx` — onboarding-specific layout: progress bar at top, no sidebar, step indicator.
- [ ] **Task 29.2:** Create `src/app/(app)/onboarding/page.tsx` — onboarding router that manages step state and navigation.
- [ ] **Task 29.3:** Create `src/components/onboarding/UserTypeStep.tsx` — "Are you here to quit a habit or support someone?" Two large, animated cards.
- [ ] **Task 29.4:** Create `src/components/onboarding/HabitSelectionStep.tsx` — visually rich card grid for habit selection (Smoking, Drinking, Vaping, etc.). Animated hover states, multi-select with visual feedback.
- [ ] **Task 29.5:** Create `src/components/onboarding/SmokingConfigStep.tsx` — cigarettes per day, brand/avg cost per cigarette, animated illustration.
- [ ] **Task 29.6:** Create `src/components/onboarding/DrinkingConfigStep.tsx` — drinks per week, avg cost per session.
- [ ] **Task 29.7:** Create `src/components/onboarding/VapingConfigStep.tsx` — pods/cartridges per week, avg cost.
- [ ] **Task 29.8:** Create `src/components/onboarding/TobaccoConfigStep.tsx` — usage frequency, cost.
- [ ] **Task 29.9:** Create `src/components/onboarding/PornographyConfigStep.tsx` — hours per day.
- [ ] **Task 29.10:** Create `src/components/onboarding/SocialMediaConfigStep.tsx` — hours per day, platform multi-select.
- [ ] **Task 29.11:** Create `src/components/onboarding/SugarConfigStep.tsx` — estimated spend per week.
- [ ] **Task 29.12:** Create `src/components/onboarding/GamblingConfigStep.tsx` — estimated spend per week.
- [ ] **Task 29.13:** Create `src/components/onboarding/CustomHabitConfigStep.tsx` — free text description + time or money per day.
- [ ] **Task 29.14:** Create `src/components/onboarding/SupporterConfigStep.tsx` — name, photo upload, friend search to find who they want to support.
- [ ] **Task 29.15:** Create `src/components/onboarding/QuitDateStep.tsx` — date picker (today or future date) with motivational copy.
- [ ] **Task 29.16:** Create `src/components/onboarding/NotificationTimeStep.tsx` — time picker for daily check-in reminder.
- [ ] **Task 29.17:** Create `src/components/onboarding/OnboardingComplete.tsx` — calls `completeOnboarding` API, then plays Three.js "New Beginning" animation, then redirects to dashboard.

### Step 30: Dashboard

> Build the main dashboard with all panels.

- [ ] **Task 30.1:** Create `src/app/(app)/dashboard/page.tsx` — dashboard layout assembling all panels. Fetches all dashboard data on mount.
- [ ] **Task 30.2:** Create `src/components/dashboard/StreakCard.tsx` — large, bold, animated streak counter per habit. Shows days/hours clean. Pulsing animation on current streak.
- [ ] **Task 30.3:** Create `src/components/dashboard/MoneySavedPanel.tsx` — money saved today/week/month/all-time per habit. Animated counter. Currency-aware formatting.
- [ ] **Task 30.4:** Create `src/components/dashboard/MoneyContextPanel.tsx` — "What could you do with this money?" suggestions. Country-aware. Rotating carousel.
- [ ] **Task 30.5:** Create `src/components/dashboard/HealthTimeline.tsx` — vertical timeline of physical recovery milestones. Check marks for passed milestones, upcoming milestones dimmed. Habit-specific.
- [ ] **Task 30.6:** Create `src/components/dashboard/WithdrawalEmpathyCard.tsx` — compassionate message for what the user might be feeling today. Habit-specific, day-specific. Warm rose color.
- [ ] **Task 30.7:** Create `src/components/dashboard/DopamineSuggestionCard.tsx` — rotating healthy dopamine replacement suggestions. Habit-aware, stage-aware.
- [ ] **Task 30.8:** Create `src/components/dashboard/QuickCheckIn.tsx` — two large buttons: "I'm clean today ✓" (green) and "I had a tough day" (gentle amber). No shaming language. On "clean": API call + celebration. On "slipped": API call + empathetic recovery modal.
- [ ] **Task 30.9:** Create `src/components/dashboard/XPLevelBar.tsx` — progress bar showing current XP, level name, progress to next level.
- [ ] **Task 30.10:** Create `src/components/dashboard/RecentBadges.tsx` — last 3 badges earned with icons.

### Step 31: Friends & Social Pages

> Build the friends system UI.

- [ ] **Task 31.1:** Create `src/app/(app)/friends/page.tsx` — friends list, pending requests tab, search bar, leaderboard.
- [ ] **Task 31.2:** Create `src/components/friends/FriendCard.tsx` — friend's avatar, name, top streak, money saved, "Challenge" button.
- [ ] **Task 31.3:** Create `src/components/friends/FriendRequestCard.tsx` — incoming request with accept/decline buttons.
- [ ] **Task 31.4:** Create `src/components/friends/UserSearchModal.tsx` — search by username, show results with "Add Friend" button.
- [ ] **Task 31.5:** Create `src/components/friends/Leaderboard.tsx` — ranked streaks among friends. Opt-in visibility. Tabs for weekly/all-time.
- [ ] **Task 31.6:** Create `src/components/friends/ChallengeModal.tsx` — send check-in challenge to friend. Select habit. Confirm send.
- [ ] **Task 31.7:** Create `src/components/friends/ChallengeResponseModal.tsx` — camera capture (1-3 photos), upload flow, progress indicator.
- [ ] **Task 31.8:** Create `src/components/friends/ChallengeReviewModal.tsx` — view photos, metadata status badges (verified/absent/failed), approve/reject buttons.
- [ ] **Task 31.9:** Create `src/components/friends/ChallengeHistory.tsx` — list of past challenges between two users.

### Step 32: Profile Page

> Build user profile views.

- [ ] **Task 32.1:** Create `src/app/(app)/profile/page.tsx` — current user's profile: avatar, name, bio, streak counts, total saved, badges grid, supporter count.
- [ ] **Task 32.2:** Create `src/app/(app)/profile/[id]/page.tsx` — public profile view for any user.
- [ ] **Task 32.3:** Create `src/components/profile/ProfileHeader.tsx` — avatar, name, level badge, member since.
- [ ] **Task 32.4:** Create `src/components/profile/BadgeGrid.tsx` — grid of all earned badges with rarity glow effects.
- [ ] **Task 32.5:** Create `src/components/profile/StatsOverview.tsx` — streak, money saved, clean days, supporter count.

### Step 33: Analytics Page

> Build the detailed analytics view.

- [ ] **Task 33.1:** Create `src/app/(app)/analytics/page.tsx` — per-habit analytics with tab navigation.
- [ ] **Task 33.2:** Create `src/components/analytics/HeatmapCalendar.tsx` — GitHub-style heatmap of clean days. Green shades for clean, empty for missed.
- [ ] **Task 33.3:** Create `src/components/analytics/SavingsChart.tsx` — line chart (Recharts) of money saved over time.
- [ ] **Task 33.4:** Create `src/components/analytics/CravingCorrelation.tsx` — chart correlating logged moods/triggers with clean vs. slip days.
- [ ] **Task 33.5:** Create `src/components/analytics/GlobalStatsPanel.tsx` — anonymous global statistics with animated counters.

### Step 34: Journal Page

> Build the private journaling UI.

- [ ] **Task 34.1:** Create `src/app/(app)/journal/page.tsx` — journal entry list with date navigation, create button.
- [ ] **Task 34.2:** Create `src/components/journal/JournalEntryCard.tsx` — date, mood emoji, content preview, shared indicator.
- [ ] **Task 34.3:** Create `src/components/journal/JournalEditor.tsx` — rich text area, mood picker, trigger tags, coping strategy tags, share toggle.
- [ ] **Task 34.4:** Create `src/components/journal/MoodPicker.tsx` — emoji-based mood selector (great/good/okay/tough/terrible) with animated selection.

### Step 35: Settings Page

> Build user settings and preferences.

- [ ] **Task 35.1:** Create `src/app/(app)/settings/page.tsx` — settings sections: Profile, Notifications, Privacy, Subscription, Account.
- [ ] **Task 35.2:** Create `src/components/settings/ProfileSettings.tsx` — edit name, bio, avatar, country, timezone.
- [ ] **Task 35.3:** Create `src/components/settings/NotificationSettings.tsx` — toggle switches for each notification type (mirrors `notification_preferences` table).
- [ ] **Task 35.4:** Create `src/components/settings/PrivacySettings.tsx` — leaderboard visibility toggle, profile visibility.
- [ ] **Task 35.5:** Create `src/components/settings/SubscriptionSettings.tsx` — current plan display, upgrade button (for free users), manage subscription button (Stripe portal link for premium users).
- [ ] **Task 35.6:** Create `src/components/settings/AccountSettings.tsx` — change password, delete account (with confirmation), export data.

### Step 36: Premium / Upgrade Page

> Build the premium upsell page.

- [ ] **Task 36.1:** Create `src/app/(app)/premium/page.tsx` — "Sovereign Plan" page: feature comparison table (free vs premium), price, animated CTA, testimonials.
- [ ] **Task 36.2:** Create `src/components/premium/PricingCard.tsx` — premium plan card with feature list, price, Stripe checkout button.
- [ ] **Task 36.3:** Implement Stripe Checkout redirect flow: call `createCheckoutSession`, redirect to Stripe, handle success/cancel return URLs.

### Step 37: Three.js Animation Components

> Build all immersive 3D animation moments.

- [ ] **Task 37.1:** Create `src/components/three/OnboardingCompleteAnimation.tsx` — full-screen particles converging into a phoenix/sunrise shape. Uses `@react-three/fiber` and `@react-three/drei`. Auto-plays for 5 seconds, then fades out.
- [ ] **Task 37.2:** Create `src/components/three/StreakMilestoneAnimation.tsx` — celebration explosion of golden particles. Triggered on Day 7, 30, 90, 365 milestones. Different intensity per milestone.
- [ ] **Task 37.3:** Create `src/components/three/ChallengeReceivedAnimation.tsx` — gentle pulse/ripple effect to grab attention without anxiety.
- [ ] **Task 37.4:** Create `src/components/three/RelapseRecoveryAnimation.tsx` — warm, slow aurora borealis effect. Communicates "it's okay, you're still here, you're still brave."
- [ ] **Task 37.5:** Create `src/components/three/LandingHeroBackground.tsx` — ambient floating particles/stars for the landing page hero section.

### Step 38: Empathetic UI Flows

> Build the compassionate interaction flows.

- [ ] **Task 38.1:** Create `src/components/empathy/RelapseRecoveryFlow.tsx` — multi-step modal: Step 1: "It's okay. You're human." Step 2: "What triggered this?" (optional). Step 3: "Here's what to do next" (dopamine suggestions). Step 4: "You're still in this. Your streak starts now." No shame. No blame. Only warmth.
- [ ] **Task 38.2:** Create `src/components/empathy/EmpatheticLoadingState.tsx` — reusable loading component that shows micro-copy instead of spinners. Accepts a `context` prop to customize message.
- [ ] **Task 38.3:** Create `src/components/empathy/EmptyState.tsx` — reusable warm empty state component with illustration prop and friendly message.

### Step 39: Push Notifications (Service Worker)

> Set up Web Push notifications in the browser.

- [ ] **Task 39.1:** Create `public/sw.js` — service worker that listens for push events, displays notifications with title/body/icon/badge, handles notification click (opens relevant app page).
- [ ] **Task 39.2:** Create `src/lib/pushNotifications.ts` — utility functions: `registerServiceWorker()`, `requestNotificationPermission()`, `subscribeToPush(vapidPublicKey)` — returns `PushSubscription`, `sendSubscriptionToBackend(subscription)`.
- [ ] **Task 39.3:** Create `src/components/notifications/PushPermissionPrompt.tsx` — non-intrusive prompt asking user to enable notifications. Shows during onboarding and on first dashboard visit.
- [ ] **Task 39.4:** Create `src/components/notifications/NotificationBell.tsx` — bell icon with unread count badge, dropdown showing recent notifications, "Mark all as read" button.

### Step 40: Supabase Realtime Subscriptions

> Set up real-time features for friend activity and challenges.

- [ ] **Task 40.1:** Create `src/hooks/useRealtimeChallenges.ts` — subscribes to Supabase Realtime on `challenges` table filtered by `target_id = currentUser.id`. On new challenge: show toast + play ChallengeReceivedAnimation.
- [ ] **Task 40.2:** Create `src/hooks/useRealtimeNotifications.ts` — subscribes to Supabase Realtime on `notifications` table filtered by `user_id`. On new notification: increment unread count, show toast.
- [ ] **Task 40.3:** Create `src/hooks/useRealtimeFriendActivity.ts` — subscribes to friend streak milestones. On friend milestone: show celebratory toast.

### Step 41: Image Upload Flow

> Build the camera capture and upload experience for challenges.

- [ ] **Task 41.1:** Create `src/hooks/useCamera.ts` — hook that accesses browser camera API (`navigator.mediaDevices.getUserMedia`), captures photo, returns blob.
- [ ] **Task 41.2:** Create `src/components/camera/CameraCapture.tsx` — camera viewfinder component with capture button, photo preview, retake option. Supports 1-3 photos.
- [ ] **Task 41.3:** Create `src/lib/imageUpload.ts` — utility: gets signed URL from backend, uploads image to Supabase Storage using signed URL, returns public URL.
- [ ] **Task 41.4:** Create `src/lib/exifCheck.ts` — client-side EXIF pre-check: reads image EXIF data (using a lightweight JS EXIF library like `exif-js`), warns user if photo appears to be from camera roll (old timestamp) vs. live capture. This is advisory only — backend does the authoritative check.

### Step 42: Form Validation Schemas

> Create Zod schemas for all forms.

- [ ] **Task 42.1:** Create `src/lib/validations/auth.ts` — Zod schemas for signup form (email, password min 8 chars, confirm match) and login form.
- [ ] **Task 42.2:** Create `src/lib/validations/onboarding.ts` — Zod schemas for each habit config step (e.g., cigarettes > 0, cost > 0).
- [ ] **Task 42.3:** Create `src/lib/validations/journal.ts` — Zod schema for journal entry (content max 5000 chars, mood required).
- [ ] **Task 42.4:** Create `src/lib/validations/profile.ts` — Zod schema for profile update (username 3-30 chars alphanumeric, bio max 500 chars).

---

## Section 6: Notification Architecture

### 6.1 Web Push

**Service Worker Registration:**
- Service worker file: `public/sw.js`
- Registered on first authenticated page load via `src/lib/pushNotifications.ts`
- On registration success, calls `Notification.requestPermission()`
- On permission granted, calls `registration.pushManager.subscribe()` with VAPID public key
- Resulting `PushSubscription` (endpoint, keys.p256dh, keys.auth) is sent to Spring Boot `POST /api/v1/notifications/push-subscription`, which stores it in `users.push_subscription` (JSONB)

**VAPID Key Management:**
- Generate VAPID key pair once using `web-push` library's CLI tool
- Store public key in frontend env: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- Store private key in backend env: `VAPID_PRIVATE_KEY`
- Store subject (email) in backend env: `VAPID_SUBJECT`

**Sending Pushes (Backend):**
- `WebPushService.sendPushNotification()` reads `users.push_subscription` JSON
- Constructs `nl.martijndwars.webpush.Notification` with endpoint, keys, payload (JSON: title, body, icon, url)
- Sends via `PushService.send(notification)`
- If push fails with 410 Gone: delete the user's push_subscription (expired)

### 6.2 Email Templates (Resend)

| Email Type | Trigger | Content |
|---|---|---|
| Welcome | After onboarding complete | Warm welcome, what to expect, daily check-in reminder |
| Weekly Report | Monday 9 AM (scheduled job) | Streaks summary, money saved this week, badges earned |
| Streak Milestone | Day 7, 30, 90, 365 | Celebration, health recovery progress, encouragement |
| Relapse Follow-up | 24h after a slip | Empathy, recovery tips, "you're still here" message |
| Friend Milestone | Friend hits milestone | "[Friend] just hit 30 days! Send them encouragement" |
| Payment Confirmation | After Stripe checkout | Subscription details, premium features unlocked |
| Payment Failed | Invoice payment fails | Action required, link to update payment method |

### 6.3 Supabase Realtime

| Channel | Event | Table | Filter | Frontend Action |
|---|---|---|---|---|
| `challenges:{userId}` | INSERT | `challenges` | `target_id=eq.{userId}` | Show challenge toast + animation |
| `notifications:{userId}` | INSERT | `notifications` | `user_id=eq.{userId}` | Increment unread count, show toast |
| `check_ins:friends` | INSERT | `check_ins` | (via backend broadcast) | Show friend activity in feed |

**Note:** Supabase Realtime listens to Postgres changes. The backend may also use Supabase's broadcast feature to send custom events.

### 6.4 Notification Preferences

Users can toggle each notification type on/off via `notification_preferences` table. The `NotificationService` checks preferences before dispatching any notification. If email is disabled but push is enabled (or vice versa), only the enabled channel fires.

---

## Section 7: Image Verification Pipeline

### 7.1 Complete Flow

```
1. Challenger sends challenge
   → POST /api/v1/challenges (creates record, sets expires_at = now + 1 hour)
   → Push notification sent to target

2. Target opens app, sees challenge
   → Camera capture UI opens (CameraCapture.tsx)
   → User takes 1-3 photos using browser camera API

3. For each photo:
   → Frontend requests signed upload URL: POST /api/v1/storage/upload-url
   → Backend generates Supabase Storage signed URL (valid 5 min)
   → Frontend uploads image directly to Supabase Storage using signed URL
   → Frontend collects all public URLs

4. Target submits response
   → POST /api/v1/challenges/{id}/respond { media_urls: [...] }

5. Backend processes each image:
   → Downloads image from Supabase Storage via StorageService
   → Passes InputStream to ExifExtractionService.extractMetadata()
   → metadata-extractor library reads:
     - ExifIFD0Directory → DateTimeOriginal
     - GpsDirectory → GPS latitude/longitude
     - ExifIFD0Directory → Make, Model
   → Returns ExifMetadata DTO

6. Timestamp validation:
   → IF DateTimeOriginal exists:
     → Parse to Instant
     → Compare with challenge.created_at
     → IF within 10 minutes: metadata_status = 'verified'
     → IF older than 10 minutes: metadata_status = 'failed'
   → IF DateTimeOriginal absent (screenshots, edited photos):
     → metadata_status = 'absent'
     → verification_notes = "No EXIF timestamp found"

7. Create challenge_media records with all extracted data
8. Update challenge status to 'responded'
9. Notify challenger: "Photos ready for review"

10. Challenger reviews photos
    → Sees photos with metadata status badges:
      - 🟢 "Verified" — EXIF timestamp matches
      - 🟡 "No metadata" — EXIF absent
      - 🔴 "Timestamp mismatch" — old photo detected
    → Approves or rejects
```

### 7.2 Handling Missing EXIF Data

- **Screenshots:** No EXIF data. Status: `absent`. Challenger is warned but can still approve.
- **Some Android phones:** May strip EXIF on camera capture. Status: `absent`.
- **Edited images:** Often lose EXIF. Status: `absent`.
- **Policy:** Missing EXIF is a yellow flag, not an automatic rejection. The human challenger makes the final call.

### 7.3 GPS as Trust Signal

- GPS is **optional** and **advisory**. Never required.
- If GPS is present: shown to challenger as approximate location ("Near [City]")
- Adds trust signal: "Photo was taken at a plausible location"
- **Privacy:** GPS data is stored but only visible to the challenge participants. Never shared publicly.

### 7.4 Security Measures

- **Signed upload URLs:** Generated by backend, valid for 5 minutes, scoped to a specific path in Supabase Storage. Prevents unauthorized uploads.
- **Max file size:** 10 MB per image (enforced in Supabase Storage bucket settings and validated by backend)
- **Accepted MIME types:** `image/jpeg`, `image/png`, `image/webp` only
- **Storage path convention:** `challenges/{challengeId}/{mediaId}.{ext}` — prevents collision
- **No virus scanning in MVP:** But architecture supports adding ClamAV or similar in the EXIF extraction pipeline later

---

## Section 8: Gamification Engine

### 8.1 XP Formula

| Action | XP Earned |
|---|---|
| Daily check-in (clean) | 10 XP |
| Daily check-in (slipped — honesty bonus) | 3 XP |
| Streak milestone: Day 3 | 25 XP |
| Streak milestone: Day 7 | 50 XP |
| Streak milestone: Day 14 | 75 XP |
| Streak milestone: Day 30 | 150 XP |
| Streak milestone: Day 60 | 250 XP |
| Streak milestone: Day 90 | 400 XP |
| Streak milestone: Day 180 | 600 XP |
| Streak milestone: Day 365 | 1000 XP |
| Completing a challenge (approved) | 30 XP |
| Sending a challenge (that gets approved) | 15 XP |
| Adding a journal entry | 5 XP |
| Logging a mood | 3 XP |
| Completing onboarding | 20 XP |
| Coming back after relapse + 7 clean days | 100 XP ("Rising Again" bonus) |

### 8.2 Level Thresholds

| Level | XP Required | Name | Meaning |
|---|---|---|---|
| 1 | 0 | Spark | The decision to change |
| 2 | 50 | Ember | The fire is catching |
| 3 | 150 | Kindling | Building momentum |
| 4 | 300 | Flame | Burning through old patterns |
| 5 | 500 | Rewiring | Your brain is physically changing |
| 6 | 750 | Clarity | The fog is lifting |
| 7 | 1,100 | Resilience | You've survived the hardest days |
| 8 | 1,500 | Foundation | Building a new identity |
| 9 | 2,000 | Momentum | Unstoppable forward motion |
| 10 | 2,700 | Reclaimed | Your life is yours again |
| 12 | 4,000 | Guardian | Helping others on their journey |
| 15 | 6,500 | Luminary | A light for those around you |
| 20 | 12,000 | Sovereign | Complete mastery over your choices |
| 25 | 20,000 | Legend | Your story inspires generations |

### 8.3 Badge Definitions

| Badge | Condition | Rarity |
|---|---|---|
| First Step | Complete onboarding | Common |
| First Day Warrior | 1 day clean on any habit | Common |
| First Week Warrior | 7 days clean on any habit | Common |
| Honest Heart | Log a slip (first time) | Common |
| Rising Again | 7 clean days after a relapse | Uncommon |
| Dopamine Rebuilt | 30 days clean on any habit | Uncommon |
| Money Saver: Bronze | Save ₹1,000+ | Common |
| Money Saver: Silver | Save ₹10,000+ | Uncommon |
| Money Saver: Gold | Save ₹50,000+ | Rare |
| Accountability Champion | Send 10 challenges that get approved | Uncommon |
| 30-Day Legend | 30-day streak on any habit | Rare |
| 90-Day Phoenix | 90-day streak on any habit | Epic |
| One Year Sovereign | 365-day streak on any habit | Legendary |
| Journal Keeper | Write 30 journal entries | Uncommon |
| Mood Master | Log mood for 30 consecutive days | Uncommon |
| Social Butterfly | Add 10 friends | Common |
| Multi-Habit Hero | Quit 3+ habits simultaneously | Rare |
| Supporter Star | As supporter, send 20 challenges | Rare |
| Community Pillar | Reach Level 15 | Epic |
| Ultimate Sovereign | Reach Level 20 | Legendary |

### 8.4 Leaderboard

- **Calculation:** Leaderboard ranks users by total current streak across all habits. Ties broken by total XP.
- **Refresh:** Leaderboard data is cached and refreshed every 15 minutes via a backend query.
- **Scopes:** Friends leaderboard (only friends) and global leaderboard (all users who opted in).
- **Privacy:** Users can opt out via `notification_preferences.leaderboard_visible`. Opted-out users do not appear.

### 8.5 Anti-Cheat Measures

- **One check-in per habit per day:** Database UNIQUE constraint on `(user_habit_id, check_in_date)`.
- **Challenge timestamp verification:** EXIF extraction prevents using old photos.
- **Rate limiting:** Check-in endpoints rate-limited to 10/min.
- **Challenge cooldown:** Cannot send another challenge to the same user within 1 hour.
- **XP caps:** No more than 100 XP per day from check-ins alone (prevents multi-habit spam for XP farming).
- **Backend-only streak calculation:** Clients cannot set their own streak — it is always computed server-side.

---

## Section 9: Analytics Engine

### 9.1 Streak Data: Event-Sourced

Streaks are **event-sourced** from the `check_ins` table:

- The `check_ins` table is the source of truth
- `user_habits.current_streak` and `longest_streak` are **computed caches** updated by `StreakService` after every check-in
- The `streaks` table stores **historical streak records** (start date, end date, length, what broke it) for analytics
- Streak calendar (heatmap) is computed by querying `check_ins` for a given month/year

### 9.2 Money Savings Computation

Money saved is computed in real-time based on:

```
daily_savings = (frequency_value / frequency_period_days) × cost_per_unit

Where:
- For smoking: frequency_value = cigarettes_per_day, cost_per_unit = cost_per_cigarette
  → daily_savings = cigarettes_per_day × cost_per_cigarette
- For drinking: frequency_value = drinks_per_week, cost_per_unit = cost_per_session
  → daily_savings = (drinks_per_week / 7) × cost_per_session
- For vaping: frequency_value = pods_per_week, cost_per_unit = cost_per_pod
  → daily_savings = (pods_per_week / 7) × cost_per_pod

total_saved = daily_savings × total_clean_days
today_saved = daily_savings (if today is clean)
week_saved = daily_savings × clean_days_this_week
month_saved = daily_savings × clean_days_this_month
```

Savings are deducted on slip days: if a user slips and logs a `slip_amount`, that is subtracted from the total.

### 9.3 Health Milestone Timeline

- `health_milestones` table is pre-seeded with medically sourced recovery data per habit
- `HealthTimelineService.getHealthTimeline()` fetches milestones for the user's habit, calculates `hours_since_quit = NOW() - user_habit.quit_date`, and marks milestones as passed/upcoming
- Displayed as a vertical timeline with checkmarks for passed items

### 9.4 Global Stats

- Aggregation queries: `SELECT COUNT(DISTINCT user_id), SUM(total_clean_days), SUM(total_money_saved) FROM user_habits GROUP BY habit_id`
- Cached with `@Cacheable("globalStats")` with 1-hour TTL
- Served via `GET /api/v1/analytics/global-stats`
- Displayed on landing page and in analytics

---

## Section 10: Payments Architecture

### 10.1 Stripe Setup

- **Product:** "BreakFree Sovereign Plan"
- **Price:** Monthly recurring (suggested: $4.99/₹399 per month)
- **Stripe Dashboard:** Create product + price, note the `price_id`
- Store in backend env: `STRIPE_PRICE_ID`, `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`
- Store in frontend env: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 10.2 Checkout Flow

```
Frontend: User clicks "Upgrade" on /premium page
→ Calls POST /api/v1/payments/checkout-session { priceId, successUrl, cancelUrl }
→ Backend: Creates or retrieves Stripe Customer (by user email)
→ Creates Checkout Session with customer, price, success/cancel URLs
→ Returns session.url
→ Frontend: window.location.href = session.url (redirects to Stripe)
→ User completes payment on Stripe
→ Stripe redirects to successUrl (/premium/success)
```

### 10.3 Webhook Events

| Event | Handler | Action |
|---|---|---|
| `checkout.session.completed` | `handleCheckoutCompleted` | Set `users.subscription_status = 'premium'`, create `subscriptions` record |
| `customer.subscription.updated` | `handleSubscriptionUpdated` | Update `subscriptions` record (period dates, cancel status) |
| `customer.subscription.deleted` | `handleSubscriptionDeleted` | Set `users.subscription_status = 'cancelled'`, update `subscriptions.status` |
| `invoice.payment_failed` | `handleInvoicePaymentFailed` | Send email to user with link to update payment method |

### 10.4 Subscription Status Propagation

- `users.subscription_status` is always in sync with Stripe via webhooks
- Backend checks: `PremiumService.isPremium(userId)` reads from `users` table
- Frontend checks: `user.subscription_status === 'premium'` in Zustand auth store
- Both frontend and backend gate premium features independently (defense in depth)

### 10.5 Feature Gating

| Feature | Free | Premium |
|---|---|---|
| Number of habits | 1 | Unlimited |
| Number of friends | 3 | Unlimited |
| Basic analytics (streak, savings) | ✅ | ✅ |
| Advanced analytics (heatmap, correlations) | ❌ | ✅ |
| Priority challenge processing | ❌ | ✅ |
| Exclusive badges | ❌ | ✅ |
| Journal entries | 10/month | Unlimited |
| Ad-free experience | ❌ | ✅ |

---

## Section 11: Security & Privacy

### 11.1 JWT Validation

- Every Spring Boot endpoint (except `/api/v1/webhooks/**` and `/actuator/health`) requires a valid Supabase JWT
- `JwtAuthenticationFilter` runs on every request:
  1. Extracts `Authorization: Bearer <token>` header
  2. Parses JWT using Supabase JWT secret (HS256)
  3. Validates: signature, expiry (`exp`), issuer
  4. Extracts `sub` claim → user UUID
  5. Sets `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`
- If token is invalid/expired → 401 Unauthorized

### 11.2 Rate Limiting

| Endpoint Group | Limit | Window |
|---|---|---|
| `POST /api/v1/check-ins` | 10 requests | per minute per user |
| `POST /api/v1/challenges` | 5 requests | per minute per user |
| `GET /api/v1/users/search` | 20 requests | per minute per user |
| `POST /api/v1/storage/upload-url` | 10 requests | per minute per user |
| All other endpoints | 100 requests | per minute per user |
| `POST /api/v1/webhooks/stripe` | 50 requests | per minute (global) |

Implemented via `RateLimitFilter` using Bucket4j or in-memory token bucket per user UUID.

### 11.3 Image Upload Security

- Signed upload URLs with 5-minute expiry
- Max file size: 10 MB (enforced at Supabase Storage bucket level)
- Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`
- Storage paths are namespaced: `challenges/{challengeId}/{mediaId}.{ext}`
- Backend downloads and processes images in a sandboxed temp directory
- Temp files are deleted after EXIF extraction

### 11.4 Row Level Security (RLS)

- RLS is enabled on all 13 user-data tables (see Section 3.20)
- RLS acts as the **last line of defense** — even if there is a bug in the Spring Boot API, the database itself prevents unauthorized access
- Service role key (used by Spring Boot for server-side operations) bypasses RLS — stored only in backend env vars, never exposed to frontend

### 11.5 GDPR / Data Deletion

- User can request account deletion from Settings page
- `DELETE /api/v1/users/me` endpoint:
  1. Cancels Stripe subscription (if active)
  2. Deletes all user data from all tables (CASCADE from `users` table handles most)
  3. Deletes user's files from Supabase Storage
  4. Calls Supabase Auth admin API to delete auth record
  5. Returns confirmation
- User data export: `GET /api/v1/users/me/export` returns JSON of all user data

### 11.6 Supporter-Challenger Trust Model

- Only accepted friends can send challenges to each other
- Supporters can send challenges to users they're supporting (verified by friendship + supporter user_type)
- Challenge photos are visible only to the two parties (RLS policy on `challenge_media`)
- A user can block another user via `friends` table — blocked users cannot send challenges
- Challenge history is private between the two participants

---

## Section 12: Deployment

### 12.1 Vercel (Next.js Frontend)

- [ ] **Task D1:** Connect GitHub repo to Vercel project
- [ ] **Task D2:** Set framework preset to Next.js
- [ ] **Task D3:** Configure environment variables in Vercel dashboard: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL` (Spring Boot URL), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- [ ] **Task D4:** Set build command: `npm run build`
- [ ] **Task D5:** Set output directory: `.next`
- [ ] **Task D6:** Enable automatic deployments on push to `main` branch

### 12.2 Railway (Spring Boot Backend)

- [ ] **Task D7:** Create Railway project and connect GitHub repo
- [ ] **Task D8:** Configure Dockerfile deploy (Railway auto-detects Dockerfile)
- [ ] **Task D9:** Set environment variables in Railway: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `SUPABASE_JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `RESEND_API_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `CORS_ALLOWED_ORIGINS`, `SPRING_PROFILES_ACTIVE=prod`
- [ ] **Task D10:** Configure Railway custom domain or use generated domain
- [ ] **Task D11:** Set health check path: `/actuator/health`

### 12.3 Supabase Project Setup

- [ ] **Task D12:** Create Supabase project (select region closest to target users)
- [ ] **Task D13:** Run migration `001_initial_schema.sql` in Supabase SQL editor
- [ ] **Task D14:** Run migration `002_rls_policies.sql`
- [ ] **Task D15:** Run migration `003_seed_data.sql`
- [ ] **Task D16:** Create Storage bucket `challenge-media` with: public access disabled, max file size 10 MB, allowed MIME types
- [ ] **Task D17:** Enable Realtime on tables: `challenges`, `notifications`, `check_ins`
- [ ] **Task D18:** Configure auth: enable email/password provider, set redirect URLs, configure email templates
- [ ] **Task D19:** Note and save: Project URL, Anon Key, Service Role Key, JWT Secret, Database URL

### 12.4 CI/CD (GitHub Actions)

- [ ] **Task D20:** Create `.github/workflows/backend-ci.yml`: on push to `main` → checkout → setup JDK 21 → `./gradlew build` → `./gradlew test` → deploy to Railway (via Railway GitHub integration or CLI)
- [ ] **Task D21:** Create `.github/workflows/frontend-ci.yml`: on push to `main` → checkout → setup Node → `npm ci` → `npm run lint` → `npm run build` (Vercel handles deploy automatically, this is for CI checks)

### 12.5 Environment Separation

| Environment | Frontend | Backend | Database |
|---|---|---|---|
| **Development** | `localhost:3000` | `localhost:8080` | Supabase dev project (or local Docker Postgres) |
| **Staging** | Vercel preview deployments (PR branches) | Railway staging service | Supabase staging project |
| **Production** | Vercel production (main branch) | Railway production service | Supabase production project |

- Each environment has its own set of environment variables
- Stripe: use test mode keys for dev/staging, live keys for production
- Supabase: separate projects for staging and production

---

## Section 13: The Master Step-by-Step Build Order

This is the exact sequence a developer should follow. Each step references its section.

### Phase 1: Infrastructure Setup

- [ ] **Step 1** (§12.3) — Set up Supabase project, create database, run schema migrations, seed data
- [ ] **Step 2** (§4, Step 1) — Initialize Spring Boot project with all dependencies
- [ ] **Step 3** (§5, Step 22) — Initialize Next.js project with all dependencies

### Phase 2: Backend Foundation

- [ ] **Step 4** (§4, Step 2) — Create all JPA entity classes
- [ ] **Step 5** (§4, Step 3) — Create all repository interfaces
- [ ] **Step 6** (§4, Step 4) — Implement Supabase JWT authentication (filter + security config)
- [ ] **Step 7** (§4, Step 5) — Set up global exception handling

### Phase 3: Backend Core APIs

- [ ] **Step 8** (§4, Step 6) — User service + controller
- [ ] **Step 9** (§4, Step 7) — Habit service + controller
- [ ] **Step 10** (§4, Step 8) — Onboarding service + controller
- [ ] **Step 11** (§4, Step 9) — Check-in service + streak calculation + controller
- [ ] **Step 12** (§4, Step 11) — Friends service + controller

### Phase 4: Frontend Foundation

- [ ] **Step 13** (§5, Step 23) — Set up Supabase client + auth hooks
- [ ] **Step 14** (§5, Step 24) — Create API client layer (all typed fetch wrappers)
- [ ] **Step 15** (§5, Step 25) — Set up Zustand state stores
- [ ] **Step 16** (§5, Step 26) — Build layout + navigation (sidebar, top bar, mobile nav)
- [ ] **Step 17** (§5, Step 42) — Create form validation schemas

### Phase 5: Auth & Onboarding Flow

- [ ] **Step 18** (§5, Step 28) — Build auth pages (signup, login, forgot password)
- [ ] **Step 19** (§5, Step 29) — Build onboarding flow (all steps, all habit configs)
- [ ] **Step 20** (§5, Step 37, Task 37.1) — Build OnboardingComplete Three.js animation

### Phase 6: Dashboard

- [ ] **Step 21** (§5, Step 30) — Build dashboard with all panels (streaks, savings, health timeline, withdrawal empathy, dopamine suggestions, quick check-in)
- [ ] **Step 22** (§5, Step 38) — Build empathetic UI flows (relapse recovery, loading states, empty states)
- [ ] **Step 23** (§5, Step 37, Tasks 37.2-37.4) — Build remaining Three.js animations (milestone, challenge, relapse)

### Phase 7: Social Features

- [ ] **Step 24** (§5, Step 31) — Build friends pages (friend list, requests, search, leaderboard)
- [ ] **Step 25** (§4, Step 10) — Build challenge backend (EXIF extraction, storage service, challenge service + controller)
- [ ] **Step 26** (§5, Step 31, Tasks 31.6-31.9) — Build challenge UI (send, respond with camera, review, history)
- [ ] **Step 27** (§5, Step 41) — Build image upload flow (camera capture, upload, EXIF pre-check)

### Phase 8: Notifications

- [ ] **Step 28** (§4, Step 12) — Build notification backend (web push, email, notification service)
- [ ] **Step 29** (§5, Step 39) — Build push notification frontend (service worker, permission prompt, bell)
- [ ] **Step 30** (§5, Step 40) — Set up Supabase Realtime subscriptions

### Phase 9: Gamification

- [ ] **Step 31** (§4, Step 13) — Build XP, level, and badge services
- [ ] **Step 32** (§5, Step 30, Tasks 30.9-30.10) — Build XP bar and badge display components

### Phase 10: Journal & Analytics

- [ ] **Step 33** (§4, Step 15) — Build journal backend
- [ ] **Step 34** (§5, Step 34) — Build journal frontend
- [ ] **Step 35** (§4, Step 14) — Build analytics backend (streak calendar, savings, health, global stats)
- [ ] **Step 36** (§5, Step 33) — Build analytics frontend (heatmap, charts, correlations)

### Phase 11: Payments

- [ ] **Step 37** (§4, Step 16) — Build Stripe backend (checkout, portal, webhooks)
- [ ] **Step 38** (§4, Step 19) — Build premium feature gating
- [ ] **Step 39** (§5, Step 36) — Build premium/upgrade page + Stripe checkout flow

### Phase 12: Profile & Settings

- [ ] **Step 40** (§5, Step 32) — Build profile pages
- [ ] **Step 41** (§5, Step 35) — Build settings pages

### Phase 13: Automated Jobs

- [ ] **Step 42** (§4, Step 17) — Build all scheduled jobs (daily reminders, weekly reports, withdrawal warnings, challenge expiry, relapse follow-up, supporter summary)

### Phase 14: Security & Hardening

- [ ] **Step 43** (§4, Step 18) — Implement rate limiting
- [ ] **Step 44** (§4, Step 21) — Finalize database seed data

### Phase 15: Landing Page

- [ ] **Step 45** (§5, Step 27) — Build landing page with Three.js hero background
- [ ] **Step 46** (§5, Step 37, Task 37.5) — Build landing hero Three.js animation

### Phase 16: Deployment

- [ ] **Step 47** (§4, Step 20) — Dockerize Spring Boot backend
- [ ] **Step 48** (§12) — Deploy to Vercel (frontend) + Railway (backend) + configure Supabase production
- [ ] **Step 49** (§12.4) — Set up CI/CD with GitHub Actions

### Phase 17: Polish

- [ ] **Step 50** — End-to-end testing: walk through entire flow (signup → onboarding → check-in → challenge → review dashboard → journal → analytics → upgrade → settings)
- [ ] **Step 51** — Mobile responsive audit: test all pages on mobile viewport sizes
- [ ] **Step 52** — Copy review: audit every string in the app for empathetic language, no shaming
- [ ] **Step 53** — Performance audit: Lighthouse, bundle size, API response times
- [ ] **Step 54** — Security audit: check all endpoints require auth, RLS is enforced, rate limits work

---

## What Makes This Different

### An Essay on the Emotional and Scientific Design Philosophy of BreakFree

Most habit-tracking apps treat addiction like a productivity problem. They give you a checkbox, maybe a streak counter, and call it done. They do not understand that quitting smoking is not like remembering to drink water. They do not understand that on Day 3, your brain is screaming for nicotine so loud you cannot think straight. They do not understand that on Day 7, you are not just fighting a habit — you are fighting your own neurochemistry.

BreakFree is different because it was designed by understanding what addiction actually is: a neurological condition, not a moral failing. When a person smokes 20 cigarettes a day for ten years, their D2 dopamine receptors have been so consistently flooded that their brain has literally downregulated — built fewer receptors. When they quit, they are not just "missing" cigarettes. They are experiencing a genuine dopamine deficit. Their brain is producing normal amounts of dopamine, but they have fewer receptors to catch it. Everything feels flat. Food tastes bland. Music sounds distant. Social interactions feel draining. This is called anhedonia, and it is the single biggest reason people relapse.

BreakFree is the first product designed specifically for anhedonia. When a user is on Day 5 of quitting smoking and they feel nothing — no joy, no energy, no motivation — the app does not say "Stay strong!" like every other app. Instead, it says: "Your brain is rewiring right now. Your dopamine receptors are physically rebuilding. What you are feeling is temporary — it is the gap between your old brain and your new one. Here is what can help right now: a 20-minute walk (raises dopamine 25%), calling a friend (oxytocin cross-activates dopamine pathways), or learning one new chord on a guitar (novelty triggers dopamine without addiction). Your brain needs healthy dopamine today. Let us help you find it."

That is not productivity software. That is a companion that understands neuroscience.

The social accountability system is similarly grounded in research. The most robust predictor of long-term sobriety is not willpower, not apps, not even therapy — it is social support. People who have at least one accountability partner are twice as likely to stay clean. But existing apps treat social features as an afterthought — leaderboards and friend lists bolted onto a solo experience. BreakFree makes social accountability the core mechanic. The challenge system — where a friend can say "prove to me you are clean right now" and the user must respond with verified real-time photos — is not a gimmick. It is the digital equivalent of having a sponsor in AA, someone who checks in, who cares, who holds you accountable not with judgment but with presence.

The EXIF verification system takes this further. Trust is the foundation of accountability. If a user can just upload an old selfie and claim they are clean, the entire social system collapses. By extracting image timestamps and comparing them to the challenge time, BreakFree builds genuine trust between accountability partners. When a friend sees "✅ Verified — photo taken 2 minutes ago," they know it is real. That trust transforms the app from a solo tracking tool into a genuine recovery community.

The gamification layer is deliberately designed as a healthy dopamine delivery system. When your brain is starving for dopamine because you quit nicotine, every check-in that earns XP, every badge that unlocks, every streak milestone that triggers a golden particle explosion — those are real, measured dopamine events. They are small, but they are precisely what an anhedonic brain needs: proof that reward still exists without the substance. The level names — Spark, Rewiring, Reclaimed, Sovereign — tell a story of neurological recovery, because that is literally what is happening.

The financial module makes the invisible brutally visible. Most smokers in India spend ₹200-400 per day without thinking about it. That is ₹6,000-12,000 per month. That is a vacation. That is a new phone every three months. That is your child's school fees. When the app shows "You have saved ₹8,400 this month — that is a weekend trip to Goa," it is not just math. It is a mirror held up to a blind spot. And because the savings counter ticks up in real-time, it creates a new reward loop: watching your money grow becomes its own dopamine source.

What makes BreakFree truly different is that it was built with the assumption that the user will relapse. Most apps treat relapse as failure — the streak resets, the data disappears, the app silently judges. BreakFree treats relapse as part of the journey. Research shows that the average smoker quits 7-12 times before succeeding permanently. Each attempt teaches them something about their triggers, their vulnerabilities, their strengths. The relapse recovery flow — "It's okay. You're human. What triggered this? Here is what to do next. Your streak starts now." — is designed to catch users at their most vulnerable moment and lift them back up instead of letting them spiral into shame.

BreakFree is not an app that tracks whether you smoked today. It is a platform that understands why you smoked, what your brain is doing about it, how much it is costing you, who is in your corner, and what your body is healing. It meets you where you are — on Day 1 or Day 365 — with science-backed insight, genuine empathy, and a community that proves: you are not doing this alone.

That is what makes this different.

<!-- END -->
