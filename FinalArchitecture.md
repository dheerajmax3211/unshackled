# UNSHACKLED — Architecture Document

### _A gamified, socially accountable, emotionally intelligent web platform for quitting bad habits_

> **Product Name Rationale:** "Unshackled" captures the emotional truth of addiction recovery — the moment you realize you are no longer controlled by something. It is visceral, aspirational, and universal. It avoids clinical detachment and shame. It says: you were bound. Now you are free.

---

## TABLE OF CONTENTS

1. [Product Philosophy & UX Principles](#section-1)
2. [System Architecture Overview](#section-2)
3. [Database Schema](#section-3)
4. [Spring Boot Backend — Step-by-Step Build Plan](#section-4)
5. [Next.js Frontend — Step-by-Step Build Plan](#section-5)
6. [Notification Architecture](#section-6)
7. [Image Verification Pipeline](#section-7)
8. [Gamification Engine](#section-8)
9. [Analytics Engine](#section-9)
10. [Payments Architecture](#section-10)
11. [Security & Privacy](#section-11)
12. [Deployment](#section-12)
13. [Master Build Order](#section-13)
14. [What Makes This Different](#section-14)

---

<a name="section-1"></a>

## SECTION 1: Product Philosophy & UX Principles

### 1.1 The Emotional Core

Unshackled is built on a single, non-negotiable premise: **shame kills recovery**. Every product decision flows from this. Traditional quit-smoking apps look like medical forms. They track failure with red Xs. They remind you of the thing you're trying to escape. Unshackled does the opposite — it makes sobriety feel like an adventure, a social sport, and a financial unlock.

The product is grounded in four pillars of behavioral science:

**Pillar 1: The Dopamine Gap**
Addictive behaviors hijack the brain's mesolimbic dopamine pathway. When a person quits, they don't just lose the substance — they lose their primary source of reward signal. Days 3–7 are neurologically catastrophic for nicotine users: dopamine is at its lowest, cravings are sharpest, and relapse risk is highest. For alcohol, the trough is Days 2–4. For pornography and social media, the dopamine drought lasts 2–6 weeks before natural reward circuitry begins to recover. Unshackled acknowledges this openly — it surfaces empathy messages on these exact days, preemptively, because the science says they're coming.

**Pillar 2: Gamification Doubles Abstinence**
A 2024 meta-analysis (RR 2.12) found that gamified cessation interventions approximately double sustained abstinence rates compared to standard care. The mechanisms are clear: XP and streaks provide micro-rewards that partially substitute for the substance's dopamine hit. Leaderboards activate competitive drives. Badges create identity markers ("I'm someone who hit 30 days"). Level systems give structure to what otherwise feels like an infinite slog. Every gamification element in Unshackled was chosen because it has documented behavioral support — not because it looks cool.

**Pillar 3: Social Accountability Is the #1 Predictor**
The single strongest predictor of sustained sobriety across nearly every substance is social accountability. AA exists because of this. Unshackled digitizes and gamifies that accountability layer, making it feel less like surveillance and more like a team sport. The challenge system — where friends can request real-time photo proof — is not punitive. It is a consent-based, opt-in trust ritual. The social pressure to not disappoint someone who cares about you is, neurologically, a more durable motivator than willpower alone.

**Pillar 4: Recovery Has a Timeline — and Users Deserve to Know It**
Dopamine receptors take 3–14 months to normalize, depending on substance and duration of use. Lung cilia begin regenerating at 72 hours. Blood pressure normalizes within 20 minutes of the last cigarette. Most users have no idea that their bodies are actively healing in a quantifiable, specific way. The Health Recovery Timeline feature exists because knowing "Day 14: My lung cilia are back" transforms abstract suffering into concrete progress.

### 1.2 Design Philosophy

**No Shame, Ever.** Not a single word of copy in this application uses shame language. No red Xs. No "You failed." Slipping is called "slipping" — not failing. The app responds to a slip with warmth, science (the neuroscience of relapse normality), and a forward-looking prompt. This is non-negotiable and enforced at the copy layer.

**Emotion Through Motion.** Every major life moment in the app — completing onboarding, hitting Day 7, receiving a challenge, coming back after a relapse — is marked with a full-screen Three.js animation. These are not decorative. They are dopamine-calibrated rewards. The brain cannot distinguish between the pride of a streak milestone and the pride of other achievements — the neural signature is identical. We exploit this deliberately.

**Context-Aware Money Math.** Abstract numbers don't motivate behavior change. "₹3,200 saved" is abstract. "₹3,200 saved — that's a road trip to Coorg" is concrete and emotionally loaded. The money suggestion engine uses country-aware purchasing power parity to translate savings into culturally resonant aspirations.

**Withdrawal Empathy as a Feature.** The withdrawal message system is the most underrated feature in the product. On Day 3 of nicotine abstinence, the user's dopamine is at its lowest point since they started smoking. They feel irritable, unfocused, and convinced that quitting was a mistake. An app that sends them an achievement badge on that day is tone-deaf. An app that says "Day 3. This is the hardest day for most people. Your brain is fighting hard right now. That feeling of doom is a withdrawal symptom — it is not the truth." is a companion. That is what Unshackled is.

### 1.3 Color Language

| Context            | Color             | Hex (approximate) |
| ------------------ | ----------------- | ----------------- |
| Streaks / Momentum | Warm Amber / Gold | `#F59E0B`         |
| Money Savings      | Cool Blue         | `#3B82F6`         |
| Health Recovery    | Soft Green        | `#10B981`         |
| Empathy / Relapse  | Gentle Rose       | `#F43F5E` (soft)  |
| Background         | Dark Slate        | `#0F172A`         |
| Surface            | Dark Charcoal     | `#1E293B`         |
| Text Primary       | Near White        | `#F8FAFC`         |

### 1.4 Copy Voice Rules (Enforced Globally)

1. Write as if you are a compassionate friend who happens to have a PhD in neuroscience
2. Never use the words: fail, failure, weak, disappointed, broken, lost
3. Always follow a slip acknowledgment with a science-backed reframe and a forward action
4. Milestones are celebrated as if they are genuinely heroic — because they are
5. Use "you" not "users" — always personal, never clinical
6. Loading states get micro-copy: "Counting your clean hours…", "Asking the universe to confirm your streak…", "Doing the math on your freedom…"
7. Empty states get warmth: "Your journal is waiting for your first entry. No pressure. Just you and the page."

---

<a name="section-2"></a>

## SECTION 2: System Architecture Overview

### 2.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER / DEVICE                      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Next.js (Vercel)                          │  │
│  │   App Router │ TypeScript │ Tailwind │ Three.js │ Zustand    │  │
│  │   Service Worker (Web Push) │ Supabase Realtime Client       │  │
│  └────────────┬─────────────────────────┬────────────────────── ┘  │
│               │ REST API Calls          │ Realtime WS               │
└───────────────┼─────────────────────────┼──────────────────────────┘
                │                         │
                ▼                         ▼
┌──────────────────────────┐    ┌──────────────────────────────────┐
│   Spring Boot Backend    │    │         Supabase                 │
│   (Railway / Fly.io)     │    │                                  │
│                          │    │  ┌─────────────────────────────┐ │
│  Auth Middleware (JWT)   │◄───┼─►│  PostgreSQL (all tables)    │ │
│  REST Controllers        │    │  │  Supabase Auth (JWT issuer) │ │
│  Service Layer           │    │  │  Supabase Storage (images)  │ │
│  Repository Layer (JDBC) │◄───┼─►│  Supabase Realtime          │ │
│  EXIF Extraction         │    │  └─────────────────────────────┘ │
│  Stripe Webhook Handler  │    └──────────────────────────────────┘
│  Push Notification Svc   │
│  Email Service           │    ┌──────────────────────────────────┐
│  Scheduled Jobs          │    │           Stripe                 │
│                          │◄───┤  Checkout │ Portal │ Webhooks    │
└──────────────────────────┘    └──────────────────────────────────┘
                │
                ▼
┌──────────────────────────┐    ┌──────────────────────────────────┐
│  Resend (Email)          │    │  Web Push (VAPID)                │
│  Transactional emails    │    │  Push to subscribed browsers     │
└──────────────────────────┘    └──────────────────────────────────┘
```

### 2.2 Data Flow: Onboarding

```
User Browser                Next.js                Spring Boot            Supabase
    │                          │                        │                      │
    │──── Submit signup ───────►│                        │                      │
    │                          │──── Supabase signUp ──────────────────────────►│
    │                          │◄─── JWT + user_id ────────────────────────────│
    │                          │                        │                      │
    │◄─── Redirect to /onboard─│                        │                      │
    │                          │                        │                      │
    │──── Submit habit picks ──►│                        │                      │
    │                          │──── POST /api/onboarding/habits ─────────────►│
    │                          │      (JWT in header)   │                      │
    │                          │                        │──── INSERT user_habits►│
    │                          │                        │◄─── OK ───────────────│
    │                          │◄─── 201 Created ───────│                      │
    │                          │                        │                      │
    │──── Submit habit details ►│                        │                      │
    │   (per-habit config)     │──── POST /api/onboarding/config ─────────────►│
    │                          │                        │──── INSERT habit_configs►
    │                          │                        │◄─── OK ───────────────│
    │                          │◄─── 201 Created ───────│                      │
    │                          │                        │                      │
    │──── Set quit date ───────►│                        │                      │
    │                          │──── POST /api/onboarding/quit-date ───────────►│
    │                          │                        │──── UPDATE user_habits►│
    │                          │◄─── 201 Created ───────│                      │
    │                          │                        │                      │
    │◄─── Three.js celebration─│                        │                      │
         animation plays       │                        │                      │
```

### 2.3 Data Flow: Daily Check-In

```
User Browser            Next.js              Spring Boot            Supabase
    │                      │                      │                      │
    │── Tap "I'm clean" ───►│                      │                      │
    │                      │── POST /api/checkins ─►│                      │
    │                      │   {habit_id, date}    │── INSERT check_ins ──►│
    │                      │                       │── UPDATE streaks ─────►│
    │                      │                       │── INSERT xp_events ───►│
    │                      │                       │── Check milestones ───►│
    │                      │                       │   (if hit, INSERT      │
    │                      │                       │    notifications) ────►│
    │                      │◄── 200 {streak, xp} ──│                       │
    │◄── Animate streak ───│                        │                      │
```

### 2.4 Data Flow: Friend Challenge with Image Verification

```
Challenger Browser    Next.js      Spring Boot       Supabase Storage    Challenged Browser
      │                  │               │                   │                   │
      │─ Send Challenge ─►│               │                   │                   │
      │                  │─ POST /api/   │                   │                   │
      │                  │  challenges ─►│                   │                   │
      │                  │               │─ INSERT challenge ─►│                  │
      │                  │               │─ Send push notif ─────────────────────►│
      │                  │◄─ 201 ────────│                   │                   │
      │                  │               │                   │                   │
      │                  │               │                   │                   │
      │                  │               │          ◄─ Take real-time photo ──────│
      │                  │               │          ◄─ POST /api/challenges/{id}  │
      │                  │               │                /respond ───────────────│
      │                  │               │─ Get signed upload URL ─►│             │
      │                  │               │◄─ Signed URL ────────────│             │
      │                  │               │── Return signed URL ───────────────────►│
      │                  │               │                   │                   │
      │                  │               │          ◄─ PUT image to Supabase ─────│
      │                  │               │                   │◄── Image stored ───│
      │                  │               │                   │                   │
      │                  │               │── Download image for EXIF extraction ──│
      │                  │               │── Extract EXIF timestamp ──────────────│
      │                  │               │── Validate: within 10 min of challenge?│
      │                  │               │── INSERT challenge_media ──────────────►│
      │                  │               │── UPDATE challenge status ─────────────►│
      │                  │               │── Push notif to challenger ─────────────►│
      │                  │               │                   │                   │
      │◄─ Notified: review ─────────────│                   │                   │
      │─ Approve / Reject ►│             │                   │                   │
      │                  │─ POST /api/  │                   │                   │
      │                  │  challenges/ │                   │                   │
      │                  │  {id}/review ►│                   │                   │
      │                  │               │─ UPDATE streak if rejected ────────────►│
      │                  │               │─ Send empathy notif if rejected ────────►│
```

### 2.5 Hosting Recommendation

**Spring Boot Backend: Railway**

- Rationale: Railway offers Git-push deploys, automatic Docker builds, persistent env variables, private networking with Supabase, and a free tier sufficient for MVP. It is dramatically simpler than AWS for a solo vibe-coder. Render is a close second but Railway's DX is superior. Fly.io is excellent if global edge latency matters (not critical at MVP stage).
- Deploy via Dockerfile checked into the repo root.

---

<a name="section-3"></a>

## SECTION 3: Database Schema (Supabase / PostgreSQL)

> All tables use `UUID` primary keys (default: `gen_random_uuid()`). All tables include `created_at TIMESTAMPTZ DEFAULT NOW()` and `updated_at TIMESTAMPTZ DEFAULT NOW()` unless noted. RLS is enabled on every table.

---

### 3.1 `users`

```sql
CREATE TABLE users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username              TEXT UNIQUE NOT NULL,
  display_name          TEXT NOT NULL,
  avatar_url            TEXT,
  bio                   TEXT,
  country               TEXT DEFAULT 'IN',
  currency              TEXT DEFAULT 'INR',
  is_supporter          BOOLEAN DEFAULT FALSE,
  onboarding_completed  BOOLEAN DEFAULT FALSE,
  quit_date             DATE,
  push_subscription     JSONB,
  notification_prefs    JSONB DEFAULT '{"daily_reminder":true,"milestones":true,"friend_milestones":true,"challenges":true,"relapse_support":true,"weekly_report":true,"withdrawal_warnings":true}',
  daily_reminder_time   TIME DEFAULT '09:00:00',
  premium_status        TEXT DEFAULT 'free' CHECK (premium_status IN ('free','premium','cancelled')),
  stripe_customer_id    TEXT,
  leaderboard_opt_in    BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Friends can read profiles" ON users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM friends
    WHERE status = 'accepted'
    AND ((requester_id = auth.uid() AND addressee_id = users.id)
         OR (addressee_id = auth.uid() AND requester_id = users.id))
  )
);
```

---

### 3.2 `habits`

> Seed table — predefined habit types. Not user-created. Managed by admin.

```sql
CREATE TABLE habits (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,  -- 'smoking', 'drinking', 'vaping', etc.
  display_name TEXT NOT NULL,
  icon         TEXT NOT NULL,         -- emoji or icon name
  description  TEXT,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read habits" ON habits FOR SELECT USING (TRUE);
```

**Seed Data:**

```sql
INSERT INTO habits (slug, display_name, icon, sort_order) VALUES
  ('smoking',        'Smoking',             '🚬', 1),
  ('drinking',       'Drinking',            '🍺', 2),
  ('vaping',         'Vaping',              '💨', 3),
  ('chewing_tobacco','Chewing Tobacco',     '🌿', 4),
  ('pornography',    'Pornography',         '🔞', 5),
  ('social_media',   'Social Media',        '📱', 6),
  ('sugar_junk_food','Sugar & Junk Food',   '🍩', 7),
  ('gambling',       'Gambling',            '🎰', 8),
  ('custom',         'Custom Habit',        '✏️', 9);
```

---

### 3.3 `user_habits`

> One record per user per habit they are trying to quit.

```sql
CREATE TABLE user_habits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  habit_id        UUID NOT NULL REFERENCES habits(id),
  quit_date       DATE NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,

  -- Smoking-specific
  cigarettes_per_day    INTEGER,
  cost_per_cigarette    NUMERIC(10,2),

  -- Drinking-specific
  drinks_per_week       INTEGER,
  cost_per_session      NUMERIC(10,2),

  -- Vaping-specific
  pods_per_week         INTEGER,
  pod_cost              NUMERIC(10,2),

  -- Time-based habits (porn, social media)
  hours_per_day         NUMERIC(4,2),
  platforms             TEXT[],           -- for social media

  -- Money-based habits (sugar, gambling)
  spend_per_week        NUMERIC(10,2),

  -- Custom habit
  custom_description    TEXT,
  custom_time_per_day   NUMERIC(4,2),
  custom_spend_per_day  NUMERIC(10,2),

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, habit_id)
);

CREATE INDEX idx_user_habits_user_id ON user_habits(user_id);
CREATE INDEX idx_user_habits_habit_id ON user_habits(habit_id);

ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own habits" ON user_habits
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Friends can read user habits" ON user_habits FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM friends
    WHERE status = 'accepted'
    AND ((requester_id = auth.uid() AND addressee_id = user_habits.user_id)
         OR (addressee_id = auth.uid() AND requester_id = user_habits.user_id))
  )
);
```

---

### 3.4 `streaks`

> One record per user_habit. Updated on each check-in.

```sql
CREATE TABLE streaks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_habit_id     UUID NOT NULL REFERENCES user_habits(id) ON DELETE CASCADE UNIQUE,
  current_streak    INTEGER DEFAULT 0,
  longest_streak    INTEGER DEFAULT 0,
  last_checkin_date DATE,
  total_clean_days  INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_streaks_user_habit_id ON streaks(user_habit_id);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own streaks" ON streaks FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM user_habits uh WHERE uh.id = streaks.user_habit_id AND uh.user_id = auth.uid())
  );
CREATE POLICY "Friends can read streaks" ON streaks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_habits uh
    JOIN friends f ON f.status = 'accepted'
    WHERE uh.id = streaks.user_habit_id
    AND (
      (f.requester_id = auth.uid() AND f.addressee_id = uh.user_id)
      OR (f.addressee_id = auth.uid() AND f.requester_id = uh.user_id)
    )
  )
);
```

---

### 3.5 `check_ins`

> One record per day per user_habit. Source of truth for streak computation.

```sql
CREATE TABLE check_ins (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_habit_id   UUID NOT NULL REFERENCES user_habits(id) ON DELETE CASCADE,
  checkin_date    DATE NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('clean', 'slipped')),
  note            TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_habit_id, checkin_date)
);

CREATE INDEX idx_checkins_user_habit_id ON check_ins(user_habit_id);
CREATE INDEX idx_checkins_date ON check_ins(checkin_date);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own checkins" ON check_ins
  USING (
    EXISTS (SELECT 1 FROM user_habits uh WHERE uh.id = check_ins.user_habit_id AND uh.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_habits uh WHERE uh.id = check_ins.user_habit_id AND uh.user_id = auth.uid())
  );
```

---

### 3.6 `challenges`

```sql
CREATE TABLE challenges (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id     UUID NOT NULL REFERENCES users(id),
  challenged_id     UUID NOT NULL REFERENCES users(id),
  user_habit_id     UUID REFERENCES user_habits(id),
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','responded','approved','rejected','expired','verification_failed')),
  message           TEXT,
  response_deadline TIMESTAMPTZ NOT NULL,
  responded_at      TIMESTAMPTZ,
  reviewed_at       TIMESTAMPTZ,
  reviewer_note     TEXT,
  exif_verified     BOOLEAN,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenges_challenged_id ON challenges(challenged_id);
CREATE INDEX idx_challenges_challenger_id ON challenges(challenger_id);
CREATE INDEX idx_challenges_status ON challenges(status);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties can read own challenges" ON challenges FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);
CREATE POLICY "Challenger can insert" ON challenges FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Parties can update own challenges" ON challenges FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);
```

---

### 3.7 `challenge_media`

```sql
CREATE TABLE challenge_media (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id    UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  storage_path    TEXT NOT NULL,
  public_url      TEXT,
  exif_timestamp  TIMESTAMPTZ,
  exif_gps_lat    NUMERIC(10,7),
  exif_gps_lng    NUMERIC(10,7),
  exif_raw        JSONB,
  is_verified     BOOLEAN,
  verification_reason TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenge_media_challenge_id ON challenge_media(challenge_id);

ALTER TABLE challenge_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenge parties can read media" ON challenge_media FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM challenges c
    WHERE c.id = challenge_media.challenge_id
    AND (c.challenger_id = auth.uid() OR c.challenged_id = auth.uid())
  )
);
CREATE POLICY "Backend can insert media" ON challenge_media FOR INSERT
  WITH CHECK (TRUE);  -- enforced at API layer, not RLS
```

---

### 3.8 `friends`

```sql
CREATE TABLE friends (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','accepted','declined','blocked')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

CREATE INDEX idx_friends_requester ON friends(requester_id);
CREATE INDEX idx_friends_addressee ON friends(addressee_id);
CREATE INDEX idx_friends_status ON friends(status);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own friend records" ON friends FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can insert friend requests" ON friends FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Addressee can update status" ON friends FOR UPDATE
  USING (auth.uid() = addressee_id OR auth.uid() = requester_id);
```

---

### 3.9 `notifications`

```sql
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,
  -- Types: 'daily_reminder','milestone','friend_milestone','challenge_received',
  --        'challenge_reviewed','relapse_support','weekly_report','withdrawal_warning',
  --        'friend_request','xp_earned','badge_earned'
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  data            JSONB,
  is_read         BOOLEAN DEFAULT FALSE,
  push_sent       BOOLEAN DEFAULT FALSE,
  email_sent      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON notifications
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

### 3.10 `journal_entries`

```sql
CREATE TABLE journal_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date      DATE NOT NULL,
  content         TEXT,
  mood_score      INTEGER CHECK (mood_score BETWEEN 1 AND 10),
  mood_emoji      TEXT,
  triggers        TEXT[],
  what_helped     TEXT,
  is_shared       BOOLEAN DEFAULT FALSE,
  shared_with     UUID[],           -- array of user_ids who can see this entry
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, entry_date)
);

CREATE INDEX idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entry_date ON journal_entries(entry_date);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own journal" ON journal_entries
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Shared entries visible to shared_with" ON journal_entries FOR SELECT USING (
  is_shared = TRUE AND auth.uid() = ANY(shared_with)
);
```

---

### 3.11 `badges`

> Seed table — predefined badges.

```sql
CREATE TABLE badges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  icon_url        TEXT,
  rarity          TEXT DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  xp_reward       INTEGER DEFAULT 50,
  trigger_type    TEXT NOT NULL,
  -- 'streak_days','money_saved','challenges_completed','checkins','relapse_recovery','manual'
  trigger_value   NUMERIC,
  habit_slug      TEXT,  -- NULL means applies to all habits
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read badges" ON badges FOR SELECT USING (TRUE);
```

**Sample Badge Seeds:**

```sql
INSERT INTO badges (slug, name, description, rarity, xp_reward, trigger_type, trigger_value) VALUES
  ('first_day',         'Day One',              'You started. That''s everything.',               'common',    25,  'streak_days', 1),
  ('first_week',        'First Week Warrior',   '7 days. Your brain is already changing.',        'common',    100, 'streak_days', 7),
  ('two_weeks',         'Two Week Titan',        '14 days. Your cilia are regenerating.',          'rare',      200, 'streak_days', 14),
  ('thirty_days',       '30-Day Legend',         'One month. Dopamine is rebuilding.',             'epic',      500, 'streak_days', 30),
  ('sixty_days',        '60-Day Champion',       'Two months. The habit is losing its grip.',      'epic',      750, 'streak_days', 60),
  ('ninety_days',       'Ninety Day Sovereign',  'Three months. You have reclaimed yourself.',     'legendary', 1000,'streak_days', 90),
  ('one_year',          'Year One Legend',       'One year. You are a different person now.',      'legendary', 5000,'streak_days', 365),
  ('money_saver_1k',    'Saver',                 'Saved your first ₹1,000.',                      'common',    50,  'money_saved', 1000),
  ('money_saver_10k',   'Smart Money',           'Saved ₹10,000. That''s a real number.',         'rare',      200, 'money_saved', 10000),
  ('accountability_champ','Accountability Champ','Completed 10 photo challenges.',                 'rare',      300, 'challenges_completed', 10),
  ('rising_again',      'Rising Again',          'Came back after a slip and held for 7 days.',   'epic',      400, 'relapse_recovery', 7),
  ('dopamine_rebuilt',  'Dopamine Rebuilt',      'Hit Day 90. Your receptors are nearly baseline.','legendary',1000,'streak_days', 90);
```

---

### 3.12 `user_badges`

```sql
CREATE TABLE user_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id    UUID NOT NULL REFERENCES badges(id),
  earned_at   TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own badges" ON user_badges FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Friends can read badges" ON user_badges FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM friends f WHERE f.status = 'accepted'
    AND ((f.requester_id = auth.uid() AND f.addressee_id = user_badges.user_id)
         OR (f.addressee_id = auth.uid() AND f.requester_id = user_badges.user_id))
  )
);
```

---

### 3.13 `xp_events`

```sql
CREATE TABLE xp_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,
  -- 'daily_checkin','streak_milestone','challenge_completed','challenge_sent',
  -- 'badge_earned','journal_entry','mood_logged','friend_added','helped_friend'
  xp_amount       INTEGER NOT NULL,
  reference_id    UUID,   -- optional: checkin id, challenge id, etc.
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_xp_events_user_id ON xp_events(user_id);
CREATE INDEX idx_xp_events_created ON xp_events(created_at);

ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own XP" ON xp_events FOR SELECT
  USING (auth.uid() = user_id);
```

---

### 3.14 `subscriptions`

```sql
CREATE TABLE subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  stripe_customer_id      TEXT,
  plan                    TEXT DEFAULT 'free' CHECK (plan IN ('free','premium')),
  status                  TEXT,
  -- 'active','past_due','canceled','unpaid','trialing'
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own subscription" ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

---

### 3.15 `health_milestones`

> Seed table — medical/scientific recovery timeline data per habit.

```sql
CREATE TABLE health_milestones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id        UUID NOT NULL REFERENCES habits(id),
  day_offset      INTEGER NOT NULL,  -- days since quit date
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  icon            TEXT,
  source_note     TEXT,              -- brief research attribution
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_milestones_habit ON health_milestones(habit_id);
CREATE INDEX idx_health_milestones_day ON health_milestones(day_offset);

ALTER TABLE health_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read health milestones" ON health_milestones FOR SELECT USING (TRUE);
```

**Sample Seeds (Smoking):**

```sql
-- habit_id = UUID of 'smoking' habit
INSERT INTO health_milestones (habit_id, day_offset, title, description) VALUES
  ('<smoking-uuid>', 0,   'The decision',          'Your body begins the moment you stop. Blood CO levels start dropping within hours.'),
  ('<smoking-uuid>', 1,   'Oxygen flooding in',    'Your blood oxygen is back to normal. Your heart rate and blood pressure are settling.'),
  ('<smoking-uuid>', 3,   'The hardest day',       'Nicotine is fully out of your body. Your brain is screaming. This is withdrawal, not weakness.'),
  ('<smoking-uuid>', 14,  'Lungs waking up',       'Cilia in your lungs are regenerating. You may cough more — that is healing, not harm.'),
  ('<smoking-uuid>', 30,  'Circulation restored',  'Blood circulation has measurably improved. Physical activity is getting easier.'),
  ('<smoking-uuid>', 90,  'Dopamine baseline',     'Your dopamine receptors are nearly back to pre-smoking baseline. The grip is loosening.'),
  ('<smoking-uuid>', 365, 'Heart attack risk half','Your risk of coronary heart disease is now half that of a smoker. You did this.');
```

---

### 3.16 `withdrawal_messages`

> Day-specific, habit-specific empathy messages.

```sql
CREATE TABLE withdrawal_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id        UUID REFERENCES habits(id),  -- NULL = applies to all habits
  day_offset      INTEGER NOT NULL,
  message         TEXT NOT NULL,
  tone            TEXT DEFAULT 'empathetic',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_withdrawal_habit ON withdrawal_messages(habit_id);
CREATE INDEX idx_withdrawal_day ON withdrawal_messages(day_offset);

ALTER TABLE withdrawal_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read withdrawal messages" ON withdrawal_messages FOR SELECT USING (TRUE);
```

---

### 3.17 `dopamine_suggestions`

```sql
CREATE TABLE dopamine_suggestions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion      TEXT NOT NULL,
  category        TEXT NOT NULL, -- 'physical','social','creative','mindfulness'
  habit_slugs     TEXT[],        -- which habits this is relevant to; NULL = all
  difficulty      TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy','medium','hard')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dopamine_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read suggestions" ON dopamine_suggestions FOR SELECT USING (TRUE);
```

---

### 3.18 `money_suggestions`

```sql
CREATE TABLE money_suggestions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code    TEXT NOT NULL DEFAULT 'IN',
  amount_min      NUMERIC(12,2) NOT NULL,
  amount_max      NUMERIC(12,2) NOT NULL,
  suggestion      TEXT NOT NULL,  -- "That's a road trip to Coorg"
  category        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_money_suggestions_country ON money_suggestions(country_code);
CREATE INDEX idx_money_suggestions_amount ON money_suggestions(amount_min, amount_max);

ALTER TABLE money_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read money suggestions" ON money_suggestions FOR SELECT USING (TRUE);
```

---

### 3.19 `push_subscriptions`

```sql
CREATE TABLE push_subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint        TEXT NOT NULL,
  p256dh_key      TEXT NOT NULL,
  auth_key        TEXT NOT NULL,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, endpoint)
);

CREATE INDEX idx_push_subs_user_id ON push_subscriptions(user_id);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own push subs" ON push_subscriptions
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

<a name="section-4"></a>

## SECTION 4: Spring Boot Backend — Step-by-Step Build Plan

> **Tech:** Java 21, Spring Boot 3.x, Maven, JDBC (via Spring Data JDBC or JdbcTemplate), Supabase PostgreSQL

---

### STEP B-1: Project Initialization

**Purpose:** Create the Spring Boot project with all required dependencies and establish the base folder structure.

- [x] **Task B-1.1** Go to https://start.spring.io and generate a Maven project with: Java 21, Spring Boot 3.3.x, dependencies: Spring Web, Spring Security, Spring Data JDBC, PostgreSQL Driver, Spring Scheduler, Spring Validation, Lombok. Download and unzip.
- [x] **Task B-1.2** Add these additional dependencies to `pom.xml`: `metadata-extractor` (Drew Noakes, version 2.19.0) for EXIF, `java-jwt` (Auth0, version 4.x) for Supabase JWT verification, `stripe-java` (version 25.x), `web-push` (nl.martijndwars, version 5.1.2 + BouncyCastle), `OkHttp` (for Resend HTTP API), `jackson-databind` (already included via Spring Web).
- [x] **Task B-1.3** Create the base package structure under `src/main/java/com/unshackled/api/`: `config/`, `controller/`, `service/`, `repository/`, `model/`, `dto/`, `exception/`, `security/`, `scheduler/`, `util/`.
- [x] **Task B-1.4** Create `src/main/resources/application.yml` with placeholder sections for: `server.port`, `supabase.*`, `stripe.*`, `webpush.*`, `resend.*`, `app.*`.
- [x] **Task B-1.5** Create `src/main/resources/application-dev.yml` and `application-prod.yml` for environment separation. Leave values as `${ENV_VAR_NAME}` placeholders.
- [x] **Task B-1.6** Create `.env.example` at project root listing every required environment variable with comments.

---

### STEP B-2: Database Configuration

**Purpose:** Connect Spring Boot to Supabase PostgreSQL via JDBC with connection pooling.

- [x] **Task B-2.1** Add `HikariCP` datasource config to `application.yml`: pool size 5–10, connection timeout 30s, idle timeout 600s. Supabase connection string uses port 5432 (direct) or 6543 (pooler — prefer pooler for serverless-like deploys).
- [x] **Task B-2.2** Create `DatabaseConfig.java` in `config/` — annotated with `@Configuration`, defines a `DataSource` bean using `HikariDataSource` populated from `application.yml`.
- [x] **Task B-2.3** Create `JdbcConfig.java` in `config/` — defines a `JdbcTemplate` bean using the `DataSource` bean. This is the primary DB access method throughout the backend.
- [x] **Task B-2.4** Write a `DatabaseHealthCheck.java` in `util/` — a simple method that runs `SELECT 1` using JdbcTemplate and logs success/failure on startup. Call it from `ApplicationReadyEvent`.

---

### STEP B-3: Security Configuration

**Purpose:** Verify Supabase-issued JWTs on every protected endpoint.

- [x] **Task B-3.1** Create `SupabaseJwtProperties.java` in `config/` — a `@ConfigurationProperties(prefix = "supabase")` class with fields: `jwtSecret` (the Supabase JWT secret from project settings), `projectUrl`.
- [x] **Task B-3.2** Create `JwtAuthFilter.java` in `security/` — extends `OncePerRequestFilter`. In `doFilterInternal`: extract `Authorization: Bearer <token>` header, decode and verify the JWT using `java-jwt` with the Supabase JWT secret (HS256 algorithm), extract `sub` claim as `userId`, set a `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`. If token is missing or invalid, return 401.
- [x] **Task B-3.3** Create `SecurityConfig.java` in `config/` — annotated `@Configuration @EnableWebSecurity`. Configure `SecurityFilterChain`: permit `/api/health`, `/api/webhooks/stripe`, `/api/auth/**` without auth; require authentication for all other `/api/**` routes; add `JwtAuthFilter` before `UsernamePasswordAuthenticationFilter`; disable CSRF (REST API); configure CORS to allow the Vercel frontend domain.
- [x] **Task B-3.4** Create `AuthenticatedUser.java` in `security/` — a utility class with a static method `getCurrentUserId()` that extracts the `userId` string from `SecurityContextHolder`. Returns `Optional<String>`.
- [x] **Task B-3.5** Create `CorsConfig.java` in `config/` — defines allowed origins (read from env: `FRONTEND_URL`), allowed methods (GET, POST, PUT, PATCH, DELETE, OPTIONS), allowed headers (Authorization, Content-Type), max age 3600.

---

### STEP B-4: Global Exception Handling

**Purpose:** Standardize error responses across all controllers.

- [x] **Task B-4.1** Create `ApiError.java` in `dto/` — a record with fields: `status` (int), `error` (String), `message` (String), `timestamp` (Instant).
- [x] **Task B-4.2** Create `GlobalExceptionHandler.java` in `exception/` — annotated `@RestControllerAdvice`. Handle: `ResourceNotFoundException` (404), `UnauthorizedException` (401), `ValidationException` (400), `MethodArgumentNotValidException` (400 with field errors), generic `Exception` (500). Each returns `ResponseEntity<ApiError>`.
- [x] **Task B-4.3** Create `ResourceNotFoundException.java` in `exception/` — extends `RuntimeException` with a constructor taking a `String message`.
- [x] **Task B-4.4** Create `UnauthorizedException.java` in `exception/` — extends `RuntimeException`.

---

### STEP B-5: User Domain

**Purpose:** CRUD for user profiles. Called immediately after Supabase Auth registration.

- [x] **Task B-5.1** Create `UserModel.java` in `model/` — Java record matching the `users` table columns.
- [x] **Task B-5.2** Create `CreateUserRequest.java` in `dto/` — record with fields: `username`, `displayName`, `country`, `currency`, `isSupporter`. Add Bean Validation annotations (`@NotBlank`, `@Size`).
- [x] **Task B-5.3** Create `UpdateUserRequest.java` in `dto/` — record with optional fields: `displayName`, `avatarUrl`, `bio`, `notificationPrefs`, `dailyReminderTime`, `leaderboardOptIn`.
- [x] **Task B-5.4** Create `UserResponse.java` in `dto/` — record for API responses (excludes sensitive fields like `stripeCustomerId`).
- [x] **Task B-5.5** Create `UserRepository.java` in `repository/` — class annotated `@Repository` with injected `JdbcTemplate`. Methods: `findById(UUID)`, `findByUsername(String)`, `insert(UserModel)`, `update(UUID, UpdateUserRequest)`, `deleteById(UUID)`, `existsByUsername(String)`.
- [x] **Task B-5.6** Create `UserService.java` in `service/` — annotated `@Service`. Methods: `createUser(String userId, CreateUserRequest)`, `getUserById(String userId)`, `getUserByUsername(String username)`, `updateUser(String userId, UpdateUserRequest)`, `deleteUser(String userId)`. All methods that modify data verify `userId` matches authenticated user.
- [x] **Task B-5.7** Create `UserController.java` in `controller/` — annotated `@RestController @RequestMapping("/api/users")`. Endpoints: `POST /` (create, called once post-signup), `GET /me` (get own profile), `GET /{username}` (public profile), `PUT /me` (update own profile), `DELETE /me` (GDPR delete — triggers full cascade).

---

### STEP B-6: Habit Domain

**Purpose:** Serve the predefined habit list and manage user's selected habits.

- [x] **Task B-6.1** Create `HabitModel.java` in `model/` — record matching `habits` table.
- [x] **Task B-6.2** Create `UserHabitModel.java` in `model/` — record matching `user_habits` table.
- [x] **Task B-6.3** Create `AddHabitRequest.java` in `dto/` — record with: `habitId` (UUID), and all optional habit-config fields (cigarettesPerDay, costPerCigarette, drinksPerWeek, etc.), `quitDate` (LocalDate).
- [x] **Task B-6.4** Create `HabitRepository.java` in `repository/` — methods: `findAll()`, `findById(UUID)`, `findBySlug(String)`.
- [x] **Task B-6.5** Create `UserHabitRepository.java` in `repository/` — methods: `findByUserId(UUID)`, `findByUserIdAndHabitId(UUID, UUID)`, `insert(UserHabitModel)`, `update(UUID, ...)`, `deactivate(UUID)`, `findById(UUID)`.
- [x] **Task B-6.6** Create `HabitService.java` in `service/` — methods: `getAllHabits()`, `getUserHabits(String userId)`, `addHabit(String userId, AddHabitRequest)`, `updateHabitConfig(String userId, UUID userHabitId, AddHabitRequest)`, `deactivateHabit(String userId, UUID userHabitId)`. On `addHabit`, also creates an initial `streaks` record with current_streak=0.
- [x] **Task B-6.7** Create `HabitController.java` in `controller/` — `@RequestMapping("/api/habits")`. Endpoints: `GET /` (all habit types), `GET /mine` (user's active habits), `POST /mine` (add habit), `PUT /mine/{userHabitId}` (update config), `DELETE /mine/{userHabitId}` (deactivate).

---

### STEP B-7: Onboarding Domain

**Purpose:** Orchestrate the multi-step onboarding flow.

- [x] **Task B-7.1** Create `OnboardingRequest.java` in `dto/` — record with: `isSupporter` (Boolean), `habits` (List of `AddHabitRequest`), `quitDate` (LocalDate), `displayName`, `country`, `currency`.
- [x] **Task B-7.2** Create `OnboardingService.java` in `service/` — method `completeOnboarding(String userId, OnboardingRequest)`. This is a `@Transactional` method that: updates user profile (displayName, country, currency, isSupporter), inserts all user_habits (calls HabitService.addHabit for each), sets user.onboarding_completed = true, sets user.quit_date, awards initial XP.
- [x] **Task B-7.3** Create `OnboardingController.java` in `controller/` — `@RequestMapping("/api/onboarding")`. Endpoints: `POST /complete` (submits full onboarding payload), `GET /status` (check if user has completed onboarding — used by frontend to redirect accordingly).

---

### STEP B-8: Streak Domain

**Purpose:** Compute, store, and serve streak data. Core game mechanic.

- [x] **Task B-8.1** Create `StreakModel.java` in `model/` — record matching `streaks` table.
- [x] **Task B-8.2** Create `StreakRepository.java` in `repository/` — methods: `findByUserHabitId(UUID)`, `upsert(UUID userHabitId, int current, int longest, LocalDate lastDate, int totalClean)`, `resetStreak(UUID userHabitId)`, `findTopStreaksByUserIds(List<UUID> userIds)`.
- [x] **Task B-8.3** Create `StreakService.java` in `service/` — method `recalculateStreak(UUID userHabitId)`. Logic: query all `check_ins` for this habit ordered by date DESC, count consecutive 'clean' days from today/yesterday backwards, set current_streak. Also update longest_streak if current > longest. Method `getStreakSummary(String userId)` returns all streaks for a user's habits.
- [x] **Task B-8.4** Create `StreakController.java` in `controller/` — `@RequestMapping("/api/streaks")`. Endpoints: `GET /` (all streaks for current user), `GET /{userHabitId}` (streak for one habit).

---

### STEP B-9: Check-In Domain

**Purpose:** Handle daily clean/slipped check-ins and trigger downstream effects.

- [x] **Task B-9.1** Create `CheckInModel.java` in `model/` — record matching `check_ins` table.
- [x] **Task B-9.2** Create `CheckInRequest.java` in `dto/` — record with: `userHabitId` (UUID), `status` (String: "clean" or "slipped"), `note` (String, optional), `checkinDate` (LocalDate, defaults to today).
- [x] **Task B-9.3** Create `CheckInResponse.java` in `dto/` — record with: `checkIn`, `newStreak` (int), `xpEarned` (int), `badgesEarned` (List), `milestoneReached` (Boolean), `withdrawalMessage` (String, optional).
- [x] **Task B-9.4** Create `CheckInRepository.java` in `repository/` — methods: `insert(CheckInModel)`, `findByUserHabitIdAndDate(UUID, LocalDate)`, `findByUserHabitId(UUID, int limit)`, `existsForToday(UUID, LocalDate)`.
- [x] **Task B-9.5** Create `CheckInService.java` in `service/` — method `submitCheckIn(String userId, CheckInRequest)`. This is a transactional method that: validates user owns the userHabitId, checks no duplicate for today, inserts check_in, calls StreakService.recalculateStreak, calls XpService.awardXp, calls BadgeService.checkAndAwardBadges, calls WithdrawalService.getMessageForDay, calls NotificationService.checkMilestones. Returns CheckInResponse.
- [x] **Task B-9.6** Add method `getCheckInHistory(String userId, UUID userHabitId, int days)` to `CheckInService.java` — returns last N check-ins, used for heatmap.
- [x] **Task B-9.7** Create `CheckInController.java` in `controller/` — `@RequestMapping("/api/checkins")`. Endpoints: `POST /` (submit check-in), `GET /history/{userHabitId}` (history for heatmap), `GET /today` (check if today's check-in exists for any habit).

---

### STEP B-10: XP & Leveling Domain

**Purpose:** Track XP events and compute user levels.

- [x] **Task B-10.1** Create `XpEventModel.java` in `model/` — record matching `xp_events` table.
- [x] **Task B-10.2** Create `XpEventRepository.java` in `repository/` — methods: `insert(XpEventModel)`, `sumByUserId(UUID)` (total XP), `findByUserId(UUID, int limit)` (XP history).
- [x] **Task B-10.3** Create `LevelDefinition.java` in `util/` — a static class/enum containing the level thresholds table: Level 1 "Spark" (0 XP), Level 2 "Awakened" (150), Level 3 "Grounded" (400), Level 4 "Resolute" (800), Level 5 "Rewiring" (1500), Level 6 "Unbound" (2500), Level 7 "Reclaimer" (4000), Level 8 "Forged" (6000), Level 9 "Enduring" (9000), Level 10 "Reclaimed" (13000), Level 15 "Sovereign" (30000), Level 20 "Unshackled" (75000). Method `getLevelForXp(int xp)` returns current level.
- [x] **Task B-10.4** Create `XpService.java` in `service/` — methods: `awardXp(String userId, String eventType, int amount, UUID referenceId)` (inserts xp_event), `getTotalXp(String userId)`, `getUserLevel(String userId)`, `getXpToNextLevel(String userId)`.
- [x] **Task B-10.5** Define XP amounts as constants in `XpService.java`: DAILY_CHECKIN=25, STREAK_7_DAYS=100, STREAK_30_DAYS=500, STREAK_90_DAYS=1000, CHALLENGE_RESPONDED=50, CHALLENGE_APPROVED=75, JOURNAL_ENTRY=15, MOOD_LOGGED=10, FRIEND_ADDED=20, BADGE_EARNED=varies (from badge table).
- [x] **Task B-10.6** Create `XpController.java` in `controller/` — `@RequestMapping("/api/xp")`. Endpoints: `GET /summary` (total XP, current level, XP to next level, recent events).

---

### STEP B-11: Badge Domain

**Purpose:** Check badge trigger conditions after every meaningful action and award badges.

- [x] **Task B-11.1** Create `BadgeModel.java` in `model/` — record matching `badges` table.
- [x] **Task B-11.2** Create `UserBadgeModel.java` in `model/` — record matching `user_badges` table.
- [x] **Task B-11.3** Create `BadgeRepository.java` in `repository/` — methods: `findAll()`, `findBySlug(String)`, `findEarnedByUserId(UUID)`, `hasEarned(UUID userId, UUID badgeId)`, `award(UUID userId, UUID badgeId)`.
- [x] **Task B-11.4** Create `BadgeService.java` in `service/` — method `checkAndAwardBadges(String userId, UUID userHabitId)`. Logic: load current streak, load total money saved, load completed challenges count, check each badge's trigger_type and trigger_value against current user state, award any un-earned qualifying badges, for each awarded badge: call XpService.awardXp(badge.xpReward), insert notification, return list of newly awarded badges.
- [x] **Task B-11.5** Add method `getUserBadges(String userId)` to `BadgeService.java` — returns all badges with `earned: true/false` for frontend display.
- [x] **Task B-11.6** Create `BadgeController.java` in `controller/` — `@RequestMapping("/api/badges")`. Endpoints: `GET /` (all badges with earned status), `GET /earned` (only earned badges).

---

### STEP B-12: Friends Domain

**Purpose:** Manage friend requests and the social graph.

- [x] **Task B-12.1** Create `FriendModel.java` in `model/` — record matching `friends` table.
- [x] **Task B-12.2** Create `FriendRequest.java` in `dto/` — record with `addresseeUsername` (String).
- [x] **Task B-12.3** Create `FriendRepository.java` in `repository/` — methods: `insert(FriendModel)`, `findByUserIds(UUID, UUID)`, `updateStatus(UUID friendId, String status)`, `findFriendsByUserId(UUID)` (returns accepted friends), `findPendingRequests(UUID userId)` (incoming pending), `deleteFriend(UUID friendId)`.
- [x] **Task B-12.4** Create `FriendService.java` in `service/` — methods: `sendFriendRequest(String requesterId, String addresseeUsername)`, `respondToRequest(String userId, UUID friendId, String response)` (accept/decline), `getFriends(String userId)`, `getPendingRequests(String userId)`, `removeFriend(String userId, UUID friendId)`, `searchUsers(String query, String excludeUserId)`.
- [x] **Task B-12.5** Add check in `FriendService.sendFriendRequest`: if free tier, max 3 friends; if premium, unlimited.
- [x] **Task B-12.6** Create `FriendController.java` in `controller/` — `@RequestMapping("/api/friends")`. Endpoints: `POST /request` (send request), `PUT /{friendId}/respond` (accept/decline), `GET /` (list accepted friends with their streak data), `GET /pending` (incoming requests), `DELETE /{friendId}` (remove), `GET /search?q=` (search users).

---

### STEP B-13: Challenge Domain (Core Feature)

**Purpose:** Manage the send-challenge → respond-with-photo → EXIF-verify → approve/reject flow.

- [x] **Task B-13.1** Create `ChallengeModel.java` in `model/` — record matching `challenges` table.
- [x] **Task B-13.2** Create `ChallengeMediaModel.java` in `model/` — record matching `challenge_media` table.
- [x] **Task B-13.3** Create `SendChallengeRequest.java` in `dto/` — record with: `challengedUserId` (UUID), `userHabitId` (UUID, optional), `message` (String, optional).
- [x] **Task B-13.4** Create `ChallengeRepository.java` in `repository/` — methods: `insert(ChallengeModel)`, `findById(UUID)`, `findByChallengedId(UUID)`, `findByChallengerId(UUID)`, `updateStatus(UUID, String status, Instant reviewedAt)`, `findExpiredPending()`.
- [x] **Task B-13.5** Create `ChallengeMediaRepository.java` in `repository/` — methods: `insert(ChallengeMediaModel)`, `findByChallengeId(UUID)`.
- [x] **Task B-13.6** Create `SupabaseStorageService.java` in `service/` — methods: `generateSignedUploadUrl(String bucket, String path, int expirySeconds)` (calls Supabase Storage REST API via `RestTemplate`), `getPublicUrl(String bucket, String path)`, `deleteFile(String bucket, String path)`.
- [x] **Task B-13.7** Create `ExifExtractionService.java` in `service/` — inject `RestTemplate`. Method `extractExif(String imageUrl)`: download image bytes from Supabase signed URL, use `metadata-extractor` library to parse `Metadata`, extract `ExifSubIFDDirectory.TAG_DATETIME_ORIGINAL` as `Date`, extract GPS lat/lng from `GpsDirectory` if present. Return `ExifResult` record with `timestamp` (Instant), `gpsLat` (Double, nullable), `gpsLng` (Double, nullable), `rawTags` (Map).
- [x] **Task B-13.8** Create `ExifResult.java` in `dto/` — record with: `timestamp` (Instant, nullable), `gpsLat` (Double, nullable), `gpsLng` (Double, nullable), `hasMissingTimestamp` (boolean), `rawTags` (Map<String, String>).
- [x] **Task B-13.9** Create `ChallengeService.java` in `service/` — method `sendChallenge(String challengerId, SendChallengeRequest)`: validate friendship, insert challenge with responseDeadline = NOW + 10 minutes, call NotificationService to push challenge notification to challenged user. Return challenge with signed upload URL info.
- [x] **Task B-13.10** Add method `getSignedUploadUrlForChallenge(String userId, UUID challengeId)` to `ChallengeService.java`: verify userId == challenged_id, verify challenge is 'pending', call SupabaseStorageService.generateSignedUploadUrl for path `challenges/{challengeId}/{uuid}.jpg`, return signed URL.
- [x] **Task B-13.11** Add method `confirmUploadAndVerify(String userId, UUID challengeId, String storagePath)` to `ChallengeService.java`: verify challenge still pending and within deadline, call ExifExtractionService, check if exif.timestamp is within 10 minutes of challenge.created_at, insert ChallengeMedia with verification result, update challenge status to 'responded' or 'verification_failed', push notification to challenger. This is `@Transactional`.
- [x] **Task B-13.12** Add method `reviewChallenge(String challengerId, UUID challengeId, boolean approve, String note)` to `ChallengeService.java`: verify challenger is the reviewer, update challenge status to 'approved' or 'rejected', if rejected: call StreakService.resetStreak + NotificationService.sendEmpathyMessage, award XP to both parties, insert notifications.
- [x] **Task B-13.13** Add method `getChallengeHistory(String userId)` to `ChallengeService.java` — returns all challenges where user is challenger or challenged, with media URLs.
- [x] **Task B-13.14** Create `ChallengeController.java` in `controller/` — `@RequestMapping("/api/challenges")`. Endpoints: `POST /` (send challenge), `GET /upload-url/{challengeId}` (get signed upload URL), `POST /{challengeId}/confirm` (confirm upload), `POST /{challengeId}/review` (approve/reject), `GET /` (challenge history), `GET /{challengeId}` (single challenge detail).

---

### STEP B-14: Notification Domain

**Purpose:** Insert notifications into DB and send push/email.

- [x] **Task B-14.1** Add Maven dependency for `nl.martijndwars:web-push:5.1.1` (VAPID-based Web Push for Java). Add `bouncycastle` dependency required by web-push.
- [x] **Task B-14.2** Create `VapidProperties.java` in `config/` — `@ConfigurationProperties(prefix = "webpush")` with fields: `publicKey`, `privateKey`, `subject` (mailto:).
- [x] **Task B-14.3** Create `WebPushService.java` in `service/` — inject `VapidProperties`. Method `sendPush(String userId, String title, String body, Map<String,Object> data)`: load push_subscriptions for userId, for each subscription: build `Notification` object, call `PushService.send()`. Handle 410 Gone response by deleting the subscription from DB.
- [x] **Task B-14.4** Create `PushSubscriptionRepository.java` in `repository/` — methods: `findByUserId(UUID)`, `insert(UUID userId, String endpoint, String p256dh, String auth)`, `deleteByEndpoint(String endpoint)`.
- [x] **Task B-14.5** Create `ResendEmailService.java` in `service/` — inject `RestTemplate` and Resend API key. Method `sendEmail(String to, String subject, String htmlBody)`: POST to `https://api.resend.com/emails` with JSON payload. Handle error responses.
- [x] **Task B-14.6** Create email HTML templates as String constants (or use a template file) for: `DailyReminderEmail.java`, `WeeklyReportEmail.java`, `MilestoneEmail.java`, `RelapseRecoveryEmail.java`. Each is a static method returning HTML string with `{placeholder}` substitution.
- [x] **Task B-14.7** Create `NotificationRepository.java` in `repository/` — methods: `insert(NotificationModel)`, `findByUserId(UUID, boolean onlyUnread)`, `markRead(UUID notificationId)`, `markAllRead(UUID userId)`.
- [x] **Task B-14.8** Create `NotificationService.java` in `service/` — methods: `sendNotification(UUID userId, String type, String title, String body, Map data)` (inserts DB record + triggers WebPushService + optionally ResendEmailService based on user prefs), `checkMilestones(UUID userId, UUID userHabitId, int newStreak)` (checks if streak is a milestone day, sends milestone notification), `sendEmpathyMessage(UUID userId, UUID userHabitId)` (relapse recovery), `sendWithdrawalWarning(UUID userId, UUID userHabitId, int dayOffset)`.
- [x] **Task B-14.9** Create `PushSubscriptionController.java` in `controller/` — `@RequestMapping("/api/push")`. Endpoints: `POST /subscribe` (save subscription), `DELETE /unsubscribe` (remove subscription), `GET /vapid-public-key` (returns VAPID public key for frontend service worker setup).
- [x] **Task B-14.10** Create `NotificationController.java` in `controller/` — `@RequestMapping("/api/notifications")`. Endpoints: `GET /` (user's notifications, paginated), `PUT /{id}/read` (mark one read), `PUT /read-all` (mark all read).

---

### STEP B-15: Withdrawal & Empathy Content Domain

**Purpose:** Serve day-specific emotional support content.

- [x] **Task B-15.1** Create `WithdrawalRepository.java` in `repository/` — method `findByHabitAndDay(UUID habitId, int dayOffset)` (finds message for exact day or closest prior day), `findForAllHabitsOnDay(int dayOffset)`.
- [x] **Task B-15.2** Create `DopamineSuggestionRepository.java` in `repository/` — method `findRandomByHabitSlugs(List<String> slugs, int count)` (picks N random suggestions relevant to habit, or general ones).
- [x] **Task B-15.3** Create `MoneySuggestionRepository.java` in `repository/` — method `findByCountryAndAmount(String country, BigDecimal amount)` (finds suggestion where amount falls within min/max range).
- [x] **Task B-15.4** Create `HealthMilestoneRepository.java` in `repository/` — method `findByHabitAndDayRange(UUID habitId, int dayOffset)` (returns all milestones up to and including current day).
- [x] **Task B-15.5** Create `ContentService.java` in `service/` — methods: `getWithdrawalMessage(UUID habitId, int dayOffset)`, `getDopamineSuggestions(List<String> habitSlugs)` (3 random), `getMoneySuggestion(String country, BigDecimal savedAmount)`, `getHealthMilestones(UUID habitId, int dayOffset)` (all milestones up to current day).
- [x] **Task B-15.6** Create `ContentController.java` in `controller/` — `@RequestMapping("/api/content")`. Endpoints: `GET /withdrawal?habitId=&dayOffset=`, `GET /dopamine?habits=`, `GET /money?amount=`, `GET /health-milestones?habitId=&dayOffset=`.

---

### STEP B-16: Analytics Domain

**Purpose:** Serve habit-specific and global analytics data.

- [x] **Task B-16.1** Create `AnalyticsService.java` in `service/` — method `getMoneySaved(UUID userHabitId)` — computes based on habit type and config: for smoking: totalCleanDays × cigarettesPerDay × costPerCigarette; for drinking: totalCleanWeeks × drinksPerWeek × costPerSession; etc. Returns `MoneySavedBreakdown` with today/week/month/allTime.
- [x] **Task B-16.2** Add method `getHeatmapData(UUID userHabitId, int months)` to `AnalyticsService.java` — returns array of {date, status} for last N months of check-ins.
- [x] **Task B-16.3** Add method `getGlobalStats()` to `AnalyticsService.java` — aggregate query: total users, total habits tracked, total clean days, total money saved. Cache result for 1 hour using a `ConcurrentHashMap` with timestamp-based invalidation.
- [x] **Task B-16.4** Add method `getDashboardSummary(String userId)` to `AnalyticsService.java` — returns: all habits with current streak, today's money saved, this week's saved, this month's saved, all-time saved, current level, XP, recent badges, withdrawal message for today, dopamine suggestions.
- [x] **Task B-16.5** Create `AnalyticsController.java` in `controller/` — `@RequestMapping("/api/analytics")`. Endpoints: `GET /dashboard` (full dashboard summary), `GET /money/{userHabitId}` (money saved breakdown), `GET /heatmap/{userHabitId}` (heatmap data), `GET /global` (global stats — public, no auth required).

---

### STEP B-17: Journal Domain

**Purpose:** Private journal and mood tracking.

- [x] **Task B-17.1** Create `JournalEntryModel.java` in `model/` — record matching `journal_entries` table.
- [x] **Task B-17.2** Create `JournalEntryRequest.java` in `dto/` — record with: `entryDate`, `content`, `moodScore`, `moodEmoji`, `triggers` (List<String>), `whatHelped`, `isShared`, `sharedWith` (List<UUID>).
- [x] **Task B-17.3** Create `JournalRepository.java` in `repository/` — methods: `upsert(JournalEntryModel)`, `findByUserId(UUID, int limit)`, `findByUserIdAndDate(UUID, LocalDate)`, `findSharedWithUser(UUID viewerId)`.
- [x] **Task B-17.4** Create `JournalService.java` in `service/` — methods: `saveEntry(String userId, JournalEntryRequest)` (upserts, awards XP for journal entry and mood log), `getEntries(String userId, int limit)`, `getEntry(String userId, LocalDate date)`, `getSharedEntries(String viewerId)`.
- [x] **Task B-17.5** Create `JournalController.java` in `controller/` — `@RequestMapping("/api/journal")`. Endpoints: `POST /` (save/update entry), `GET /` (list own entries), `GET /{date}` (single entry), `GET /shared` (entries shared with me).

---

### STEP B-18: Leaderboard Domain

**Purpose:** Compute and serve friend and global leaderboards.

- [x] **Task B-18.1** Create `LeaderboardEntry.java` in `dto/` — record with: `userId`, `username`, `avatarUrl`, `totalCleanDays`, `longestStreak`, `totalXp`, `level`, `rank`.
- [x] **Task B-18.2** Create `LeaderboardService.java` in `service/` — method `getFriendLeaderboard(String userId)`: get friend list, for each friend get their streak sum and XP, sort by totalCleanDays DESC, assign rank, include self in list. Method `getGlobalLeaderboard(int limit)`: aggregate top users who have `leaderboard_opt_in = true`, cache for 15 minutes.
- [x] **Task B-18.3** Create `LeaderboardController.java` in `controller/` — `@RequestMapping("/api/leaderboard")`. Endpoints: `GET /friends` (friend leaderboard), `GET /global` (global top 100).

---

### STEP B-19: Stripe / Payments Domain

**Purpose:** Handle Stripe Checkout, portal, and webhook events.

- [x] **Task B-19.1** Add Stripe product and price setup instructions as comments in `StripeConfig.java` — one product "Sovereign Plan", one recurring monthly price. Store `priceId` in env variable.
- [x] **Task B-19.2** Create `StripeConfig.java` in `config/` — `@ConfigurationProperties(prefix = "stripe")` with: `secretKey`, `webhookSecret`, `premiumPriceId`. Creates a `Stripe` static configuration bean setting API key.
- [x] **Task B-19.3** Create `SubscriptionRepository.java` in `repository/` — methods: `findByUserId(UUID)`, `upsert(SubscriptionModel)`, `updateStatus(String stripeSubId, String status)`, `findByStripeSubscriptionId(String)`.
- [x] **Task B-19.4** Create `PaymentService.java` in `service/` — method `createCheckoutSession(String userId, String successUrl, String cancelUrl)`: get or create Stripe customer, create Stripe Checkout Session with `premiumPriceId`, metadata `{userId}`, return session URL. Method `createPortalSession(String userId, String returnUrl)`: retrieve Stripe customer, create Billing Portal session, return URL.
- [x] **Task B-19.5** Create `PaymentController.java` in `controller/` — `@RequestMapping("/api/payments")`. Endpoints: `POST /checkout` (create checkout session, returns URL), `POST /portal` (create portal session, returns URL), `GET /status` (current subscription status).
- [x] **Task B-19.6** Create `StripeWebhookController.java` in `controller/` — `@RequestMapping("/api/webhooks/stripe")`. This endpoint is NOT JWT-protected (authenticated via Stripe-Signature header). Single `POST /` endpoint. Reads raw request body as `String`, verifies webhook signature using `Webhook.constructEvent(payload, sigHeader, webhookSecret)`, routes by event type.
- [x] **Task B-19.7** Create `StripeWebhookService.java` in `service/` — methods: `handleCheckoutCompleted(Event event)` (extract userId from metadata, get subscription ID, upsert subscription, update user.premium_status = 'premium'), `handleSubscriptionUpdated(Event event)` (update subscription status, period end), `handleSubscriptionDeleted(Event event)` (set premium_status = 'free', update subscription).
- [x] **Task B-19.8** Add premium gating check in `HabitService.addHabit`: if user is free tier and already has 1 active habit, throw a `PremiumRequiredException` (HTTP 402).
- [x] **Task B-19.9** Add premium gating check in `FriendService.sendFriendRequest`: if free tier and friend count >= 3, throw `PremiumRequiredException`.

---

### STEP B-20: Scheduled Jobs

**Purpose:** Automate daily reminders, weekly reports, withdrawal warnings, streak validation, and milestone checks.

- [x] **Task B-20.1** Create `SchedulerConfig.java` in `config/` — enable `@EnableScheduling`. Set thread pool size to 5 in `application.yml` (`spring.task.scheduling.pool.size: 5`).
- [x] **Task B-20.2** Create `DailyReminderJob.java` in `scheduler/` — `@Scheduled(cron = "0 0 * * * *")` (runs every hour). Query users where `daily_reminder_time` hour matches current UTC hour and `notification_prefs.daily_reminder = true`, for each user call `NotificationService.sendNotification` with daily reminder.
- [x] **Task B-20.3** Create `WithdrawalWarningJob.java` in `scheduler/` — `@Scheduled(cron = "0 30 8 * * *")` (8:30 AM UTC daily). For each active user_habit, compute current day offset since quit_date. If dayOffset is in a known hard day set (3, 7, 14, 21 for nicotine; 2, 3, 4 for alcohol), send withdrawal warning notification.
- [x] **Task B-20.4** Create `WeeklyReportJob.java` in `scheduler/` — `@Scheduled(cron = "0 0 9 * * MON")` (Monday 9 AM UTC). For each user with `notification_prefs.weekly_report = true`, compute week's stats (clean days, money saved, streak progress), send `WeeklyReportEmail` via ResendEmailService.
- [x] **Task B-20.5** Create `ChallengeExpiryJob.java` in `scheduler/` — `@Scheduled(fixedDelay = 60000)` (every 60 seconds). Find challenges where status='pending' and response_deadline < NOW(). Update status to 'expired'. Send notification to both parties.
- [x] **Task B-20.6** Create `SupporterNudgeJob.java` in `scheduler/` — `@Scheduled(cron = "0 0 10 * * MON")` (Monday 10 AM UTC). For each supporter user, find their supported friends (accepted friend connections where friend.is_supporter = true direction), compile summary of how those friends are doing this week, send summary email.
- [x] **Task B-20.7** Create `RelapseFollowUpJob.java` in `scheduler/` — `@Scheduled(cron = "0 0 * * * *")` (hourly). Find check_ins where status='slipped' and created_at is between 23-25 hours ago and user has not checked in clean since. Send relapse support notification.

---

### STEP B-21: Docker & Deployment Config

> [!IMPORTANT]
> **DEFERRED TASK - DO NOT EXECUTE FOR NOW**
> This step is to be handled only when the project is fully ready for production.
> Skip this section until explicitly instructed.

**Purpose:** Containerize the Spring Boot backend for Railway deployment.

- [ ] **Task B-21.1** Create `Dockerfile` at project root: use `eclipse-temurin:21-jdk` as builder, copy pom.xml and src/, run `mvn package -DskipTests`, produce JAR. Final stage: `eclipse-temurin:21-jre`, copy JAR, `EXPOSE 8080`, `ENTRYPOINT ["java","-jar","app.jar"]`.
- [ ] **Task B-21.2** Create `.dockerignore` — exclude: `target/`, `.git/`, `*.md`, `.env`.
- [ ] **Task B-21.3** Create `railway.toml` at project root — specify: `[build] builder = "dockerfile"`, `[deploy] startCommand = ""`, port 8080.
- [ ] **Task B-21.4** Create `HealthController.java` in `controller/` — `@RequestMapping("/api/health")`. Single `GET /` endpoint that returns `{"status":"ok","timestamp":"..."}`. No auth required. Used by Railway health checks.

---

<a name="section-5"></a>

## SECTION 5: Next.js Frontend — Step-by-Step Build Plan

> **Tech:** Next.js 14+ App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand, react-hook-form + zod, Three.js, Supabase JS client v2

---

### STEP F-1: Project Initialization

**Purpose:** Bootstrap the Next.js project with all dependencies and base configuration.

- [x] **Task F-1.1** Run `npx create-next-app@latest unshackled-web --typescript --tailwind --app --src-dir --import-alias "@/*"`. Change into directory.
- [x] **Task F-1.2** Install core dependencies: `@supabase/supabase-js @supabase/ssr`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `three`, `@types/three`, `@stripe/stripe-js`, `date-fns`, `clsx`, `tailwind-merge`.
- [x] **Task F-1.3** Install shadcn/ui: run `npx shadcn@latest init`. Choose: Dark style, CSS variables, yes to RSC. Then install components: `npx shadcn@latest add button card input label select textarea badge avatar separator sonner progress`.
- [x] **Task F-1.4** Install additional UI libs: `lucide-react`, `recharts` (for charts), `react-calendar-heatmap` (for heatmap), `framer-motion` (for micro-animations alongside Three.js).
- [x] **Task F-1.5** Configure `src/app/globals.css` (Tailwind v4): add custom colors matching the design system (`amber`, `brand-blue`, `brand-green`, `brand-rose`, `dark-bg`, `dark-surface`). Add `fontFamily` with custom font. Add `animation` keyframes for `float`, `pulse-glow`, `fade-in`.
- [x] **Task F-1.6** Configure `next.config.ts`: add `images.remotePatterns` for Supabase storage domain. Add `experimental.serverActions: true`.
- [x] **Task F-1.7** Create `src/lib/fonts.ts` — import and export a Google Font (use `next/font/google`, choose: `Inter` for body, `Outfit` for display/headings).
- [x] **Task F-1.8** Update `src/app/layout.tsx` — apply fonts, dark background color (`bg-dark-bg`), default dark mode class on `<html>`. Import global CSS.
- [x] **Task F-1.9** Create `src/app/globals.css` — define CSS variables for the color system matching Section 1.3. Add base styles for `body`, `h1-h6`.

---

### STEP F-2: Supabase Client Setup

**Purpose:** Initialize Supabase client for browser and server use.

- [x] **Task F-2.1** Create `src/lib/supabase/client.ts` — exports `createBrowserClient()` using `@supabase/ssr` with env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] **Task F-2.2** Create `src/lib/supabase/server.ts` — exports `createServerClient()` using `@supabase/ssr` with cookies from `next/headers`. Used in Server Components and Route Handlers.
- [x] **Task F-2.3** Create `src/middleware.ts` at project root — uses `@supabase/ssr` to refresh auth session on every request. Redirects unauthenticated users from protected routes to `/login`. Protected routes: `/dashboard`, `/onboarding`, `/friends`, `/profile`, `/analytics`, `/journal`, `/settings`, `/premium`.
- [x] **Task F-2.4** Create `src/hooks/useSupabaseClient.ts` — a React hook that returns the browser Supabase client (singleton pattern using `useMemo`).
- [x] **Task F-2.5** Create `src/hooks/useAuth.ts` — a React hook that subscribes to `supabase.auth.onAuthStateChange`, returns `{user, session, loading}`.

---

### STEP F-3: API Client Layer

**Purpose:** Typed fetch wrappers for every Spring Boot endpoint. This is the bridge between Next.js and the backend.

- [x] **Task F-3.1** Create `src/lib/api/client.ts` — base `apiFetch` function that: reads `NEXT_PUBLIC_API_URL`, gets JWT from Supabase session, attaches `Authorization: Bearer <token>` header, handles 401/402/429 error codes globally. Returns typed response or throws typed error.
- [x] **Task F-3.2** Create `src/lib/api/types.ts` — export all TypeScript interfaces matching backend DTOs: `UserResponse`, `UserHabit`, `Streak`, `CheckIn`, `Challenge`, `ChallengeMedia`, `Notification`, `Badge`, `XpSummary`, `DashboardSummary`, `JournalEntry`, `LeaderboardEntry`, `SubscriptionStatus`, `HealthMilestone`, `MoneySaved`, `WithdrawalMessage`, `DopamineSuggestion`, `GlobalStats`.
- [x] **Task F-3.3** Create `src/lib/api/users.ts` — functions: `createUser(req)`, `getMe()`, `getUserByUsername(username)`, `updateMe(req)`, `deleteMe()`.
- [x] **Task F-3.4** Create `src/lib/api/habits.ts` — functions: `getAllHabits()`, `getMyHabits()`, `addHabit(req)`, `updateHabit(id, req)`, `deactivateHabit(id)`.
- [x] **Task F-3.5** Create `src/lib/api/onboarding.ts` — functions: `completeOnboarding(req)`, `getOnboardingStatus()`.
- [x] **Task F-3.6** Create `src/lib/api/checkins.ts` — functions: `submitCheckIn(req)`, `getCheckInHistory(userHabitId, days)`, `getTodayStatus()`.
- [x] **Task F-3.7** Create `src/lib/api/streaks.ts` — functions: `getMyStreaks()`, `getStreakForHabit(userHabitId)`.
- [x] **Task F-3.8** Create `src/lib/api/challenges.ts` — functions: `sendChallenge(req)`, `getUploadUrl(challengeId)`, `confirmUpload(challengeId, path)`, `reviewChallenge(challengeId, approve, note)`, `getChallenges()`.
- [x] **Task F-3.9** Create `src/lib/api/friends.ts` — functions: `sendFriendRequest(username)`, `respondToRequest(friendId, response)`, `getFriends()`, `getPendingRequests()`, `removeFriend(friendId)`, `searchUsers(query)`.
- [x] **Task F-3.10** Create `src/lib/api/notifications.ts` — functions: `getNotifications()`, `markRead(id)`, `markAllRead()`, `subscribeToPush(subscription)`, `getVapidPublicKey()`.
- [x] **Task F-3.11** Create `src/lib/api/analytics.ts` — functions: `getDashboard()`, `getMoneySaved(userHabitId)`, `getHeatmap(userHabitId)`, `getGlobalStats()`.
- [x] **Task F-3.12** Create `src/lib/api/journal.ts` — functions: `saveEntry(req)`, `getEntries(limit)`, `getEntry(date)`, `getSharedEntries()`.
- [x] **Task F-3.13** Create `src/lib/api/xp.ts` — functions: `getXpSummary()`.
- [x] **Task F-3.14** Create `src/lib/api/badges.ts` — functions: `getBadges()`, `getEarnedBadges()`.
- [x] **Task F-3.15** Create `src/lib/api/leaderboard.ts` — functions: `getFriendLeaderboard()`, `getGlobalLeaderboard()`.
- [x] **Task F-3.16** Create `src/lib/api/payments.ts` — functions: `createCheckout(successUrl, cancelUrl)`, `createPortal(returnUrl)`, `getSubscriptionStatus()`.
- [x] **Task F-3.17** Create `src/lib/api/content.ts` — functions: `getWithdrawalMessage(habitId, dayOffset)`, `getDopamineSuggestions(habits)`, `getMoneySuggestion(amount)`, `getHealthMilestones(habitId, dayOffset)`.

---

### STEP F-4: State Management (Zustand)

**Purpose:** Global client-side state for user, habits, streaks, and UI.

> **Decision:** Zustand over React Context because the app has complex nested state (habits × streaks × challenges × notifications) that would cause excessive re-renders with Context. Zustand's selector-based subscriptions are surgically precise. Redux is overkill for this scale.

- [x] **Task F-4.1** Create `src/store/useUserStore.ts` — Zustand store with state: `user` (UserResponse | null), `loading` (boolean). Actions: `setUser`, `clearUser`, `updateUser`.
- [x] **Task F-4.2** Create `src/store/useHabitStore.ts` — state: `habits` (UserHabit[]), `streaks` (Record<string, Streak>). Actions: `setHabits`, `updateStreak`, `addHabit`, `removeHabit`.
- [x] **Task F-4.3** Create `src/store/useNotificationStore.ts` — state: `notifications` (Notification[]), `unreadCount` (number). Actions: `setNotifications`, `addNotification`, `markRead`, `markAllRead`.
- [x] **Task F-4.4** Create `src/store/useChallengeStore.ts` — state: `activeChallenges` (Challenge[]), `pendingReview` (Challenge[]). Actions: `setActiveChallenges`, `addChallenge`, `updateChallenge`.
- [x] **Task F-4.5** Create `src/store/useOnboardingStore.ts` — state: `selectedHabits` (string[]), `habitConfigs` (Record<string, any>), `step` (number), `isSupporter` (boolean), `quitDate` (string). Actions: `setSelectedHabits`, `setHabitConfig`, `nextStep`, `prevStep`, `reset`.
- [x] **Task F-4.6** Create `src/providers/StoreHydrator.tsx` — a Client Component that runs on mount to populate Zustand stores from API (fetches `getMe()`, `getMyHabits()`, `getMyStreaks()`). Wrapped around the app in `layout.tsx`.

---

### STEP F-5: Three.js Animation Components

**Purpose:** Full-screen emotional animation moments. Each is a self-contained component.

- [x] **Task F-5.1** Create `src/components/animations/ThreeCanvas.tsx` — a base wrapper component that: creates a Three.js `WebGLRenderer`, `Scene`, `PerspectiveCamera`, handles resize, exposes `scene`, `camera`, `renderer` via ref. Accepts `onAnimate` callback prop (called each frame). Renders into a full-screen fixed `<div>`.
- [x] **Task F-5.2** Create `src/components/animations/OnboardingCompleteAnimation.tsx` — uses `ThreeCanvas`. Creates a particle system of ~2000 particles that starts collapsed at center and explodes outward in a golden nova pattern. Particles are `THREE.Points` with custom `ShaderMaterial`. Plays for 4 seconds then calls `onComplete` prop. Overlaid text: "You just made the most important decision of your life."
- [x] **Task F-5.3** Create `src/components/animations/StreakMilestoneAnimation.tsx` — accepts `days` prop. Creates aurora/ribbon effect using `THREE.TubeGeometry` with animated `CatmullRomCurve3`. Color shifts from rose (Day 1) through amber (Day 7) to gold (Day 30) to emerald (Day 90). Renders the day count in large typography overlay. Plays 5 seconds, calls `onComplete`.
- [x] **Task F-5.4** Create `src/components/animations/ChallengeReceivedAnimation.tsx` — creates a pulsing orb (`THREE.SphereGeometry` + `MeshStandardMaterial` with emissive blue). Rings expand outward like radar pulses. Overlaid text: "[Name] wants proof." Plays 3 seconds, transitions to challenge modal.
- [x] **Task F-5.5** Create `src/components/animations/RelapseRecoveryAnimation.tsx` — creates a soft, warm scene: dim sphere slowly brightens from near-black to warm amber. Overlaid text: "Slipping is not failing. Every quit attempt teaches your brain something." Plays 6 seconds, calls `onComplete`.
- [x] **Task F-5.6** Create `src/components/animations/AnimationController.tsx` — a context provider + hook (`useAnimation`) that manages which animation is currently playing, prevents overlaps, and dispatches animation events from anywhere in the app. Animations queue if one is already playing.

---

### STEP F-6: Pages — Authentication

**Purpose:** Sign up, log in, and password reset pages.

- [x] **Task F-6.1** Create `src/app/(auth)/layout.tsx` — centered layout with the Unshackled logo, dark background, no navigation.
- [x] **Task F-6.2** Create `src/app/(auth)/login/page.tsx` — Client Component. Form with email + password. On submit: call `supabase.auth.signInWithPassword()`. On success: redirect to `/dashboard` (or `/onboarding` if not completed). Display loading state: "Unlocking your progress…".
- [x] **Task F-6.3** Create `src/app/(auth)/signup/page.tsx` — Client Component. Form with email, password, confirm password. Use `react-hook-form` + `zod` schema. On submit: call `supabase.auth.signUp()`. On success: redirect to `/onboarding`. Loading state: "Creating your path to freedom…".
- [x] **Task F-6.4** Create `src/app/(auth)/reset-password/page.tsx` — email input form. Calls `supabase.auth.resetPasswordForEmail()`. Shows success message.
- [x] **Task F-6.5** Create `src/app/(auth)/update-password/page.tsx` — new password form. Calls `supabase.auth.updateUser({password})`. Handles the magic link token from the URL.

---

### STEP F-7: Pages — Onboarding

**Purpose:** The multi-step onboarding wizard.

- [x] **Task F-7.1** Create `src/app/onboarding/layout.tsx` — full-screen layout, no navigation, progress bar at top, back button.
- [x] **Task F-7.2** Create `src/app/onboarding/page.tsx` — redirect to `/onboarding/step/1`.
- [x] **Task F-7.3** Create `src/app/onboarding/step/[step]/page.tsx` — dynamic route handler for all onboarding steps. Reads step from params, renders the correct step component. Guards: if `step > total steps`, redirect to first uncompleted step. If onboarding already complete, redirect to `/dashboard`.
- [x] **Task F-7.4** Create `src/components/onboarding/StepOne_WelcomeOrSupporter.tsx` — choice screen: "I have a habit I want to quit" vs "I'm here to support a friend". Updates `useOnboardingStore.isSupporter`. Animated card selection.
- [x] **Task F-7.5** Create `src/components/onboarding/StepTwo_HabitPicker.tsx` — visually rich card grid of all habit types. Multi-select. Each card has emoji, name, brief description. Clicking selects/deselects (amber border glow on selected). Updates `useOnboardingStore.selectedHabits`.
- [x] **Task F-7.6** Create `src/components/onboarding/StepThree_SmokingConfig.tsx` — shown only if 'smoking' selected. Inputs: cigarettes per day (slider + number input), cost per cigarette (currency input). Beautiful layout with real-time money preview: "At that rate, you spend ₹{X} per week on cigarettes."
- [x] **Task F-7.7** Create `src/components/onboarding/StepFour_DrinkingConfig.tsx` — shown only if 'drinking' selected. Inputs: drinks per week, avg cost per session. Live money calculation preview.
- [x] **Task F-7.8** Create `src/components/onboarding/StepFive_VapingConfig.tsx` — pods per week, pod cost. Live preview.
- [x] **Task F-7.9** Create `src/components/onboarding/StepSix_PornConfig.tsx` — hours per day slider only. No money metric. Empathetic copy: "This information stays private and helps us understand your usage pattern."
- [x] **Task F-7.10** Create `src/components/onboarding/StepSeven_SocialMediaConfig.tsx` — hours per day slider, multi-select platform chips (Instagram, YouTube, Twitter/X, TikTok, Reddit, Other).
- [x] **Task F-7.11** Create `src/components/onboarding/StepEight_SugarConfig.tsx` — estimated spend per week on junk food/sugar.
- [x] **Task F-7.12** Create `src/components/onboarding/StepNine_GamblingConfig.tsx` — estimated spend per week.
- [x] **Task F-7.13** Create `src/components/onboarding/StepTen_CustomHabitConfig.tsx` — free text description, time per day, spend per day.
- [x] **Task F-7.14** Create `src/components/onboarding/StepEleven_QuitDate.tsx` — date picker (today or future date). Calendar component. Copy: "When does your new life start?" Defaults to today.
- [x] **Task F-7.15** Create `src/components/onboarding/StepTwelve_SupporterSetup.tsx` — shown only for supporters. Inputs: display name, photo upload, search and select friends to support.
- [x] **Task F-7.16** Create `src/components/onboarding/OnboardingProgressBar.tsx` — animated progress bar at top showing step X of N.
- [x] **Task F-7.17** Create `src/hooks/useOnboardingNavigation.ts` — hook that computes: which step components to show (based on selected habits), current step index, next/prev step navigation. Handles the dynamic step count (more habits = more config steps).
- [x] **Task F-7.18** Create `src/app/onboarding/complete/page.tsx` — final page that: submits the full onboarding payload to `completeOnboarding()`, plays `OnboardingCompleteAnimation`, after animation calls `router.push('/dashboard')`.

---

### STEP F-8: Pages — Dashboard

**Purpose:** The main daily-use screen.

- [x] **Task F-8.1** Create `src/app/(app)/layout.tsx` — app shell layout with: top navigation bar, bottom mobile nav, notification bell. Wraps all authenticated app pages.
- [x] **Task F-8.2** Create `src/app/(app)/dashboard/page.tsx` — Server Component that fetches dashboard summary (via server-side Supabase session). Passes data to Client Components.
- [x] **Task F-8.3** Create `src/components/dashboard/DashboardHeader.tsx` — greeting with user name, current date, overall streak context.
- [x] **Task F-8.4** Create `src/components/dashboard/StreakCard.tsx` — large animated streak number for one habit. Props: `habitName`, `streakDays`, `habitColor`. The number animates on mount (count-up animation using `framer-motion`). Amber glow effect.
- [x] **Task F-8.5** Create `src/components/dashboard/CheckInButton.tsx` — large CTA: "I'm clean today ✓" button. On click: calls `submitCheckIn()`, shows loading state "Counting your clean hours…", on success plays celebration micro-animation, updates streak. Also shows "I slipped" as a subtle secondary option.
- [x] **Task F-8.6** Create `src/components/dashboard/SlipFlow.tsx` — modal that opens when "I slipped" is tapped. Step 1: empathy message ("It happened. You're not broken."). Step 2: "What triggered it?" (optional multi-select). Step 3: "What will you do differently?" (optional text). Step 4: confirmation, submits check-in with status='slipped', triggers RelapseRecoveryAnimation.
- [x] **Task F-8.7** Create `src/components/dashboard/MoneyPanel.tsx` — shows savings breakdown. Props: `today`, `thisWeek`, `thisMonth`, `allTime`. Each in its own colored card (cool blue). Animated number counter.
- [x] **Task F-8.8** Create `src/components/dashboard/MoneySuggestion.tsx` — displays the contextual suggestion ("That's a road trip to Coorg"). Refreshes on each visit. Subtle card with suggestion icon.
- [x] **Task F-8.9** Create `src/components/dashboard/HealthTimeline.tsx` — horizontal scrollable timeline showing health milestones. Past milestones are filled/bright. Future milestones are dimmed. Current day is highlighted with a pulsing dot. Uses soft green color.
- [x] **Task F-8.10** Create `src/components/dashboard/WithdrawalMessage.tsx` — empathy card. Only shown if there is a message for today's day offset. Gentle rose background. Icon of a hand. Dismissible.
- [x] **Task F-8.11** Create `src/components/dashboard/DopamineSuggestions.tsx` — shows 3 rotating dopamine substitution suggestions. Each has an icon, title, brief description. "Shuffle" button to get 3 new ones.
- [x] **Task F-8.12** Create `src/components/dashboard/XPBar.tsx` — shows current level name, XP progress bar to next level. Animated fill. On level-up: plays a celebration toast.
- [x] **Task F-8.13** Create `src/components/dashboard/GlobalStatsBar.tsx` — subtle bottom banner: "Join 20,432 people who've quit smoking on Unshackled. Together you've saved ₹1.2 crore this month." Rotates between stats every 10 seconds.

---

### STEP F-9: Pages — Friends & Social

**Purpose:** The social accountability layer.

- [x] **Task F-9.1** Create `src/app/(app)/friends/page.tsx` — renders friends list, pending requests, leaderboard, and add-friend search.
- [x] **Task F-9.2** Create `src/components/friends/FriendCard.tsx` — shows friend's avatar, name, streak counts per habit, top badge, "Challenge" button. Props: `friend` (UserResponse with streak data).
- [x] **Task F-9.3** Create `src/components/friends/SendChallengeModal.tsx` — modal opened from FriendCard's "Challenge" button. Shows: friend name, optional message input, which habit to challenge for. On submit: calls `sendChallenge()`, shows "Challenge sent!" confirmation.
- [x] **Task F-9.4** Create `src/components/friends/PendingRequestCard.tsx` — shows requester's name/avatar, "Accept" and "Decline" buttons. On accept: calls `respondToRequest()`, updates list.
- [x] **Task F-9.5** Create `src/components/friends/AddFriendSearch.tsx` — debounced search input (300ms). Shows user results with avatar, username, streak count. "Add Friend" button per result.
- [x] **Task F-9.6** Create `src/components/friends/FriendLeaderboard.tsx` — ranked list of friends + self. Shows rank, avatar, name, total clean days, streak. Highlight: current user's row.
- [x] **Task F-9.7** Create `src/components/friends/ChallengeHistoryList.tsx` — list of all challenges (sent and received). Each shows: who challenged who, status badge (pending/approved/rejected/expired), timestamp, EXIF verification status.
- [x] **Task F-9.8** Create `src/components/friends/ChallengeResponseModal.tsx` — shown to challenged user. Instructions to take a live photo. Camera access using browser `getUserMedia`. Shows countdown timer (time remaining before deadline). Upload button. Submits photo to signed URL, then calls `confirmUpload()`.
- [x] **Task F-9.9** Create `src/components/friends/ChallengeReviewModal.tsx` — shown to challenger after challenged user responds. Displays the uploaded photos. EXIF verification badge (✅ Timestamp verified / ⚠️ Timestamp missing). Approve / Reject buttons with optional note.

---

### STEP F-10: Pages — Profile

**Purpose:** Public profile page and settings.

- [x] **Task F-10.1** Create `src/app/(app)/profile/[username]/page.tsx` — Server Component. Fetches user by username. Shows: avatar, display name, bio, habit streaks, badges, supporter count, friend count.
- [x] **Task F-10.2** Create `src/components/profile/ProfileHeader.tsx` — avatar (with ring showing longest streak tier), display name, username, bio, "Add Friend" / "Remove Friend" button if viewing others.
- [x] **Task F-10.3** Create `src/components/profile/BadgeGrid.tsx` — grid of badge icons. Earned badges are full color. Unearned badges are grayscale/dimmed with a lock icon. Clicking any badge shows a modal with its name, description, and how to earn it.
- [x] **Task F-10.4** Create `src/components/profile/HabitStreakList.tsx` — list of user's tracked habits with current streak count and a mini-heatmap (last 30 days) per habit.
- [x] **Task F-10.5** Create `src/app/(app)/settings/page.tsx` — settings page with sections: Profile (avatar upload, display name, bio), Notifications (toggle each type, set reminder time), Privacy (leaderboard opt-in, profile visibility), Account (change email, change password), Danger Zone (delete account).
- [x] **Task F-10.6** Create `src/components/settings/AvatarUpload.tsx` — file input + crop preview. On confirm: upload to Supabase Storage `avatars/{userId}`, update user profile with new `avatarUrl`.
- [x] **Task F-10.7** Create `src/components/settings/NotificationPreferences.tsx` — toggle switches for each notification type. Save button calls `updateMe()`.

---

### STEP F-11: Pages — Analytics

**Purpose:** Per-habit analytics and charts.

- [x] **Task F-11.1** Create `src/app/(app)/analytics/page.tsx` — shows habit selector tabs, then renders analytics for selected habit.
- [x] **Task F-11.2** Create `src/components/analytics/HeatmapCalendar.tsx` — GitHub-style contribution heatmap using `react-calendar-heatmap`. Green for clean days, rose for slipped days, gray for no data. Shows last 6 months.
- [x] **Task F-11.3** Create `src/components/analytics/MoneySavedChart.tsx` — line chart using `recharts`. X-axis: time. Y-axis: cumulative money saved. Gradient fill. Blue color scheme.
- [x] **Task F-11.4** Create `src/components/analytics/StreakStatsCard.tsx` — shows: current streak, longest streak, total clean days, total money saved (all-time), check-in rate (% of days checked in since quit date).
- [x] **Task F-11.5** Create `src/components/analytics/MoodTrendChart.tsx` — bar chart of mood scores over time. Color gradient from rose (low mood) to green (high mood).

---

### STEP F-12: Pages — Journal

**Purpose:** Private daily journal with mood tracking.

- [x] **Task F-12.1** Create `src/app/(app)/journal/page.tsx` — shows today's entry editor and a list of past entries.
- [x] **Task F-12.2** Create `src/components/journal/MoodPicker.tsx` — row of emoji faces representing mood 1–10. Clicking selects that mood. Selected emoji enlarges with amber glow.
- [x] **Task F-12.3** Create `src/components/journal/JournalEditor.tsx` — textarea for journal content. Below: trigger chips (Stress, Boredom, Social Pressure, Craving, Anxiety, Custom), "What helped" input, share toggle (with friend selector). Auto-saves draft to `localStorage` every 30 seconds.
- [x] **Task F-12.4** Create `src/components/journal/JournalEntryCard.tsx` — past entry card showing: date, mood emoji, content preview (truncated), trigger chips, "Read more" expand. Color-coded by mood score.
- [x] **Task F-12.5** Create `src/components/journal/SharedEntriesView.tsx` — list of journal entries shared with the current user by their friends. Shows friend name, date, content.

---

### STEP F-13: Pages — Premium / Payments

**Purpose:** Upgrade flow and subscription management.

- [x] **Task F-13.1** Create `src/app/(app)/premium/page.tsx` — the "Sovereign Plan" upsell page. Shows: free vs premium comparison table, price, testimonials (placeholder), "Unlock Sovereign Plan" CTA button.
- [x] **Task F-13.2** Create `src/components/premium/PricingTable.tsx` — two-column comparison: Free (1 habit, 3 friends, basic analytics) vs Sovereign (unlimited habits, unlimited friends, advanced analytics, priority challenges, exclusive badges, ad-free). Features list with check/cross icons.
- [x] **Task F-13.3** Create `src/hooks/useCheckout.ts` — hook that: calls `createCheckout(successUrl, cancelUrl)`, redirects to the returned Stripe checkout URL. Handles loading state.
- [x] **Task F-13.4** Create `src/app/(app)/premium/success/page.tsx` — shown after successful Stripe payment. Polls `/api/payments/status` until premium_status = 'premium' (Stripe webhook may take a few seconds). Shows celebration animation. Redirect to dashboard.
- [x] **Task F-13.5** Create `src/app/(app)/premium/cancelled/page.tsx` — shown if user cancels checkout. Gentle message: "No worries. We'll be here when you're ready." Link back to premium page.
- [x] **Task F-13.6** Create `src/components/premium/ManageSubscription.tsx` — shown if user is already premium. "Manage Subscription" button that creates portal session and redirects. Shows current renewal date.

---

### STEP F-14: Pages — Landing

**Purpose:** Public marketing page for non-logged-in visitors.

- [x] **Task F-14.1** Create `src/app/(landing)/page.tsx` — root landing page. Server Component. Imports all landing sections.
- [x] **Task F-14.2** Create `src/components/landing/LandingHero.tsx` — high-impact hero with aggressive typography, Three.js background, and clear "Join the 5%" CTA.
- [x] **Task F-14.3** Create `src/components/landing/LandingFeatures.tsx` — grid of core features: Proof-of-life challenges, neuro-analytics, social sharing, instant verification.
- [x] **Task F-14.4** Create `src/components/landing/LandingPricing.tsx` — marketing version of the pricing table. Focus on "The cost of dependency vs the price of freedom."
- [x] **Task F-14.5** Create `src/components/landing/LandingStats.tsx` — global platform stats visualization (total money saved, clean days, users).
- [x] **Task F-14.6** Create `src/components/landing/LandingFooter.tsx` — site map, social links, mission statement, and copyright.
- [x] **Task F-14.7** Create `src/app/(landing)/layout.tsx` — separate layout for landing page (no sidebar, transparent-to-glass header).

---

### STEP F-15: Reusable UI Components

**Purpose:** Shared atomic components used across multiple pages.

- [x] **Task F-15.1** Create `src/components/ui/LoadingState.tsx` — accepts `message`, `fullScreen`. Shows consistent, premium loading experience (pulsing shield orb). Never a spinner.
- [x] **Task F-15.2** Create `src/components/ui/EmptyState.tsx` — accepts `icon`, `title`, `message`, `action` (optional button). Warm, personality-filled presentation of empty lists.
- [x] **Task F-15.3** Create `src/components/ui/HabitIcon.tsx` — renders the correct emoji/icon for a habit slug. Props: `slug`, `size`.
- [x] **Task F-15.4** Create `src/components/ui/StreakBadge.tsx` — small badge showing streak count with a flame icon. Color scales from gray (0 days) to amber (7 days) to gold (30+ days).
- [x] **Task F-15.5** Create `src/components/ui/NotificationBell.tsx` — bell icon with unread count badge. Clicking opens notification dropdown.
- [x] **Task F-15.6** Create `src/components/ui/NotificationDropdown.tsx` — dropdown list of recent notifications. Each notification is clickable and marks as read. "Mark all read" button.
- [x] **Task F-15.7** Create `src/components/ui/AppNav.tsx` — top navigation bar for authenticated pages. Logo, user avatar, notification bell, mobile menu toggle.
- [x] **Task F-15.8** Create `src/components/ui/BottomNav.tsx` — mobile bottom navigation bar. Icons + labels for: Dashboard, Friends, Analytics, Journal, Profile.
- [x] **Task F-15.9** Create `src/components/ui/CurrencyDisplay.tsx` — displays a monetary amount with proper formatting based on user's currency/country (₹ for INR, $ for USD, etc.). Props: `amount`, `currency`.
- [x] **Task F-15.10** Create `src/components/ui/PremiumGate.tsx` — wrapper component. If user is free tier and tries to access a premium feature, renders an inline upsell card instead of the feature content.

---

### STEP F-16: Push Notification Service Worker

**Purpose:** Enable browser push notifications.

- [x] **Task F-16.1** Create `public/sw.js` — service worker file. Handles `push` event: parses notification data, calls `self.registration.showNotification(title, options)` with icon, badge, data. Handles `notificationclick` event: opens the relevant page based on notification type.
- [x] **Task F-16.2** Create `src/lib/pushNotifications.ts` — functions: `registerServiceWorker()` (registers `sw.js`), `subscribeToPush(vapidPublicKey)` (calls `registration.pushManager.subscribe()` with VAPID key, returns `PushSubscription`), `saveSubscription(subscription)` (calls backend `/api/push/subscribe`).
- [x] **Task F-16.3** Create `src/hooks/usePushNotifications.ts` — hook that: on mount checks if push is supported and permission granted, calls `registerServiceWorker()` and `subscribeToPush()`, saves subscription to backend. Exposes `permissionStatus`, `requestPermission()`.
- [x] **Task F-16.4** Update `src/app/(app)/layout.tsx` — call `usePushNotifications` hook to auto-setup push on first authenticated load. Show a gentle banner prompting user to enable notifications if not yet enabled.

---

### STEP F-17: Supabase Realtime Subscriptions

**Purpose:** Real-time updates for notifications, challenges, and friend activity.

- [x] **Task F-17.1** Create `src/hooks/useRealtimeNotifications.ts` — subscribes to `notifications` table for current user (INSERT events). On new notification: add to `useNotificationStore`, show toast, if it's a challenge_received: trigger `ChallengeReceivedAnimation`.
- [x] **Task F-17.2** Create `src/hooks/useRealtimeChallenges.ts` — subscribes to `challenges` table where `challenged_id = userId` (INSERT events) and `challenger_id = userId` (UPDATE events for review). Updates `useChallengeStore`.
- [x] **Task F-17.3** Create `src/hooks/useRealtimeFriendActivity.ts` — subscribes to `streaks` table for friend user IDs (UPDATE events). When a friend hits a milestone streak, show a toast: "Priya just hit 30 days! 🎉".
- [x] **Task F-17.4** Create `src/providers/RealtimeProvider.tsx` — a Client Component that mounts all realtime hooks. Wrapped around authenticated app layout.

---

### STEP F-18: Form Validation Schemas

**Purpose:** Centralized Zod schemas for all forms.

- [x] **Task F-18.1** Create `src/lib/validations/auth.ts` — `loginSchema`, `signupSchema`.
- [x] **Task F-18.2** Create `src/lib/validations/onboarding.ts` — `onboardingSchema` covering all habit configurations.
- [x] **Task F-18.3** Create `src/lib/validations/habit.ts` — `addHabitSchema`.
- [x] **Task F-18.4** Create `src/lib/validations/profile.ts` — `updateProfileSchema`.
- [x] **Task F-18.5** Create `src/lib/validations/journal.ts` and `src/lib/validations/challenge.ts` — `journalEntrySchema`, `sendChallengeSchema`.

---

### STEP F-19: Utility Functions

**Purpose:** Shared helper functions used across components.

- [x] **Task F-19.1** Create `src/lib/utils/dateUtils.ts` — functions: `formatDate(date, format)`, `daysSince(date)`, `getDayOffset(quitDate)` (days since quit date), `isToday(date)`, `formatRelativeTime(date)` (e.g., "2 hours ago").
- [x] **Task F-19.2** Create `src/lib/utils/moneyUtils.ts` — functions: `formatCurrency(amount, currency)`, `calculateMoneySaved(habitConfig, daysClean)` (mirrors backend calculation for optimistic UI).
- [x] **Task F-19.3** Create `src/lib/utils/habitUtils.ts` — functions: `getHabitColor(slug)` (returns Tailwind color class), `getStreakTier(days)` (returns 'beginner'|'building'|'strong'|'legendary'), `getMilestoneMessage(days)`.
- [x] **Task F-19.4** Create `src/lib/utils/cn.ts` (Already in `src/lib/utils.ts` via shadcn/ui).

---

<a name="section-6"></a>

## SECTION 6: Notification Architecture

### 6.1 Web Push Flow

```
1. Frontend registers service worker (public/sw.js)
2. Frontend calls pushManager.subscribe() with VAPID public key
   → Browser generates endpoint + p256dh + auth keys
3. Frontend POSTs subscription to Spring Boot /api/push/subscribe
4. Spring Boot stores in push_subscriptions table
5. When notification needed:
   Spring Boot → WebPushService.sendPush(userId, ...)
   → loads all push_subscriptions for userId
   → for each: builds encrypted push message (VAPID)
   → POSTs to browser push service endpoint
   → Browser push service → device → sw.js push event
   → sw.js calls showNotification()
6. User clicks notification → sw.js notificationclick → postMessage → Next.js router
```

**VAPID Key Generation:**

```bash
# Run once during backend setup:
npx web-push generate-vapid-keys
# Copy VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to env
```

### 6.2 Email Templates (Resend)

| Template            | Trigger                               | Subject Line                                |
| ------------------- | ------------------------------------- | ------------------------------------------- |
| `DailyReminder`     | Scheduled job (user's preferred time) | "Your clean streak is waiting for you"      |
| `WeeklyReport`      | Monday 9 AM UTC                       | "Your week in freedom — [Name]"             |
| `MilestoneEmail`    | On milestone hit                      | "Day [N]. You're doing something real."     |
| `RelapseRecovery`   | 24h after a slip                      | "One slip doesn't erase what you've built." |
| `ChallengeReceived` | When challenged                       | "[Name] wants proof. You've got this."      |
| `FriendMilestone`   | When friend hits milestone            | "Your friend [Name] just hit Day [N] 🎉"    |
| `SupporterNudge`    | Monday 10 AM UTC                      | "Your people's week at a glance"            |

All emails use: Resend (`@resend/node` SDK or direct HTTP). From address: `noreply@unshackled.app`. Reply-to: `support@unshackled.app`.

### 6.3 Supabase Realtime Channels

| Channel                       | Table           | Event         | Filter                                                   | Purpose                 |
| ----------------------------- | --------------- | ------------- | -------------------------------------------------------- | ----------------------- |
| `user-notifications:{userId}` | `notifications` | INSERT        | `user_id=eq.{userId}`                                    | Real-time bell + toast  |
| `user-challenges:{userId}`    | `challenges`    | INSERT/UPDATE | `challenged_id=eq.{userId} OR challenger_id=eq.{userId}` | Challenge flow          |
| `friend-streaks:{userId}`     | `streaks`       | UPDATE        | none (filtered client-side)                              | Friend milestone alerts |

### 6.4 Notification Preference Management

The `notification_prefs` JSONB column on `users` stores:

```json
{
  "daily_reminder": true,
  "milestones": true,
  "friend_milestones": true,
  "challenges": true,
  "relapse_support": true,
  "weekly_report": true,
  "withdrawal_warnings": true,
  "supporter_nudge": true
}
```

Every `NotificationService.sendNotification()` call checks `user.notification_prefs[type]` before sending push or email. Push can be independently disabled if user has revoked browser permission.

---

<a name="section-7"></a>

## SECTION 7: Image Verification Pipeline

### 7.1 Complete Flow

```
1. CHALLENGE SENT
   - Challenger sends challenge via POST /api/challenges
   - Backend: INSERT challenge, status='pending', response_deadline = NOW + 10 min
   - Push notification sent to challenged user

2. CHALLENGED USER RECEIVES NOTIFICATION
   - Opens app, sees ChallengeResponseModal
   - App shows countdown timer (time until deadline)
   - User MUST use camera (live photo) — not gallery

3. PHOTO CAPTURE (Frontend)
   - ChallengeResponseModal uses navigator.mediaDevices.getUserMedia({video: true})
   - User sees live camera preview
   - Clicks "Take Photo" → canvas.drawImage(videoElement) → blob
   - Frontend NOTE: Browser MediaStream photos do NOT embed EXIF (this is by design)
   - For mobile apps / native: EXIF would be present
   - Architecture decision: backend treats missing EXIF as a yellow flag, not auto-rejection

4. GET SIGNED UPLOAD URL
   - Frontend: GET /api/challenges/{id}/upload-url
   - Backend: validates user is challenged party, validates challenge still pending
   - Backend: calls Supabase Storage API to generate signed upload URL
   - URL path: challenges/{challengeId}/{uuid}.jpg
   - Expiry: 5 minutes

5. UPLOAD
   - Frontend: PUT image blob directly to signed Supabase URL (bypasses backend for file transfer)
   - Supabase handles storage

6. CONFIRM AND VERIFY
   - Frontend: POST /api/challenges/{id}/confirm with {storagePath: "challenges/{id}/{uuid}.jpg"}
   - Backend:
     a. Validates challenge is pending and within deadline
     b. Downloads image from Supabase Storage (using service account key)
     c. Runs ExifExtractionService on image bytes
     d. If EXIF timestamp present:
        - Compare to challenge.created_at
        - If within 10 minutes: exif_verified = true
        - If older than 10 minutes: exif_verified = false, flag 'timestamp_too_old'
     e. If EXIF timestamp absent:
        - exif_verified = null, flag 'no_exif_data'
        - This is EXPECTED for browser webcam captures
        - The challenger is informed and makes the final judgment
     f. If GPS present: record lat/lng as additional trust data
     g. INSERT challenge_media with all data
     h. UPDATE challenge status = 'responded' (or 'verification_failed' if timestamp_too_old)
     i. Push notification to challenger with EXIF result summary

7. CHALLENGER REVIEWS
   - ChallengeReviewModal shows:
     - Photos (max 3)
     - EXIF badge: "✅ Timestamp verified (taken 3 min ago)" OR "⚠️ No timestamp data (browser webcam — normal)" OR "🚨 Timestamp too old (taken yesterday)"
     - Approve / Reject buttons
   - POST /api/challenges/{id}/review {approve: true/false, note: "..."}
   - Backend:
     - If approved: no streak change, award XP to both
     - If rejected: call StreakService.resetStreak(), send empathy notification, award XP to challenger

8. POST-REJECTION
   - RelapseRecoveryAnimation plays for challenged user
   - Empathetic notification: "Your friend reviewed your proof. Streak reset. You're not defined by this."
```

### 7.2 Missing EXIF Handling

Screenshots (from the camera roll) have no EXIF. Webcam captures via browser MediaStream also have no EXIF. This is handled by:

1. **Frontend warning:** When user selects a file from gallery instead of using live camera, show: "⚠️ Photos from your camera roll can't be timestamp-verified. For a fair challenge, use your live camera."
2. **Backend:** `exif_verified = null` (not false) for missing EXIF. The UI communicates this transparently to the challenger as "no timestamp data — use your judgment."
3. **Trust model:** The human challenger is the final arbiter. The EXIF system is a trust signal, not a hard blocker.

### 7.3 Security Considerations

- **Signed upload URLs:** Expire in 5 minutes. Generated per challenge, per upload session.
- **File size limit:** Enforce max 10MB on Supabase Storage bucket policy.
- **File type restriction:** Supabase bucket policy allows only `image/jpeg`, `image/png`.
- **Access control:** `challenge_media` records are only readable by the two parties in the challenge (enforced via RLS).
- **Virus scanning:** At MVP, rely on Supabase's built-in file handling. For V2: integrate ClamAV via a Cloud Function triggered on Storage upload.
- **Rate limiting:** Limit challenge sends to 5 per hour per user (enforced at Spring Boot filter level).

### 7.4 EXIF Library Usage (Java — metadata-extractor)

```java
// ExifExtractionService.java — core extraction logic
Metadata metadata = ImageMetadataReader.readMetadata(imageInputStream);
ExifSubIFDDirectory directory = metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class);
Date takenDate = directory != null ? directory.getDate(ExifSubIFDDirectory.TAG_DATETIME_ORIGINAL) : null;

GpsDirectory gpsDirectory = metadata.getFirstDirectoryOfType(GpsDirectory.class);
GeoLocation location = gpsDirectory != null ? gpsDirectory.getGeoLocation() : null;
```

---

<a name="section-8"></a>

## SECTION 8: Gamification Engine

### 8.1 XP Formula

| Action                                     | XP Awarded | Notes                      |
| ------------------------------------------ | ---------- | -------------------------- |
| Daily clean check-in                       | 25         | Once per habit per day     |
| Streak Day 7                               | 100        | Bonus on top of daily      |
| Streak Day 14                              | 150        | Bonus                      |
| Streak Day 30                              | 500        | Bonus                      |
| Streak Day 60                              | 750        | Bonus                      |
| Streak Day 90                              | 1000       | Bonus                      |
| Streak Day 180                             | 2000       | Bonus                      |
| Streak Day 365                             | 5000       | Bonus                      |
| Journal entry written                      | 15         | Once per day               |
| Mood logged                                | 10         | Once per day               |
| Challenge responded to                     | 50         | Regardless of result       |
| Challenge approved (challenger)            | 30         |                            |
| Friend added                               | 20         | One-time per friendship    |
| Badge earned                               | Varies     | Defined in badge.xp_reward |
| Relapse recovery (7 days clean after slip) | 400        | Special bonus              |

**Anti-farm protection:** XP for check-ins, journal, and mood is limited to once per habit/category per calendar day (enforced at service layer before insert).

### 8.2 Level Thresholds

| Level | Name        | XP Required |
| ----- | ----------- | ----------- |
| 1     | Spark       | 0           |
| 2     | Awakened    | 150         |
| 3     | Grounded    | 400         |
| 4     | Resolute    | 800         |
| 5     | Rewiring    | 1,500       |
| 6     | Unbound     | 2,500       |
| 7     | Reclaimer   | 4,000       |
| 8     | Forged      | 6,000       |
| 9     | Enduring    | 9,000       |
| 10    | Reclaimed   | 13,000      |
| 12    | Rebuilder   | 20,000      |
| 15    | Sovereign   | 30,000      |
| 18    | Transcended | 55,000      |
| 20    | Unshackled  | 75,000      |

### 8.3 Badge Trigger Conditions

| Badge Slug             | Trigger              | Condition                                                  | Rarity    |
| ---------------------- | -------------------- | ---------------------------------------------------------- | --------- |
| `first_day`            | streak_days          | current_streak >= 1                                        | Common    |
| `first_week`           | streak_days          | current_streak >= 7                                        | Common    |
| `two_weeks`            | streak_days          | current_streak >= 14                                       | Rare      |
| `thirty_days`          | streak_days          | current_streak >= 30                                       | Epic      |
| `sixty_days`           | streak_days          | current_streak >= 60                                       | Epic      |
| `ninety_days`          | streak_days          | current_streak >= 90                                       | Legendary |
| `six_months`           | streak_days          | current_streak >= 180                                      | Legendary |
| `one_year`             | streak_days          | current_streak >= 365                                      | Legendary |
| `money_saver_1k`       | money_saved          | allTimeSaved >= 1000                                       | Common    |
| `money_saver_10k`      | money_saved          | allTimeSaved >= 10000                                      | Rare      |
| `money_saver_50k`      | money_saved          | allTimeSaved >= 50000                                      | Epic      |
| `accountability_champ` | challenges_completed | challengesResponded >= 10                                  | Rare      |
| `rising_again`         | relapse_recovery     | 7 consecutive clean days after a slip                      | Epic      |
| `journal_keeper`       | checkins             | journalEntriesCount >= 30                                  | Rare      |
| `social_butterfly`     | friend_added         | friendCount >= 5                                           | Common    |
| `dopamine_rebuilt`     | streak_days          | current_streak >= 90 (same as ninety_days, different copy) | Legendary |
| `clean_sweep`          | checkins             | 30 consecutive clean check-ins across ALL habits           | Epic      |

**BadgeService check order:** After every check-in, the service loads all badges, fetches current user metrics once (streak, money saved, challenge count, journal count, friend count), then iterates all badges and checks conditions. Already-earned badges are skipped (checked via `hasEarned()`).

### 8.4 Leaderboard Calculation

**Friend Leaderboard:**

- Computed on demand (GET /api/leaderboard/friends)
- SQL: join friends → user_habits → streaks, SUM(total_clean_days) per user, ORDER BY sum DESC
- Include current user in results
- Ties broken by longest_streak DESC, then by created_at ASC (earlier member wins)

**Global Leaderboard:**

- Computed on demand, cached in-memory for 15 minutes
- Only users with `leaderboard_opt_in = true`
- Same ranking formula as friend leaderboard
- Cap at top 100 results

### 8.5 Anti-Cheat Mechanisms

1. **Check-in once per day per habit:** Enforced by `UNIQUE(user_habit_id, checkin_date)` constraint in DB.
2. **XP once per action type per day:** Checked in `XpService.awardXp()` — SELECT count of xp_events of same type for same user on same day before inserting.
3. **Challenge photo must be live:** Signed upload URL expires in 5 minutes. Photo must be uploaded within that window. EXIF timestamp serves as an additional signal.
4. **Streak cannot be manually inflated:** `StreakService.recalculateStreak()` always reads from `check_ins` table — it is not a simple increment. Every streak recomputation reads raw check-in history.
5. **No self-challenge:** Backend validates `challenger_id != challenged_id` before inserting a challenge.
6. **Friend requirement for challenges:** Backend validates friendship exists before allowing challenge send.

---

<a name="section-9"></a>

## SECTION 9: Analytics Engine

### 9.1 Streak Computation Strategy

**Approach: Event-sourced with materialized summary.**

Raw events live in `check_ins` (source of truth). The `streaks` table is a materialized summary (current_streak, longest_streak, total_clean_days) updated on every check-in or challenge review.

`StreakService.recalculateStreak(userHabitId)`:

1. Load all check-ins for this habit ordered by `checkin_date` DESC
2. Start from today (or yesterday if no today check-in yet)
3. Walk backwards through days, counting consecutive 'clean' statuses
4. Stop at first gap or 'slipped' status
5. That count is `current_streak`
6. Walk entire history to find `longest_streak` (max consecutive clean run)
7. Count all 'clean' rows for `total_clean_days`
8. UPDATE streaks table

**Backfill protection:** If quit date is in the past and user hasn't checked in at all yet, streak starts at 0. No retroactive clean days are granted without explicit check-ins.

### 9.2 Money Savings Computation

Calculated in `AnalyticsService.getMoneySaved(userHabitId)`:

```
Smoking:  dailySaved = cigarettes_per_day × cost_per_cigarette
Drinking: dailySaved = (drinks_per_week × cost_per_session) / 7
Vaping:   dailySaved = (pods_per_week × pod_cost) / 7
Sugar:    dailySaved = spend_per_week / 7
Gambling: dailySaved = spend_per_week / 7
```

Then:

- `todaySaved`: dailySaved × min(1, daysSinceQuit)
- `weekSaved`: dailySaved × min(7, daysSinceQuit)
- `monthSaved`: dailySaved × min(30, daysSinceQuit)
- `allTimeSaved`: dailySaved × total_clean_days (from streaks table)

This is computed in real-time on request, not cached. Calculation is O(1) after loading habit config and streak data.

### 9.3 Health Milestone Timeline

`ContentService.getHealthMilestones(habitId, dayOffset)`:

1. Query `health_milestones WHERE habit_id = X AND day_offset <= dayOffset ORDER BY day_offset ASC`
2. Also query milestones within next 30 days for preview (upcoming milestones)
3. Return: `{past: [...], current: milestone for today (if any), upcoming: [...]}`

Frontend renders this as a horizontal timeline where past milestones are lit up, future are dimmed, and current day has a special state.

### 9.4 Global Stats Computation

Cached in-memory in `AnalyticsService` with a 60-minute TTL:

```sql
-- Total users
SELECT COUNT(*) FROM users WHERE onboarding_completed = true;

-- Total habits tracked
SELECT COUNT(*) FROM user_habits WHERE is_active = true;

-- Total clean days globally
SELECT SUM(total_clean_days) FROM streaks;

-- Approximate total money saved (INR, smoking only example)
SELECT SUM(s.total_clean_days * uh.cigarettes_per_day * uh.cost_per_cigarette)
FROM streaks s
JOIN user_habits uh ON uh.id = s.user_habit_id
JOIN habits h ON h.id = uh.habit_id
WHERE h.slug = 'smoking';
```

The backend runs this on startup and then refreshes every 60 minutes via a scheduled job. The result is stored in a `GlobalStatsCache` singleton bean.

---

<a name="section-10"></a>

## SECTION 10: Payments Architecture

### 10.1 Stripe Setup (Manual Steps)

1. Create a Stripe account at dashboard.stripe.com
2. Create a Product: Name "Sovereign Plan", description "Unlimited habits, unlimited accountability."
3. Create a Price on that product: Recurring, Monthly, ₹499/month (or $5.99 for USD). Note the `price_id`.
4. Set environment variable: `STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxx`
5. Configure Stripe Webhook in Dashboard → Webhooks → Add endpoint → URL: `https://your-backend.railway.app/api/webhooks/stripe` → Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
6. Note the Webhook Signing Secret → `STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx`

### 10.2 Checkout Session Flow

```
Frontend: POST /api/payments/checkout
  → Backend: PaymentService.createCheckoutSession(userId, successUrl, cancelUrl)
    → Stripe: retrieve or create Customer (by userId in metadata)
    → Stripe: create Session {
        customer: stripeCustomerId,
        mode: 'subscription',
        line_items: [{price: STRIPE_PREMIUM_PRICE_ID, quantity: 1}],
        metadata: {userId: userId},
        success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: cancelUrl
      }
    → Return: {url: session.url}
  ← Frontend: redirect to Stripe-hosted checkout page

User completes payment on Stripe → Stripe fires webhook
  → POST /api/webhooks/stripe (checkout.session.completed)
  → StripeWebhookService.handleCheckoutCompleted()
    → Extract userId from session.metadata
    → Upsert subscriptions table
    → UPDATE users SET premium_status = 'premium' WHERE id = userId

Frontend polls GET /api/payments/status until premium_status = 'premium'
→ Redirect to /dashboard with celebration animation
```

### 10.3 Webhook Event Handling

| Stripe Event                    | Handler Method              | Action                                            |
| ------------------------------- | --------------------------- | ------------------------------------------------- |
| `checkout.session.completed`    | `handleCheckoutCompleted`   | Upsert subscription, set premium_status='premium' |
| `customer.subscription.updated` | `handleSubscriptionUpdated` | Update status, period dates, cancel_at_period_end |
| `customer.subscription.deleted` | `handleSubscriptionDeleted` | Set premium_status='free', plan='free'            |
| `invoice.payment_failed`        | `handlePaymentFailed`       | Set status='past_due', send email notification    |

### 10.4 Premium Feature Gating

**Backend (Spring Boot):**

- `HabitService.addHabit()`: if habit count >= 1 and premium_status != 'premium', throw 402
- `FriendService.sendFriendRequest()`: if friend count >= 3 and premium_status != 'premium', throw 402
- Premium-only analytics endpoints return 402 for free users

**Frontend (Next.js):**

- `PremiumGate.tsx` component wraps premium features
- `useSubscriptionStatus()` hook checks `/api/payments/status` on mount
- Zustand store `useUserStore` holds `premiumStatus`
- On 402 response from any API call: show upsell modal

---

<a name="section-11"></a>

## SECTION 11: Security & Privacy

### 11.1 JWT Validation

Every Spring Boot endpoint (except `/api/health`, `/api/webhooks/stripe`, `/api/auth/*`) requires a valid Supabase-issued JWT:

1. `JwtAuthFilter` extracts `Authorization: Bearer <token>` header
2. Validates signature using Supabase JWT secret (HS256)
3. Validates `exp` claim (not expired)
4. Validates `iss` claim (matches Supabase project URL)
5. Extracts `sub` claim as userId (UUID string)
6. Sets `SecurityContextHolder` with userId

Any validation failure returns HTTP 401.

### 11.2 Rate Limiting

Implemented as a Spring Boot filter using an in-memory `ConcurrentHashMap` with sliding window counters:

| Endpoint                           | Limit                | Window                  |
| ---------------------------------- | -------------------- | ----------------------- |
| `POST /api/checkins`               | 10 per habit per day | 24 hours                |
| `POST /api/challenges`             | 5 per user           | 1 hour                  |
| `GET /api/challenges/*/upload-url` | 3 per challenge      | per challenge lifecycle |
| `POST /api/auth/*`                 | 10 per IP            | 1 hour                  |
| `GET /api/leaderboard/global`      | 10 per user          | 1 minute                |
| All other endpoints                | 100 per user         | 1 minute                |

Create `RateLimitFilter.java` in `security/` that intercepts all requests, checks counters, and returns HTTP 429 with `Retry-After` header if exceeded.

### 11.3 Image Upload Security

1. Signed URLs (5 min expiry) ensure only the challenge participant can upload
2. Supabase bucket policy restricts MIME types to `image/jpeg`, `image/png`, `image/webp`
3. Max file size: 10MB (enforced at bucket level)
4. File stored at randomized path (`challenges/{challengeId}/{uuid}.jpg`) — not guessable
5. RLS on `challenge_media` ensures only the two challenge parties can read media records
6. Public URL access to storage requires an authenticated Supabase request (bucket is private, not public)

### 11.4 GDPR / Data Deletion

`UserService.deleteUser(userId)`:

1. Delete all Supabase Storage files for this user (avatars, challenge media)
2. Anonymize challenge_media records (null out exif_raw, exif_gps)
3. Call `supabase.auth.admin.deleteUser(userId)` via admin API
4. All other data cascades via `ON DELETE CASCADE` foreign keys

User can trigger this from Settings → Danger Zone → "Delete my account and all data". Requires password confirmation. Processing time: immediate (synchronous cascade).

### 11.5 Supporter-Challenger Trust Model Abuse Prevention

1. **Consent-based:** Challenges can only be sent between accepted friends. No cold challenges.
2. **No anonymous challenges:** Challenger identity is always visible to challenged party.
3. **Rate limiting:** 5 challenges per hour per user prevents harassment.
4. **Block mechanism:** `friends.status = 'blocked'` — a blocked user cannot send challenges, friend requests, or view the blocker's profile.
5. **Challenge history is immutable:** Once recorded, challenge outcomes cannot be modified by either party.
6. **EXIF transparency:** The challenger sees exactly what the backend verified — no hidden manipulation of verification results.

---

<a name="section-12"></a>

## SECTION 12: Deployment

### 12.1 Vercel (Frontend)

**Environment Variables (set in Vercel dashboard):**

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

**Build Settings:**

- Framework: Next.js
- Build command: `next build`
- Output directory: `.next`
- Node.js version: 20.x

**`vercel.json`:**

```json
{
  "rewrites": [],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Service-Worker-Allowed", "value": "/" },
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### 12.2 Railway (Backend)

1. Create a Railway project
2. Connect GitHub repo
3. Set root directory to `backend/` (or project root if monorepo)
4. Railway auto-detects Dockerfile
5. Set environment variables in Railway dashboard (see `.env.example`)
6. Custom domain: `api.unshackled.app` → point to Railway service URL
7. Health check: `GET /api/health` with 30s timeout, 5s interval

**Environment Variables (Railway):**

```
SPRING_PROFILES_ACTIVE=prod
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_JDBC_URL=jdbc:postgresql://db.xxxx.supabase.co:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=xxxxx
SUPABASE_JWT_SECRET=xxxxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx
VAPID_PUBLIC_KEY=xxxxx
VAPID_PRIVATE_KEY=xxxxx
VAPID_SUBJECT=mailto:support@unshackled.app
RESEND_API_KEY=re_xxx
FRONTEND_URL=https://unshackled.app
```

### 12.3 Supabase Setup Checklist

- [ ] Create new Supabase project
- [ ] Run all CREATE TABLE SQL from Section 3 in SQL Editor
- [ ] Run all seed data inserts
- [ ] Enable RLS on all tables (already in schema)
- [ ] Create all RLS policies
- [ ] Enable Supabase Realtime for tables: `notifications`, `challenges`, `streaks`
- [ ] Create Storage bucket `avatars` (private, 5MB limit, image types only)
- [ ] Create Storage bucket `challenges` (private, 10MB limit, image types only)
- [ ] Get JWT Secret from Project Settings → API → JWT Secret
- [ ] Get service_role key for backend file downloads
- [ ] Enable Email Auth in Authentication → Providers
- [ ] Configure Auth email templates (confirm signup, reset password) with Unshackled branding

### 12.4 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: "21"
          distribution: "temurin"
      - name: Run tests
        run: cd backend && mvn test
      - name: Build
        run: cd backend && mvn package -DskipTests

  # Railway deploys automatically on push to main via GitHub integration
```

### 12.5 Environment Separation

| Environment | Frontend URL             | Backend URL               | Stripe    | Notes            |
| ----------- | ------------------------ | ------------------------- | --------- | ---------------- |
| `dev`       | `localhost:3000`         | `localhost:8080`          | Test keys | Local only       |
| `staging`   | `staging.unshackled.app` | `api-staging.railway.app` | Test keys | Preview deploys  |
| `prod`      | `unshackled.app`         | `api.unshackled.app`      | Live keys | Main branch only |

---

<a name="section-13"></a>

## SECTION 13: Master Build Order

> Build in this exact sequence to avoid dependency issues. Each step references its section. Do not skip steps.

---

### PHASE 1: Infrastructure Foundation

- [ ] **1. [S4 B-1]** Spring Boot project initialization — all dependencies, folder structure
- [ ] **2. [S4 B-2]** Spring Boot database configuration — Hikari, JdbcTemplate, health check
- [ ] **3. [S12]** Supabase project setup — create project, run all SQL schemas, seed data, enable RLS, configure storage buckets, enable Realtime
- [ ] **4. [S4 B-3]** Spring Boot security configuration — JWT filter, SecurityConfig, CorsConfig
- [ ] **5. [S4 B-4]** Spring Boot global exception handling — ApiError, GlobalExceptionHandler, custom exceptions
- [ ] **6. [S4 B-21]** Dockerfile, .dockerignore, railway.toml, HealthController

---

### PHASE 2: Core Backend Domains

- [ ] **7. [S4 B-5]** User domain — UserModel, DTOs, UserRepository, UserService, UserController
- [ ] **8. [S4 B-6]** Habit domain — HabitModel, UserHabitModel, DTOs, repositories, HabitService, HabitController
- [ ] **9. [S4 B-7]** Onboarding domain — OnboardingRequest, OnboardingService, OnboardingController
- [ ] **10. [S4 B-8]** Streak domain — StreakModel, StreakRepository, StreakService, StreakController
- [ ] **11. [S4 B-10]** XP domain — XpEventModel, XpRepository, LevelDefinition, XpService, XpController
- [ ] **12. [S4 B-11]** Badge domain — BadgeModel, UserBadgeModel, BadgeRepository, BadgeService, BadgeController
- [ ] **13. [S4 B-9]** Check-in domain — CheckInModel, DTOs, CheckInRepository, CheckInService (calls streak + XP + badge), CheckInController
- [ ] **14. [S4 B-15]** Content domain — withdrawal, dopamine, money, health milestone repositories and ContentService, ContentController
- [ ] **15. [S4 B-16]** Analytics domain — AnalyticsService (money saved, heatmap, global stats, dashboard summary), AnalyticsController
- [ ] **16. [S4 B-17]** Journal domain — JournalModel, DTOs, JournalRepository, JournalService, JournalController
- [ ] **17. [S4 B-18]** Leaderboard domain — LeaderboardEntry, LeaderboardService, LeaderboardController

---

### PHASE 3: Social & Challenge Backend

- [ ] **18. [S4 B-12]** Friends domain — FriendModel, DTOs, FriendRepository, FriendService (with tier gating), FriendController
- [ ] **19. [S4 B-13 T1-T5]** Challenge domain — models, DTOs, ChallengeRepository, ChallengeMediaRepository
- [ ] **20. [S4 B-13 T6]** SupabaseStorageService — signed URL generation
- [ ] **21. [S4 B-13 T7-T8]** ExifExtractionService — metadata-extractor integration, ExifResult DTO
- [ ] **22. [S4 B-13 T9-T14]** ChallengeService (full flow) + ChallengeController

---

### PHASE 4: Notifications & Payments Backend

- [ ] **23. [S4 B-14 T1-T4]** WebPushService — VAPID setup, PushSubscriptionRepository
- [ ] **24. [S4 B-14 T5-T6]** ResendEmailService — HTTP client, email templates
- [ ] **25. [S4 B-14 T7-T10]** NotificationService (full), NotificationRepository, PushSubscriptionController, NotificationController
- [ ] **26. [S4 B-19 T1-T5]** Payments domain — StripeConfig, SubscriptionRepository, PaymentService, PaymentController
- [ ] **27. [S4 B-19 T6-T9]** Stripe webhooks — StripeWebhookController, StripeWebhookService, tier gating checks

---

### PHASE 5: Scheduled Jobs

- [ ] **28. [S4 B-20]** All scheduled jobs — DailyReminderJob, WithdrawalWarningJob, WeeklyReportJob, ChallengeExpiryJob, SupporterNudgeJob, RelapseFollowUpJob

---

### PHASE 6: Frontend Foundation

- [ ] **29. [S5 F-1]** Next.js project init — dependencies, Tailwind, shadcn/ui, fonts, layout
- [ ] **30. [S5 F-2]** Supabase client setup — browser client, server client, middleware, auth hooks
- [ ] **31. [S5 F-3]** API client layer — all typed fetch wrappers for every backend endpoint
- [ ] **32. [S5 F-4]** Zustand stores — user, habit, notification, challenge, onboarding stores + StoreHydrator
- [ ] **33. [S5 F-18]** Zod validation schemas — auth, onboarding, profile, journal, challenge schemas
- [ ] **34. [S5 F-19]** Utility functions — date, money, habit, cn utilities

---

### PHASE 7: Three.js Animations

- [ ] **35. [S5 F-5 T1]** ThreeCanvas base wrapper component
- [ ] **36. [S5 F-5 T2]** OnboardingCompleteAnimation — golden nova particles
- [ ] **37. [S5 F-5 T3]** StreakMilestoneAnimation — aurora ribbons with day count
- [ ] **38. [S5 F-5 T4]** ChallengeReceivedAnimation — pulsing blue orb
- [ ] **39. [S5 F-5 T5]** RelapseRecoveryAnimation — brightening warm sphere
- [ ] **40. [S5 F-5 T6]** AnimationController — context, queue management

---

### PHASE 8: Authentication Pages

- [ ] **41. [S5 F-6]** Auth layout, login page, signup page, reset password page, update password page

---

### PHASE 9: Onboarding Pages

- [ ] **42. [S5 F-7 T1-T3]** Onboarding layout, router, dynamic step handler
- [ ] **43. [S5 F-7 T4-T5]** Welcome/Supporter choice + Habit Picker step
- [ ] **44. [S5 F-7 T6-T13]** All habit config steps (smoking, drinking, vaping, porn, social media, sugar, gambling, custom)
- [ ] **45. [S5 F-7 T14-T17]** Quit date step, Supporter setup step, OnboardingProgressBar, useOnboardingNavigation hook
- [ ] **46. [S5 F-7 T18]** Onboarding complete page — submit + play animation + redirect

---

### PHASE 10: Core App Pages

- [ ] **47. [S5 F-8 T1-T3]** App shell layout, Dashboard page (server), DashboardHeader
- [ ] **48. [S5 F-8 T4-T6]** StreakCard, CheckInButton, SlipFlow modal
- [ ] **49. [S5 F-8 T7-T9]** MoneyPanel, MoneySuggestion, HealthTimeline
- [ ] **50. [S5 F-8 T10-T13]** WithdrawalMessage, DopamineSuggestions, XPBar, GlobalStatsBar

---

### PHASE 11: Social Pages

- [ ] **51. [S5 F-9 T1-T5]** Friends page, FriendCard, SendChallengeModal, PendingRequestCard, AddFriendSearch
- [ ] **52. [S5 F-9 T6-T9]** FriendLeaderboard, ChallengeHistoryList, ChallengeResponseModal (camera), ChallengeReviewModal (EXIF display)

---

### PHASE 12: Profile, Settings, Analytics, Journal, Premium Pages

- [ ] **53. [S5 F-10]** Profile page, ProfileHeader, BadgeGrid, HabitStreakList, Settings page, AvatarUpload, NotificationPreferences
- [x] **54. [S5 F-11]** Analytics page, HeatmapCalendar, MoneySavedChart, StreakStatsCard, MoodTrendChart
- [ ] **55. [S5 F-12]** Journal page, MoodPicker, JournalEditor (with localStorage draft), JournalEntryCard, SharedEntriesView
- [ ] **56. [S5 F-13]** Premium page, PricingTable, useCheckout hook, success page, cancelled page, ManageSubscription

---

### PHASE 13: Reusable Components & Landing

- [ ] **57. [S5 F-15]** All reusable UI components — LoadingState, EmptyState, HabitIcon, StreakBadge, NotificationBell, NotificationDropdown, AppNav, BottomNav, CurrencyDisplay, PremiumGate
- [ ] **58. [S5 F-14]** Landing page — layout, HeroSection (with Three.js BG), HowItWorks, SocialProof, Science, LandingNav

---

### PHASE 14: Realtime, Push Notifications, Integration

- [ ] **59. [S5 F-16]** Service worker (sw.js), pushNotifications lib, usePushNotifications hook, auto-setup in app layout
- [ ] **60. [S5 F-17]** Realtime hooks — useRealtimeNotifications, useRealtimeChallenges, useRealtimeFriendActivity, RealtimeProvider

---

### PHASE 15: Testing, Polish, Deploy

- [ ] **61. [S12]** Deploy Spring Boot backend to Railway — set all env vars, verify health endpoint
- [ ] **62. [S12]** Deploy Next.js frontend to Vercel — set all env vars, verify middleware
- [ ] **63. [S12]** Stripe webhook endpoint registration and end-to-end payment test
- [ ] **64. [S6]** End-to-end push notification test — subscribe, send challenge, verify notification received
- [ ] **65. [S7]** End-to-end challenge flow test — send, upload, EXIF verify, approve/reject
- [ ] **66.** Accessibility audit — keyboard navigation, ARIA labels, color contrast
- [ ] **67.** Mobile responsiveness audit — test all pages at 375px and 768px breakpoints
- [ ] **68.** Performance audit — Lighthouse score target: 90+ on all pages
- [ ] **69.** Security audit — test JWT rejection on all endpoints, test RLS policies, test rate limiting

---

<a name="section-14"></a>

## SECTION 14: What Makes This Different

There are approximately four thousand apps in the App Store that claim to help you quit smoking. Almost all of them are identical: a streak counter, some tips, maybe a badge for Day 7. They are built by people who understand app mechanics, but not addiction.

Unshackled is built by starting with the neuroscience and working backwards to the product.

Here is the thing nobody tells you when you quit: the hardest days are not random. They are predictable, almost to the hour. Day 3 of nicotine abstinence is when your blood nicotine hits zero and your dopamine receptors — which have been suppressed by years of artificial stimulation — have not yet upregulated. You feel a specific kind of dread on Day 3 that is unlike ordinary sadness. It feels like doom. Like you made a mistake. Like something is wrong with you. It is not. It is a withdrawal symptom. It has a name. It has a duration. It ends.

Every other app lets Day 3 sneak up on you. Unshackled calls it by name at 8:30 in the morning before it even arrives.

That is the emotional design philosophy: anticipatory empathy. Not reactive sympathy. We do not send a recovery message after you slip. We send a preemptive message before the slip is most likely. We say, "Today is going to be hard. Here is why. Here is what is happening in your brain right now. Here is what actually works." That is the difference between a productivity tool and a companion.

The gamification is not superficial. XP and streaks work because they exploit the same mesolimbic dopamine pathway that the addictive substance was exploiting — just without the harm. When you see your streak count hit Day 30 and a golden aurora animation fills your screen, your brain releases dopamine. That is not metaphorical. That is neurochemistry. We are deliberately creating a healthier addiction: an addiction to your own progress.

The money math is not about guilt. It is about possibility. Smokers in India spend ₹3,000–5,000 per month on cigarettes. That is 36,000–60,000 rupees per year. That is a road trip. That is a MacBook. That is three months of rent. Nobody tells you this in a way that feels real. Unshackled does not say "You spent ₹36,000 on cigarettes last year." It says "You've saved ₹3,200 this month. That's a road trip to Coorg." One is a judgment. The other is a dream.

The social accountability layer is the product's most defensible moat. Users who have friends on the platform churn at a fraction of the rate of solo users. The challenge system — where a friend can request real-time photo proof that you're clean — sounds invasive until you understand the consent model. You opted in. Your friend cares enough to ask. The friction of having to respond to a challenge is, neurologically, a social accountability intervention. It is the digital equivalent of your sponsor calling you on a hard night. It works.

We built the "supporter" path because recovery is never solo. Every addict has people who love them and feel helpless. Unshackled gives those people a role. Not as monitors. As team members. They get a weekly summary. They can send encouragement. They can send challenges. They are part of the journey.

The UX principle that no shame language can ever appear in this application is not a soft preference — it is a load-bearing architectural constraint. Shame is a documented barrier to treatment-seeking in addiction research. It increases relapse risk. It is the reason people hide their struggles rather than getting support. We will not be another source of shame in a recovering person's life. Ever. The copy is reviewed for shame language the way security code is reviewed for vulnerabilities: systematically, mercilessly, at every layer.

Unshackled is not an app that helps you quit. It is a platform that makes quitting feel like the most important and rewarding game you have ever played — because it is. The stakes are your health, your money, your relationships, and potentially your life. The least we can do is make the interface worthy of that.

---

_End of architecture.md. Total sections: 14. Backend tasks: 121. Frontend tasks: 142. Master build phases: 15 phases, 69 steps._

_This document is the north star. Build one task at a time. Check the box. Move forward._
