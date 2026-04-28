
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

```

---

### 3.2 `habits`

> Seed table â€” predefined habit types. Not user-created. Managed by admin.

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
  ('smoking',        'Smoking',             'ðŸš¬', 1),
  ('drinking',       'Drinking',            'ðŸº', 2),
  ('vaping',         'Vaping',              'ðŸ’¨', 3),
  ('chewing_tobacco','Chewing Tobacco',     'ðŸŒ¿', 4),
  ('pornography',    'Pornography',         'ðŸ”ž', 5),
  ('social_media',   'Social Media',        'ðŸ“±', 6),
  ('sugar_junk_food','Sugar & Junk Food',   'ðŸ©', 7),
  ('gambling',       'Gambling',            'ðŸŽ°', 8),
  ('custom',         'Custom Habit',        'âœï¸', 9);
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

> Seed table â€” predefined badges.

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
  ('money_saver_1k',    'Saver',                 'Saved your first â‚¹1,000.',                      'common',    50,  'money_saved', 1000),
  ('money_saver_10k',   'Smart Money',           'Saved â‚¹10,000. That''s a real number.',         'rare',      200, 'money_saved', 10000),
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

> Seed table â€” medical/scientific recovery timeline data per habit.

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
  ('<smoking-uuid>', 14,  'Lungs waking up',       'Cilia in your lungs are regenerating. You may cough more â€” that is healing, not harm.'),
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

---


---

### 4. Ultimate Content Seeds

```sql
-- 4.1 Dopamine Suggestions (Curated by Category)
DELETE FROM dopamine_suggestions;
INSERT INTO dopamine_suggestions (suggestion, category, habit_slugs, difficulty) VALUES
  ('Take a 5-minute ice-cold shower to trigger a massive natural dopamine spike.', 'physical', '{smoking,drinking,pornography,gambling}', 'hard'),
  ('Go for a 15-minute run. The "runner''s high" is a real biochemical reset.', 'physical', '{smoking,vaping,sugar_junk_food}', 'medium'),
  ('Practice 4-7-8 breathing: In for 4, hold for 7, exhale for 8. Repeat 4 times.', 'mindfulness', '{smoking,vaping,social_media}', 'easy'),
  ('Call a person you haven''t spoken to in a month just to say hi.', 'social', '{social_media,pornography}', 'medium'),
  ('Eat a small piece of 85%+ dark chocolate. It triggers endorphins without the sugar crash.', 'physical', '{sugar_junk_food,drinking}', 'easy'),
  ('Do a "Digital Sunset": Turn off all screens and read a physical book for 20 mins.', 'mindfulness', '{social_media,pornography}', 'medium'),
  ('Clean your immediate workspace. A clean environment reduces cortisol and anxiety.', 'creative', '{gambling,social_media}', 'easy'),
  ('Listen to one high-energy song and dance like nobody is watching.', 'creative', '{drinking,smoking}', 'easy'),
  ('Learn 5 new words in a foreign language.', 'creative', '{social_media}', 'easy'),
  ('Solve a challenging Sudoku or crossword puzzle.', 'creative', '{gambling,pornography}', 'medium');

-- 4.2 Withdrawal Messages & Health Milestones (Habit-Specific)
-- We use a script to match slugs to IDs dynamically
DO $$
DECLARE
    smoking_id UUID := (SELECT id FROM habits WHERE slug = 'smoking');
    drinking_id UUID := (SELECT id FROM habits WHERE slug = 'drinking');
    vaping_id UUID := (SELECT id FROM habits WHERE slug = 'vaping');
    social_id UUID := (SELECT id FROM habits WHERE slug = 'social_media');
    porn_id UUID := (SELECT id FROM habits WHERE slug = 'pornography');
    sugar_id UUID := (SELECT id FROM habits WHERE slug = 'sugar_junk_food');
    gambling_id UUID := (SELECT id FROM habits WHERE slug = 'gambling');
BEGIN
    -- SMOKING
    INSERT INTO withdrawal_messages (habit_id, day_offset, message) VALUES
        (smoking_id, 0, 'Your lungs are already starting to clear. The carbon monoxide in your blood is dropping.'),
        (smoking_id, 3, 'Peak Nicotine Withdrawal. Your brain is begging for a fix—don''t give in. It lasts only 3-5 minutes.'),
        (smoking_id, 7, 'Your sense of taste and smell are returning. Food will taste incredible today.'),
        (smoking_id, 14, 'Cilia in your lungs are growing back. If you are coughing, it is a sign of healing.'),
        (smoking_id, 30, 'Your lung capacity has increased by up to 30%. Breathe deep, you earned it.');

    INSERT INTO health_milestones (habit_id, day_offset, title, description) VALUES
        (smoking_id, 1, 'CO Levels Normal', 'Carbon monoxide levels in your blood have dropped to normal.'),
        (smoking_id, 2, 'Nerve Endings Regrow', 'Your ability to smell and taste is enhanced as nerve endings start to regrow.'),
        (smoking_id, 3, 'Breathing Easier', 'Your bronchial tubes have started to relax, making breathing easier and increasing energy levels.'),
        (smoking_id, 14, 'Circulation Improving', 'Blood flow to your hands and feet has improved significantly. Your lungs are starting to clear out mucus.'),
        (smoking_id, 30, 'Lungs Regenerating', 'Cilia (tiny hair-like structures) in your lungs have started to regrow, helping to clean the lungs and reduce infection risk.'),
        (smoking_id, 90, 'Circulation Improved', 'Walking becomes easier and your lung function increases significantly.'),
        (smoking_id, 180, 'Coughing Decreased', 'The smoker''s cough and shortness of breath have decreased significantly as lung function continues to improve.'),
        (smoking_id, 365, 'Heart Risk Halved', 'Your risk of coronary heart disease is now half that of someone who still smokes.');

    -- DRINKING
    INSERT INTO withdrawal_messages (habit_id, day_offset, message) VALUES
        (drinking_id, 0, 'Your liver is beginning to process out the toxins. Stay hydrated with water and electrolytes.'),
        (drinking_id, 3, 'Anxiety might be high today as your GABA receptors adjust. This is temporary.'),
        (drinking_id, 7, 'Your REM sleep is stabilizing. You''ll wake up feeling truly rested for the first time.'),
        (drinking_id, 30, 'Liver fat has reduced by up to 15%. Your skin looks clearer and your eyes brighter.');

    -- SOCIAL MEDIA / PORNOGRAPHY (Dopamine focused)
    INSERT INTO withdrawal_messages (habit_id, day_offset, message) VALUES
        (social_id, 1, 'Silence is loud right now. Your brain is looking for a notification "hit". Stay strong.'),
        (social_id, 7, 'Your attention span is expanding. Try reading a long article or book today.'),
        (porn_id, 14, 'The "fog" is lifting. You are starting to see the world with more clarity and real emotion.'),
        (porn_id, 90, 'Reboot Complete. Your dopamine receptors are nearing baseline. Real life feels vibrant again.');

    -- SUGAR
    INSERT INTO withdrawal_messages (habit_id, day_offset, message) VALUES
        (sugar_id, 3, 'The "Sugar Flu". You might feel tired or headachy. Your body is switching to fat-burning mode.'),
        (sugar_id, 10, 'Cravings are subsiding. You no longer need a sweet treat to feel normal.');

    -- MONEY SUGGESTIONS (Contextual rewards for India)
    INSERT INTO money_suggestions (country_code, amount_min, amount_max, suggestion, category) VALUES
        ('IN', 0, 100, 'A hot cup of filter coffee!', 'Food'),
        ('IN', 101, 500, 'A delicious Masala Dosa and some sweets.', 'Food'),
        ('IN', 501, 1500, 'A movie ticket with popcorn for you and a friend.', 'Entertainment'),
        ('IN', 1501, 3000, 'A nice dinner for two at a good restaurant.', 'Food'),
        ('IN', 3001, 6000, 'A high-quality pair of running shoes.', 'Fitness'),
        ('IN', 6001, 12000, 'A weekend getaway to a nearby hill station.', 'Travel'),
        ('IN', 12001, 25000, 'A mid-range smartphone or a tablet.', 'Tech'),
        ('IN', 25001, 50000, 'A premium smartwatch or a domestic flight trip.', 'Lifestyle'),
        ('IN', 50001, 80000, 'The latest iPhone or a high-end work laptop.', 'Tech'),
        ('IN', 80001, 150000, 'A week-long international trip to Thailand or Vietnam.', 'Travel'),
        ('IN', 150001, 300000, 'A down payment for a brand new car.', 'Lifestyle'),
        ('IN', 300001, 600000, 'A premium Royal Enfield or a major home renovation.', 'Lifestyle'),
        ('IN', 600001, 1000000, 'A complete debt-free milestone or a significant investment portfolio.', 'Finance'),
        ('IN', 1000001, 5000000, 'A down payment for your dream home.', 'Finance');

END $$;
```
