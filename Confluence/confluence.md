Unshackled
Project Overview:
Unshackled is a gamified, socially accountable, emotionally intelligent web platform designed to
help people quit bad habits — smoking, drinking, vaping, pornography, social media, sugar/junk
food, gambling, and custom habits.
Technical Stack
Backend: Spring Boot 3.x (Java 21), Supabase PostgreSQL, JWT auth, JDBC (JdbcTemplate)
Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Three.js, Zustand, shadcn/ui
Infrastructure: Supabase (Auth, DB, Storage, Realtime), Stripe (payments), Resend (email),
Web Push (VAPID), Docker/Railway (backend), Vercel (frontend)
Key Features
Multi-habit tracking with daily check-ins (clean/slipped) and event-sourced streak
computation — the streak is always recalculated from raw check-in history, never just
incremented.
Proof-of-life photo challenges — friends can challenge each other for real-time photo proof
of sobriety. Photos are EXIF-timestamp-verified server-side using the metadataextractor library. The challenged user must take a live photo within a 10-minute window.
Gamification engine — 20 levels (Spark → Unshackled at 75,000 XP), 15+ badges (from
"Day One" to "Year One Legend"), XP for check-ins, journaling, challenges, and streak
milestones. Friend and global leaderboards.
Money savings calculator — computes money saved based on habit-specific configs
(cigarettes/day × cost, drinks/week × session cost, etc.) and maps saved amounts to
culturally resonant, country-aware suggestions like "₹3,200 saved — that's a road trip to
Coorg."₹3,200 saved — that's a road trip to Coorg.”
Health recovery timeline — science-backed health milestones per habit (e.g., Day 3: nicotine
fully out of body; Day 14: lung cilia regenerating; Day 90: dopamine receptors near baseline).
Withdrawal empathy system — preemptive, day-specific emotional support messages
delivered before hard days strike. Day 3 for nicotine, Days 2–4 for alcohol, and so on. These
are served proactively, not reactively.
Dopamine substitution suggestions — rotating suggestions for healthy reward-circuit
stimulation (physical, social, creative, mindfulness categories).
Journal with mood tracking — daily entries, mood scores (1–10), trigger identification, "what
helped" tracking, and optional sharing with friends.
Push notifications + email — daily reminders, weekly reports, milestone celebrations,
challenge alerts, relapse recovery support, and friend activity nudges. All gated by per-user
notification preferences.
Stripe payments for the "Sovereign Plan" (₹499/month premium tier) — unlocks unlimited
habits, unlimited friends, and advanced analytics. Includes Stripe Checkout, Customer Portal,
and webhook handling.
Supporter role — a dedicated path for friends/family who want to support someone's
recovery without tracking their own habit. They get weekly summaries and can send
encouragement and challenges.
Three.js emotional animations — full-screen celebration moments for onboarding
completion, streak milestones, challenge receipt, and relapse recovery. Each animation is
designed as a dopamine-calibrated reward.
Design Philosophy
Built on four pillars of behavioral science:

1. The Dopamine Gap — recognizing that addictive behaviors hijack the brain's reward
   pathway, so the app deliberately creates healthier dopamine sources (XP, streaks, badges,
   animations).
2. Gamification doubles abstinence — backed by a 2024 meta-analysis (RR 2.12), every
   gamification element has documented behavioral support.
3. Social accountability is the #1 predictor — the friend challenge system is a consent-based,
   opt-in trust ritual, not surveillance.
4. Recovery has a timeline — users deserve to know exactly what's happening in their body
   day by day.
   A non-negotiable principle: no shame language, ever. No red Xs, no "you failed," no guilt. Every
   slip is met with warmth, neuroscience, and a forward-looking prompt. The copy voice writes like
   "a compassionate friend who happens to have a PhD in neuroscience."
   Current Status
   The backend (Spring Boot) is fully built across 20 steps covering all domains (users, habits,
   streaks, check-ins, XP/badges, friends, challenges with EXIF verification,
   notifications/push/email, content, analytics, journal, leaderboard, Stripe payments, and
   scheduled jobs). The frontend (Next.js) is largely incomplete across 19 steps with a multiple
   remaining tasks (money time-series chart, journal page, settings, reusable UI components,
   landing page, realtime hooks, push notification setup, and deployment).
   Deployment config (Docker, CI/CD) is deferred for production readiness.
   As someone who is trying to quit, I am hoping this is a solution that might work.
   Backend:
   Auth Controller
   Login (Supabase Proxy)
   Request URL:
   Response
   1 POST: {{baseUrl}}/auth/login
   1 {
   2 "access_token":
   "eyJhbGciOiJFUzI1NiIsImtpZCI6IjFmZmY4NDFlLTgxOWMtNDhlOC1hYmUzLTNkYz
   c3YjEzZGUzOCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2hkdWlteGxqZ3By
   d21hc2RrZXRsLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyNDE3MzViNS1mZTQ
   5LTRlOWEtYWY5ZS1iYTZmYzQyZDdkYzUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZX
   hwIjoxNzc3MTg0MTc3LCJpYXQiOjE3NzcxODA1NzcsImVtYWlsIjoiMTIzNEBjb20uY
   29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIs
   InByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6IjE
   yMzRAY29tLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZC
   I6ZmFsc2UsInN1YiI6IjI0MTczNWI1LWZlNDktNGU5YS1hZjllLWJhNmZjNDJkN2RjN
   SJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1l
   dGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzc3MTgwNTc3fV0sInNlc3Npb25
   faWQiOiIyNTVjNTEyZC1iYjIwLTQ3NzYtOGU0ZS0yZDM0MGE2ZjYyMjMiLCJpc19hbm
   9ueW1vdXMiOmZhbHNlfQ.yQDEKcV91U0DA54QHiNpwEnrpDioUdUKIHjNyEsp0qjrxO
   cjf20Y9G1thU_5nckMchg5q4Qt5tBcviNkO9WimQ",
   3 "token_type": "bearer",
   4 "expires_in": 3600,
   5 "expires_at": 1777184177,
   6 "refresh_token": "77n2gjpqw4gb",
   7 "user": {
   8 "id": "241735b5-fe49-4e9a-af9e-ba6fc42d7dc5",
   9 "aud": "authenticated",
   10 "role": "authenticated",
   11 "email": "1234@com.com",
   12 "email_confirmed_at": "2026-04-26T04:34:50.156677Z",
   13 "phone": "",
   14 "confirmed_at": "2026-04-26T04:34:50.156677Z",
   15 "last_sign_in_at": "2026-04-26T05:16:17.97176221Z",
   16 "app_metadata": {
   17 "provider": "email",
   18 "providers": [
   19 "email"
   20 ]
   21 },
   22 "user_metadata": {
   23 "email": "1234@com.com",
   24 "email_verified": true,
   25 "phone_verified": false,
   Create New User
   Request URL:
   Payload:
   Response
   26 "sub": "241735b5-fe49-4e9a-af9e-ba6fc42d7dc5"
   27 },
   28 "identities": [
   29 {
   30 "identity_id": "4a5c4ac0-c26c-4aa8-9475-
   595a92d1f76b",
   31 "id": "241735b5-fe49-4e9a-af9e-ba6fc42d7dc5",
   32 "user_id": "241735b5-fe49-4e9a-af9e-ba6fc42d7dc5",
   33 "identity_data": {
   34 "email": "1234@com.com",
   35 "email_verified": false,
   36 "phone_verified": false,
   37 "sub": "241735b5-fe49-4e9a-af9e-ba6fc42d7dc5"
   38 },
   39 "provider": "email",
   40 "last_sign_in_at": "2026-04-26T04:34:50.152398Z",
   41 "created_at": "2026-04-26T04:34:50.152455Z",
   42 "updated_at": "2026-04-26T04:34:50.152455Z",
   43 "email": "1234@com.com"
   44 }
   45 ],
   46 "created_at": "2026-04-26T04:34:50.116138Z",
   47 "updated_at": "2026-04-26T05:16:17.974186Z",
   48 "is_anonymous": false
   49 },
   50 "weak_password": null
   51 }
   1 POST: {{baseUrl}}/auth/register
   1 {
   2 "email": "tester@example.com",
   3 "password": "password123",
   4 "username": "tester_1",
   5 "displayName": "Tester One",
   6 "isSupporter": true,
   7 "country": "US",
   8 "currency": "USD"
   9 }
   1 {
   2 "access_token":
   "eyJhbGciOiJFUzI1NiIsImtpZCI6IjFmZmY4NDFlLTgxOWMtNDhlOC1hYmUzLTNkYz
   c3YjEzZGUzOCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2hkdWlteGxqZ3By
   d21hc2RrZXRsLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3Mzg2ZTUxYS1lYTh
   kLTRmNTgtODYxZi1hOGQxM2MyMTY0NjciLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZX
   hwIjoxNzc3MTkzODEzLCJpYXQiOjE3NzcxOTAyMTMsImVtYWlsIjoidGVzdGVyQGV4Y
   W1wbGUuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJl
   bWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWF
   pbCI6InRlc3RlckBleGFtcGxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG
   9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjczODZlNTFhLWVhOGQtNGY1OC04NjFmL
   WE4ZDEzYzIxNjQ2NyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEi
   LCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzc3MTkwMjE
   Users Controller
   Create User Profile (Run first for new accounts)
   Request URL:
   Payload:
   zfV0sInNlc3Npb25faWQiOiIzNWYzMTE0ZS1iZGZhLTRkMzctYWI1Yy1kMWQzODIzMz
   BiNWYiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.KUOjgkG89P_a02xYLVbIVUGIW8kE_i
   Q5gxbZCQWtzX9VW0EKval6EhKd0IFdsBX1heh07iZgitVJkqKA47cDTA",
   3 "token_type": "bearer",
   4 "expires_in": 3600,
   5 "expires_at": 1777193813,
   6 "refresh_token": "htpm5peerajo",
   7 "user": {
   8 "id": "7386e51a-ea8d-4f58-861f-a8d13c216467",
   9 "aud": "authenticated",
   10 "role": "authenticated",
   11 "email": "tester@example.com",
   12 "email_confirmed_at": "2026-04-26T07:56:53.691028531Z",
   13 "phone": "",
   14 "last_sign_in_at": "2026-04-26T07:56:53.698098828Z",
   15 "app_metadata": {
   16 "provider": "email",
   17 "providers": [
   18 "email"
   19 ]
   20 },
   21 "user_metadata": {
   22 "email": "tester@example.com",
   23 "email_verified": true,
   24 "phone_verified": false,
   25 "sub": "7386e51a-ea8d-4f58-861f-a8d13c216467"
   26 },
   27 "identities": [
   28 {
   29 "identity_id": "9c6e9e5d-7d9d-41d1-8c15-
   7c4cb88703ec",
   30 "id": "7386e51a-ea8d-4f58-861f-a8d13c216467",
   31 "user_id": "7386e51a-ea8d-4f58-861f-a8d13c216467",
   32 "identity_data": {
   33 "email": "tester@example.com",
   34 "email_verified": true,
   35 "phone_verified": false,
   36 "sub": "7386e51a-ea8d-4f58-861f-a8d13c216467"
   37 },
   38 "provider": "email",
   39 "last_sign_in_at": "2026-04-
   26T07:56:53.687192729Z",
   40 "created_at": "2026-04-26T07:56:53.687238Z",
   41 "updated_at": "2026-04-26T07:56:53.687238Z",
   42 "email": "tester@example.com"
   43 }
   44 ],
   45 "created_at": "2026-04-26T07:56:53.675448Z",
   46 "updated_at": "2026-04-26T07:56:53.701787Z",
   47 "is_anonymous": false
   48 }
   49 }
   1 {{baseUrl}}/users
   Authorization: Bearer token from Login API response
   Response
   Update Profile
   Request URL:
   Payload:
   Authorization: Bearer token from Login API response
   Response
   1 {
   2 "username": "recovery_pro",
   3 "displayName": "Master Warrior",
   4 "bio": "Recovery advocate since 2026.",
   5 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
   seed=Felix",
   6 "country": "IN",
   7 "currency": "INR",
   8 "isSupporter": false,
   9 "leaderboardOptIn": true
   10 }
   1 {
   2 "id": "629d7989-2318-4f1d-be03-ebaee47e6fcc",
   3 "username": "recovery_pro",
   4 "displayName": "Master Warrior",
   5 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
   seed=Felix",
   6 "bio": "Recovery advocate since 2026.",
   7 "country": "IN",
   8 "currency": "INR",
   9 "isSupporter": false,
   10 "onboardingCompleted": false,
   11 "quitDate": null,
   12 "premiumStatus": "free",
   13 "leaderboardOptIn": true,
   14 "createdAt": "2026-04-26T05:41:20.724552Z"
   15 }
   1 PATCH: {{baseUrl}}/users/me
   1 {
   2 "displayName": "Recovering Pro",
   3 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
   seed=Updated",
   4 "bio": "Sharing my journey to stay accountable.",
   5 "country": "US",
   6 "currency": "USD",
   7 "notificationPrefs": "{\"daily_reminder\": true,
   \"weekly_report\": true}",
   8 "dailyReminderTime": "09:30:00",
   9 "leaderboardOptIn": true
   10 }
   1 {
   Get My Profile
   Request URL:
   Payload:
   Authorization: Bearer token from Login API response
   Response
   Get Public Profile
   Request URL:
   Payload:
   2 "id": "629d7989-2318-4f1d-be03-ebaee47e6fcc",
   3 "username": "recovery_pro",
   4 "displayName": "Recovering Pro",
   5 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
   seed=Updated",
   6 "bio": "Sharing my journey to stay accountable.",
   7 "country": "US",
   8 "currency": "USD",
   9 "isSupporter": false,
   10 "onboardingCompleted": false,
   11 "quitDate": null,
   12 "premiumStatus": "free",
   13 "leaderboardOptIn": true,
   14 "createdAt": "2026-04-26T05:41:20.724552Z"
   15 }
   1 GET: {{baseUrl}}/users/me
   1 none
   1 {
   2 "id": "629d7989-2318-4f1d-be03-ebaee47e6fcc",
   3 "username": "recovery_pro",
   4 "displayName": "Recovering Pro",
   5 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
   seed=Updated",
   6 "bio": "Sharing my journey to stay accountable.",
   7 "country": "US",
   8 "currency": "USD",
   9 "isSupporter": false,
   10 "onboardingCompleted": false,
   11 "quitDate": null,
   12 "premiumStatus": "free",
   13 "leaderboardOptIn": true,
   14 "createdAt": "2026-04-26T05:41:20.724552Z"
   15 }
   1 GET: {{baseUrl}}/users/{{username}}
   Authorization: Bearer token from Login API response
   Response
   Delete My Account
   Request URL:
   Payload:
   Authorization: Bearer token from Login API response
   Response
   Onboarding & Habits Controller
   Get Onboarding Status
   Request URL:
   Payload:
   1 none
   1 {
   2 "id": "629d7989-2318-4f1d-be03-ebaee47e6fcc",
   3 "username": "recovery_pro",
   4 "displayName": "Recovering Pro",
   5 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
   seed=Updated",
   6 "bio": "Sharing my journey to stay accountable.",
   7 "country": "US",
   8 "currency": "USD",
   9 "isSupporter": false,
   10 "onboardingCompleted": false,
   11 "quitDate": null,
   12 "premiumStatus": "free",
   13 "leaderboardOptIn": true,
   14 "createdAt": "2026-04-26T05:41:20.724552Z"
   15 }
   1 DELETE: {{baseUrl}}/users/me
   1 none
   1 {
   2 "message": "User @warrior_one (ID: 241735b5-fe49-4e9a-af9eba6fc42d7dc5) has been successfully deleted.",
   3 "status": "success"
   4 }
   1 GET: {{baseUrl}}/onboarding/status
   1 none
   Authorization: Bearer token from Login API response
   Response:
   Complete Onboarding
   Request URL:
   Authorization: Bearer token from Login API response
   Case 1 Payload (When more then 1 habit is entered):
   Payload
   Response
   1 {
   2 "onboardingCompleted": false
   3 }
   1 POST: {{baseUrl}}/onboarding/complete
   1 {
   2 "displayName": "Onboarded User",
   3 "country": "IN",
   4 "currency": "INR",
   5 "isSupporter": false,
   6 "quitDate": "2026-04-20",
   7 "habits": [
   8 {
   9 "habitId": "smoking",
   10 "quitDate": "2026-04-20",
   11 "cigarettesPerDay": 20,
   12 "costPerCigarette": 15.5
   13 },
   14 {
   15 "habitId": "drinking",
   16 "quitDate": "2026-04-22",
   17 "drinksPerWeek": 5,
   18 "costPerSession": 1200
   19 },
   20 {
   21 "habitId": "vaping",
   22 "quitDate": "2026-04-24",
   23 "podsPerWeek": 2,
   24 "podCost": 450
   25 },
   26 {
   27 "habitId": "social-media",
   28 "quitDate": "2026-04-25",
   29 "hoursPerDay": 4.5,
   30 "platforms": ["Instagram", "TikTok"]
   31 }
   32 ]
   33 }
   1 {
   2 "status": 402,
   3 "error": "Payment Required",
   Case 2 Payload (When only 1 habit is entered):
   Payload
   Response
   Get Habit Catalog
   Request URL:
   Payload:
   Authorization: Bearer token from Login API response
   Response
   4 "message": "Free tier users can only track one active habit.
   Please upgrade to Sovereign premium for unlimited habits.",
   5 "timestamp": "2026-04-26T05:53:00.190448500Z"
   6 }
   1 {
   2 "displayName": "Onboarded User",
   3 "country": "IN",
   4 "currency": "INR",
   5 "isSupporter": false,
   6 "quitDate": "2026-04-20",
   7 "habits": [
   8 {
   9 "habitId": "drinking",
   10 "quitDate": "2026-04-22",
   11 "drinksPerWeek": 5,
   12 "costPerSession": 1200
   13 }
   14 ]
   15 }
   1 {
   2 "message": "Onboarding completed successfully"
   3 }
   1 GET: {{baseUrl}}/habits
   1 None
   1 [
   2 {
   3 "id": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
   4 "slug": "smoking",
   5 "displayName": "Smoking",
   6 "icon": "ðŸš¬",
   7 "description": null,
   8 "sortOrder": 1,
   9 "createdAt": "2026-04-26T03:41:36.113327Z"
   10 },
   11 {
   12 "id": "5223174f-a3ed-426f-b0a0-76281f25a3d5",
   13 "slug": "drinking",
   1
   4
   "
   d
   i
   s
   p
   l
   a
   y
   N
   a
   m
   e
   ": "
   D
   r
   i
   n
   k
   i
   n
   g
   ", 15 "icon": "ðŸ º", 16 "description": null, 17 "sortOrder": 2, 18 "createdAt": "2026-04-26T0
   3:4
   1:3
   6.1
   1
   3
   3
   2
   7
   Z
   "
   1
   9
   }, 20 { 21
   "
   i
   d
   ": "
   f
   f
   1
   0
   4
   8
   0
   a

- a
  9
  9
  b
- 4
  6
  6
  3
- 8
  8
  4
  4
- 9
  5
  7
  9
  3
  c
  0
  1
  d
  7
  d
  6
  ", 22 "slug": "vaping", 23 "displayName": "Vaping", 24 "icon": "ðŸ’¨", 25 "description": null, 26 "sortOrder": 3, 27 "createdAt": "2026-04-26T03:41:36.113327Z" 28 }, 29 { 30 "id": "3073c4b5-960c-424c-9e6f-e8bfcb49dd3d", 31 "slug": "chewing_tobacco", 32 "displayName": "Chewing Tobacco", 33 "icon": "ðŸŒ¿", 34 "description": null, 35 "sortOrder": 4, 36 "createdAt": "2026-04-26T03:41:36.113327Z" 37 }, 38 { 39 "id": "86d1f5b6-faba-4bf1-9698-dde8d4c16877", 40 "slug": "pornography", 41 "displayName": "Pornography", 42 "icon": "ðŸ”ž", 43 "description": null, 44 "sortOrder": 5, 45 "createdAt": "2026-04-26T03:41:36.113327Z" 46 }, 47 { 48 "id": "1f28722d-2cc1-4333-923c-6c11e71cd911", 49 "slug": "social_media", 50 "displayName": "Social Media", 51 "icon": "ðŸ“±", 52 "description": null, 53 "sortOrder": 6, 54 "createdAt": "2026-04-26T03:41:36.113327Z" 55 }, 56 { 57 "id": "5a98535a-cdc1-4a89-a7a9-dca4b1dc4bc0", 58 "slug": "sugar_junk_food", 59 "displayName": "Sugar & Junk Food", 60 "icon": "ðŸ ©", 61 "description": null, 62 "sortOrder": 7, 63 "createdAt": "2026-04-26T03:41:36.113327Z" 64 }, 65 { 66 "id": "57b81ebb-5717-416c-b0e5-d5ba6e550680", 67 "slug": "gambling", 68 "displayName": "Gambling", 69 "icon": "ðŸŽ°", 70 "description": null, 71 "sortOrder": 8, 72 "createdAt": "2026-04-26T03:41:36.113327Z" 73 }, 74 { 75 "id": "6ae386c1-dbaa-4191-9d44-fe0e5fe1b7c9", 76 "slug": "custom", 77 "displayName": "Custom Habit", 78 "icon": "âœ ï¸ ", 79 "description": null, 80 "sortOrder": 9,
  Get My Habits
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Add Single Habit
  Request URL:
  Authorization: Bearer token from Login API response
  Case 1 Payload (When user already has 1 habit and tries to add another without completing
  payment):
  81 "createdAt": "2026-04-26T03:41:36.113327Z"
  82 }
  83 ]
  1 GET: {{baseUrl}}/habits/mine
  1 None
  1 [
  2 {
  3 "id": "2ad05b82-66c3-4aa8-b4ad-3348ecd35569",
  4 "userId": "629d7989-2318-4f1d-be03-ebaee47e6fcc",
  5 "habitId": "5223174f-a3ed-426f-b0a0-76281f25a3d5",
  6 "quitDate": "2026-04-22",
  7 "isActive": true,
  8 "cigarettesPerDay": null,
  9 "costPerCigarette": null,
  10 "drinksPerWeek": 5,
  11 "costPerSession": 1200.00,
  12 "podsPerWeek": null,
  13 "podCost": null,
  14 "hoursPerDay": null,
  15 "platforms": null,
  16 "spendPerWeek": null,
  17 "customDescription": null,
  18 "customTimePerDay": null,
  19 "customSpendPerDay": null,
  20 "createdAt": "2026-04-26T05:55:53.778554Z",
  21 "updatedAt": "2026-04-26T05:55:53.778554Z"
  22 }
  23 ]
  1 POST: {{baseUrl}}/habits/mine
  Payload
  Response
  Case 2 payload (when user has no habits and wants to add 1 without any current habit):
  Payload
  Response
  1 {
  2 "habitId": "smoking",
  3 "quitDate": "2026-04-26",
  4 "cigarettesPerDay": 10,
  5 "costPerCigarette": 15,
  6 "customDescription": "Optional",
  7 "customTimePerDay": 0.5,
  8 "customSpendPerDay": 100
  9 }
  1 {
  2 "status": 402,
  3 "error": "Payment Required",
  4 "message": "Free tier users can only track one active habit.
  Please upgrade to Sovereign premium for unlimited habits.",
  5 "timestamp": "2026-04-26T06:03:03.888250300Z"
  6 }
  1 {
  2 "habitId": "smoking",
  3 "quitDate": "2026-04-26",
  4 "cigarettesPerDay": 10,
  5 "costPerCigarette": 15,
  6 "customDescription": "Optional",
  7 "customTimePerDay": 0.5,
  8 "customSpendPerDay": 100
  9 }
  1 {
  2 "id": "2a77ddf7-18fc-4741-84a2-5371f789d67d",
  3 "userId": "629d7989-2318-4f1d-be03-ebaee47e6fcc",
  4 "habitId": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
  5 "quitDate": "2026-04-26",
  6 "isActive": true,
  7 "cigarettesPerDay": 10,
  8 "costPerCigarette": 15.00,
  9 "drinksPerWeek": null,
  10 "costPerSession": null,
  11 "podsPerWeek": null,
  12 "podCost": null,
  13 "hoursPerDay": null,
  14 "platforms": null,
  15 "spendPerWeek": null,
  16 "customDescription": "Optional",
  17 "customTimePerDay": 0.50,
  18 "customSpendPerDay": 100.00,
  19 "createdAt": "2026-04-26T06:06:43.917864Z",
  20 "updatedAt": "2026-04-26T06:06:43.917864Z"
  21 }
  Update Habit Config
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Deactivate Habit
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  1 PUT: {{baseUrl}}/habits/mine/{{userHabitId}}
  1 {
  2 "cigarettesPerDay": 12,
  3 "costPerCigarette": 18,
  4 "isActive": true
  5 }
  1 {
  2 "id": "2a77ddf7-18fc-4741-84a2-5371f789d67d",
  3 "userId": "629d7989-2318-4f1d-be03-ebaee47e6fcc",
  4 "habitId": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
  5 "quitDate": "2026-04-26",
  6 "isActive": true,
  7 "cigarettesPerDay": 12,
  8 "costPerCigarette": 18.00,
  9 "drinksPerWeek": null,
  10 "costPerSession": null,
  11 "podsPerWeek": null,
  12 "podCost": null,
  13 "hoursPerDay": null,
  14 "platforms": null,
  15 "spendPerWeek": null,
  16 "customDescription": "Optional",
  17 "customTimePerDay": 0.50,
  18 "customSpendPerDay": 100.00,
  19 "createdAt": "2026-04-26T06:06:43.917864Z",
  20 "updatedAt": "2026-04-26T06:31:39.790382Z"
  21 }
  1 DELETE: {{baseUrl}}/habits/mine/{{userHabitId}}
  1 None
  1 {
  2 "message": "Habit with ID 2a77ddf7-18fc-4741-84a2-5371f789d67d
  has been successfully deactivated.",
  3 "status": "success"
  Check-ins & History
  Submit Check-in
  Request URL:
  Authorization: Bearer token from Login API response
  Case 1 payload (Clean):
  Payload
  Response
  Case 2 payload (Slipped):
  Payload
  4 }
  1 POST: {{baseUrl}}/checkins
  1 {
  2 "userHabitId": "{{userHabitId}}",
  3 "status": "clean",
  4 "mood": "PROUD",
  5 "note": "Stayed strong today! Exercise really helped with the
  afternoon cravings."
  6 }
  1 {
  2 "checkIn": {
  3 "id": "cf2ed7fa-cae8-4221-8955-64b7555cc7c1",
  4 "userHabitId": "2a77ddf7-18fc-4741-84a2-5371f789d67d",
  5 "checkinDate": "2026-04-26",
  6 "status": "clean",
  7 "mood": "PROUD",
  8 "slipReason": null,
  9 "note": "Stayed strong today! Exercise really helped with
  the afternoon cravings.",
  10 "createdAt": "2026-04-26T06:44:17.507393Z"
  11 },
  12 "newStreak": 1,
  13 "xpEarned": 25,
  14 "badgesEarned": [
  15 "first_day"
  16 ],
  17 "milestoneReached": false,
  18 "withdrawalMessage": null
  19 }
  1 {
  2 "userHabitId": "{{userHabitId}}",
  3 "status": "slipped",
  4 "mood": "REGRETFUL",
  5 "slipReason": "SOCIAL_PRESSURE",
  6 "note": "Was out with friends and they were all smoking. I gave
  in. Need a plan for next time."
  7 }
  Response
  Case 3 payload (Checked in Slipped and trying to Check In Clean):
  Payload
  Response
  Check-in History
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  1 {
  2 "checkIn": {
  3 "id": "cf2ed7fa-cae8-4221-8955-64b7555cc7c1",
  4 "userHabitId": "2a77ddf7-18fc-4741-84a2-5371f789d67d",
  5 "checkinDate": "2026-04-26",
  6 "status": "slipped",
  7 "mood": "REGRETFUL",
  8 "slipReason": "SOCIAL_PRESSURE",
  9 "note": "Was out with friends and they were all smoking. I
  gave in. Need a plan for next time.",
  10 "createdAt": "2026-04-26T06:44:17.507393Z"
  11 },
  12 "newStreak": 0,
  13 "xpEarned": 0,
  14 "badgesEarned": [],
  15 "milestoneReached": false,
  16 "withdrawalMessage": "Relapses are part of the journey. Take a
  deep breath, identify the trigger (like SOCIAL_PRESSURE), and start
  again. You've got this."
  17 }
  1 {
  2 "userHabitId": "{{userHabitId}}",
  3 "status": "clean",
  4 "mood": "PROUD",
  5 "note": "Stayed strong today! Exercise really helped with the
  afternoon cravings."
  6 }
  1 {
  2 "status": 400,
  3 "error": "Validation Error",
  4 "message": "You already reported a slip today. Stay strong and
  focus on tomorrow.",
  5 "timestamp": "2026-04-26T07:13:48.080945500Z"
  6 }
  1 GET: {{baseUrl}}/checkins/history/{{userHabitId}}?days=30
  1 None
  Has Checked In Today?
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Streaks
  Get All My Streaks
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  1 [
  2 {
  3 "id": "cf2ed7fa-cae8-4221-8955-64b7555cc7c1",
  4 "userHabitId": "2a77ddf7-18fc-4741-84a2-5371f789d67d",
  5 "checkinDate": "2026-04-26",
  6 "status": "slipped",
  7 "mood": "REGRETFUL",
  8 "slipReason": "SOCIAL_PRESSURE",
  9 "note": "Was out with friends and they were all smoking. I
  gave in. Need a plan for next time.",
  10 "createdAt": "2026-04-26T06:44:17.507393Z"
  11 },
  12 ...
  13 ]
  1 GET: {{baseUrl}}/checkins/today
  1 None
  1 {
  2 "hasCheckedInToday": true
  3 }
  1 GET: {{baseUrl}}/streaks
  1 None
  1 [
  2 {
  3 "id": "586f246f-0638-456d-a290-b738a3f45eff",
  Get Specific Habit Streak
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Friends & Search
  Search Users
  Request URL:
  4 "userHabitId": "2a77ddf7-18fc-4741-84a2-5371f789d67d",
  5 "currentStreak": 0,
  6 "longestStreak": 1,
  7 "lastCheckinDate": "2026-04-26",
  8 "totalCleanDays": 0,
  9 "isActive": true,
  10 "createdAt": "2026-04-26T06:06:43.917864Z",
  11 "updatedAt": "2026-04-26T07:11:22.53442Z"
  12 },
  13 {
  14 "id": "600198cd-5002-4cab-a562-1b2ce177c04d",
  15 "userHabitId": "2ad05b82-66c3-4aa8-b4ad-3348ecd35569",
  16 "currentStreak": 0,
  17 "longestStreak": 0,
  18 "lastCheckinDate": null,
  19 "totalCleanDays": 0,
  20 "isActive": false,
  21 "createdAt": "2026-04-26T05:55:53.778554Z",
  22 "updatedAt": "2026-04-26T05:55:53.778554Z"
  23 }
  24 ]
  1 GET: {{baseUrl}}/streaks/{{userHabitId}}
  1 None
  1 {
  2 "id": "586f246f-0638-456d-a290-b738a3f45eff",
  3 "userHabitId": "2a77ddf7-18fc-4741-84a2-5371f789d67d",
  4 "currentStreak": 0,
  5 "longestStreak": 1,
  6 "lastCheckinDate": "2026-04-26",
  7 "totalCleanDays": 0,
  8 "isActive": true,
  9 "createdAt": "2026-04-26T06:06:43.917864Z",
  10 "updatedAt": "2026-04-26T07:11:22.53442Z"
  11 }
  1 GET: {{baseUrl}}/friends/search?q=tester
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Send Friend Request
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response when friend is valid
  Response when friend status is pending
  1
  1 [
  2 {
  3 "id": "7386e51a-ea8d-4f58-861f-a8d13c216467",
  4 "username": "tester_1",
  5 "displayName": "Tester One",
  6 "avatarUrl": null,
  7 "bio": null,
  8 "country": "US",
  9 "currency": "USD",
  10 "isSupporter": true,
  11 "onboardingCompleted": false,
  12 "quitDate": null,
  13 "pushSubscription": null,
  14 "notificationPrefs": "{\"challenges\": true,
  \"milestones\": true, \"weekly_report\": true, \"daily_reminder\":
  true, \"relapse_support\": true, \"friend_milestones\": true,
  \"withdrawal_warnings\": true}",
  15 "dailyReminderTime": "09:00:00",
  16 "premiumStatus": "free",
  17 "stripeCustomerId": null,
  18 "leaderboardOptIn": true,
  19 "createdAt": "2026-04-26T07:56:54.293228Z",
  20 "updatedAt": "2026-04-26T07:56:54.293228Z"
  21 }
  22 ]
  1 {{baseUrl}}/friends/request
  1 {
  2 "addresseeUsername": "{{username}}"
  3 }
  1 {
  2 "message": "Friend request sent successfully"
  3 }
  1 {
  2 "status": 400,
  Response when friend is invalid
  Get Pending Requests
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Respond to Friend Request
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  3 "error": "Validation Error",
  4 "message": "A relationship already exists between you and this
  user (status: pending)",
  5 "timestamp": "2026-04-26T08:00:45.023935500Z"
  6 }
  1 {
  2 "status": 404,
  3 "error": "Not Found",
  4 "message": "User not found with username: tester_1123451",
  5 "timestamp": "2026-04-26T08:01:41.592818800Z"
  6 }
  1 GET: {{baseUrl}}/friends/pending
  1 None
  1 [
  2 {
  3 "id": "7400f30c-e29e-4483-be48-a5933614acc6",
  4 "requesterId": "86d2bcc3-f46b-4b30-84ae-c36606de2671",
  5 "addresseeId": "7386e51a-ea8d-4f58-861f-a8d13c216467",
  6 "status": "pending",
  7 "createdAt": "2026-04-26T08:00:25.99312Z",
  8 "updatedAt": "2026-04-26T08:00:25.99312Z"
  9 }
  10 ]
  1 PUT: {{baseUrl}}/friends/{{friendId}}/respond
  1 {
  2 "response": "ACCEPTED"
  3 }
  Response
  Get Friends List
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Remove Friend
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  1 {
  2 "message": "Friend request ACCEPTED"
  3 }
  1 GET: {{baseUrl}}/friends
  1 None
  1 [
  2 {
  3 "id": "7400f30c-e29e-4483-be48-a5933614acc6",
  4 "requesterId": "86d2bcc3-f46b-4b30-84ae-c36606de2671",
  5 "addresseeId": "7386e51a-ea8d-4f58-861f-a8d13c216467",
  6 "status": "accepted",
  7 "createdAt": "2026-04-26T08:00:25.99312Z",
  8 "updatedAt": "2026-04-26T08:06:28.432712Z"
  9 }
  10 ]
  1 DELETE: {{baseUrl}}/friends/{{friendId}}
  1 None
  1 {
  2 "message": "Friendship record [ID] has been successfully
  removed.",
  3 "status": "success"
  4 }
  Analytics & Dashboard
  Dashboard Summary
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  1 GET: {{baseUrl}}/dashboard/summary
  1 None
  1 {
  2 "habits": [
  3 {
  4 "userHabitId": "2a77ddf7-18fc-4741-84a2-5371f789d67d",
  5 "habitName": "Smoking",
  6 "habitIcon": "ðŸš¬",
  7 "currentStreak": 0,
  8 "isActive": true
  9 },
  10 {
  11 "userHabitId": "2ad05b82-66c3-4aa8-b4ad-3348ecd35569",
  12 "habitName": "Drinking",
  13 "habitIcon": "ðŸ º",
  14 "currentStreak": 0,
  15 "isActive": false
  16 }
  17 ],
  18 "totalSavedToday": 0,
  19 "totalSavedWeek": 0,
  20 "totalSavedMonth": 0,
  21 "totalSavedAllTime": 0,
  22 "level": 1,
  23 "xp": 0,
  24 "recentBadges": [
  25 {
  26 "id": "7105b5ed-3aad-444f-a121-59a0766c505c",
  27 "slug": "first_day",
  28 "name": "Day One",
  29 "description": "You started. That's everything.",
  30 "iconUrl": null,
  31 "rarity": "common",
  32 "xpReward": 25,
  33 "triggerType": "streak_days",
  34 "triggerValue": 1,
  35 "habitSlug": null,
  36 "createdAt": "2026-04-26T03:41:44.15349Z"
  37 }
  38 ],
  39 "todayMessage": {
  40 "id": "10a6636d-2d39-4c4b-ac02-bc4ae7f6f027",
  41 "habitId": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
  42 "dayOffset": 0,
  43 "message": "Your lungs are already starting to clear. The
  carbon monoxide in your blood is dropping.",
  44 "tone": "empathetic",
  45 "createdAt": "2026-04-26T09:08:04.105017Z"
  46 },
  Money Saved Breakdown
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  47 "dopamineSuggestions": [
  48 {
  49 "id": "379bd459-1a90-4772-9974-8a4934d29a24",
  50 "suggestion": "Take a 5-minute ice-cold shower to
  trigger a massive natural dopamine spike.",
  51 "category": "physical",
  52 "habitSlugs": [
  53 "smoking",
  54 "drinking",
  55 "pornography",
  56 "gambling"
  57 ],
  58 "difficulty": "hard",
  59 "createdAt": "2026-04-26T09:08:04.105017Z"
  60 },
  61 {
  62 "id": "3f1e14c2-971b-4af8-bb65-e67e10ffb2a6",
  63 "suggestion": "Eat a small piece of 85%+ dark
  chocolate. It triggers endorphins without the sugar crash.",
  64 "category": "physical",
  65 "habitSlugs": [
  66 "sugar_junk_food",
  67 "drinking"
  68 ],
  69 "difficulty": "easy",
  70 "createdAt": "2026-04-26T09:08:04.105017Z"
  71 },
  72 {
  73 "id": "e9888dee-b673-4541-a6a9-dca039463e2c",
  74 "suggestion": "Go for a 15-minute run. The \"runner's
  high\" is a real biochemical reset.",
  75 "category": "physical",
  76 "habitSlugs": [
  77 "smoking",
  78 "vaping",
  79 "sugar_junk_food"
  80 ],
  81 "difficulty": "medium",
  82 "createdAt": "2026-04-26T09:08:04.105017Z"
  83 }
  84 ]
  85 }
  1 GET: {{baseUrl}}/analytics/money/{{userHabitId}}
  1 None
  1 {
  2 "today": 36,
  3 "week": 216,
  Graph-Ready Analytics
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Heatmap Data (Params)
  Request URL:
  4 "month": 1036,
  5 "allTime": 3231
  6 }
  1 GET: {{baseUrl}}/analytics/money/{{userHabitId}}/series
  1 None
  1 {
  2 "daily": [
  3 { "label": "2026-04-20", "value": 3 },
  4 { "label": "2026-04-21", "value": 5 },
  5 { "label": "2026-04-22", "value": 4 },
  6 { "label": "2026-04-23", "value": 6 },
  7 { "label": "2026-04-24", "value": 8 },
  8 { "label": "2026-04-25", "value": 7 },
  9 { "label": "2026-04-26", "value": 9 }
  10 ],
  11 "weekly": [
  12 { "label": "Week 2026-03-30", "value": 18 },
  13 { "label": "Week 2026-04-06", "value": 24 },
  14 { "label": "Week 2026-04-13", "value": 31 },
  15 { "label": "Week 2026-04-20", "value": 42 }
  16 ],
  17 "monthly": [
  18 { "label": "MAY 2025", "value": 40 },
  19 { "label": "JUNE 2025", "value": 55 },
  20 { "label": "JULY 2025", "value": 70 },
  21 { "label": "AUGUST 2025", "value": 65 },
  22 { "label": "SEPTEMBER 2025", "value": 85 },
  23 { "label": "OCTOBER 2025", "value": 95 },
  24 { "label": "NOVEMBER 2025", "value": 110 },
  25 { "label": "DECEMBER 2025", "value": 130 },
  26 { "label": "JANUARY 2026", "value": 150 },
  27 { "label": "FEBRUARY 2026", "value": 170 },
  28 { "label": "MARCH 2026", "value": 190 },
  29 { "label": "APRIL 2026", "value": 210 }
  30 ]
  31 }
  1 GET: {{baseUrl}}/analytics/heatmap/{{userHabitId}}?months=12
  Payload:
  Authorization: Bearer token from Login API response
  Response
  1 None
  1 [
  2 {
  3 "date": "2025-12-27",
  4 "status": "clean"
  5 },
  6 {
  7 "date": "2025-12-28",
  8 "status": "clean"
  9 },
  10 {
  11 "date": "2025-12-29",
  12 "status": "clean"
  13 },
  14 {
  15 "date": "2025-12-30",
  16 "status": "clean"
  17 },
  18 {
  19 "date": "2025-12-31",
  20 "status": "clean"
  21 },
  22 {
  23 "date": "2026-01-01",
  24 "status": "clean"
  25 },
  26 {
  27 "date": "2026-01-02",
  28 "status": "clean"
  29 },
  30 {
  31 "date": "2026-01-03",
  32 "status": "clean"
  33 },
  34 {
  35 "date": "2026-01-04",
  36 "status": "clean"
  37 },
  38 {
  39 "date": "2026-01-05",
  40 "status": "clean"
  41 },
  42 {
  43 "date": "2026-01-06",
  44 "status": "clean"
  45 },
  46 {
  47 "date": "2026-01-07",
  48 "status": "clean"
  49 },
  50 {
  51 "date": "2026-01-08",
  52 "status": "clean"
  53 },
  54 {
  55 "date": "2026-01-09",
  56 "status": "clean"
  57 },
  5
  8
  {
  5
  9
  "
  d
  a
  t
  e
  ": "
  2
  0
  2
  6
- 0
  1
- 1
  0
  ", 60 "status": "clean" 61 }, 62 { 63 "date": "2026-01-11", 64 "status": "clean" 65 }, 66 { 67 "date": "2026-01-12", 68 "status": "clean" 69 }, 70 { 71 "date": "2026-01-13", 72 "status": "clean" 73 }, 74 { 75 "date": "2026-01-14", 76 "status": "clean" 77 }, 78 { 79 "date": "2026-01-15", 80 "status": "clean" 81 }, 82 { 83 "date": "2026-01-16", 84 "status": "slipped" 85 }, 86 { 87 "date": "2026-01-17", 88 "status": "clean" 89 }, 90 { 91 "date": "2026-01-18", 92 "status": "clean" 93 }, 94 { 95 "date": "2026-01-19", 96 "status": "clean" 97 }, 98 { 99 "date": "2026-01-20", 100 "status": "clean" 101 }, 102 { 103 "date": "2026-01-21", 104 "status": "clean" 105 }, 106 { 107 "date": "2026-01-22", 108 "status": "clean" 109 }, 110 { 111 "date": "2026-01-23", 112 "status": "clean" 113 }, 114 { 115 "date": "2026-01-24", 116 "status": "clean" 117 }, 118 { 119 "date": "2026-01-25", 120 "status": "clean" 121 }, 122 { 123 "date": "2026-01-26", 124 "status": "clean"
  1
  2
  5
  }, 126 { 127
  "
  d
  a
  t
  e
  ": "
  2
  0
  2
  6
- 0
  1
- 2
  7
  ", 128 "status": "clean" 129 }, 130 { 131 "date": "2026-01-28", 132 "status": "clean" 133 }, 134 { 135 "date": "2026-01-29", 136 "status": "clean" 137 }, 138 { 139 "date": "2026-01-30", 140 "status": "clean" 141 }, 142 { 143 "date": "2026-01-31", 144 "status": "clean" 145 }, 146 { 147 "date": "2026-02-01", 148 "status": "clean" 149 }, 150 { 151 "date": "2026-02-02", 152 "status": "clean" 153 }, 154 { 155 "date": "2026-02-03", 156 "status": "clean" 157 }, 158 { 159 "date": "2026-02-04", 160 "status": "clean" 161 }, 162 { 163 "date": "2026-02-05", 164 "status": "clean" 165 }, 166 { 167 "date": "2026-02-06", 168 "status": "clean" 169 }, 170 { 171 "date": "2026-02-07", 172 "status": "clean" 173 }, 174 { 175 "date": "2026-02-08", 176 "status": "clean" 177 }, 178 { 179 "date": "2026-02-09", 180 "status": "clean" 181 }, 182 { 183 "date": "2026-02-10", 184 "status": "clean" 185 }, 186 { 187 "date": "2026-02-11", 188 "status": "clean" 189 }, 190 { 191 "date": "2026-02-12",
  1
  9
  2
  "
  s
  t
  a
  t
  u
  s
  ": "
  c
  l
  e
  a
  n
  "
  1
  9
  3
  }, 194 { 195
  "
  d
  a
  t
  e
  ": "
  2
  0
  2
  6
- 0
  2
- 1
  3
  ", 196 "status": "clean" 197 }, 198 { 199 "date": "2026-02-14", 200 "status": "clean" 201 }, 202 { 203 "date": "2026-02-15", 204 "status": "slipped" 205 }, 206 { 207 "date": "2026-02-16", 208 "status": "clean" 209 }, 210 { 211 "date": "2026-02-17", 212 "status": "clean" 213 }, 214 { 215 "date": "2026-02-18", 216 "status": "clean" 217 }, 218 { 219 "date": "2026-02-19", 220 "status": "clean" 221 }, 222 { 223 "date": "2026-02-20", 224 "status": "clean" 225 }, 226 { 227 "date": "2026-02-21", 228 "status": "clean" 229 }, 230 { 231 "date": "2026-02-22", 232 "status": "clean" 233 }, 234 { 235 "date": "2026-02-23", 236 "status": "clean" 237 }, 238 { 239 "date": "2026-02-24", 240 "status": "clean" 241 }, 242 { 243 "date": "2026-02-25", 244 "status": "clean" 245 }, 246 { 247 "date": "2026-02-26", 248 "status": "clean" 249 }, 250 { 251 "date": "2026-02-27", 252 "status": "clean" 253 }, 254 { 255 "date": "2026-02-28", 256 "status": "clean" 257 }, 258 {
  2
  5
  9
  "
  d
  a
  t
  e
  ": "
  2
  0
  2
  6
- 0
  3
- 0
  1
  ", 260 "status": "clean" 261 }, 262 { 263 "date": "2026-03-02", 264 "status": "clean" 265 }, 266 { 267 "date": "2026-03-03", 268 "status": "clean" 269 }, 270 { 271 "date": "2026-03-04", 272 "status": "clean" 273 }, 274 { 275 "date": "2026-03-05", 276 "status": "clean" 277 }, 278 { 279 "date": "2026-03-06", 280 "status": "clean" 281 }, 282 { 283 "date": "2026-03-07", 284 "status": "clean" 285 }, 286 { 287 "date": "2026-03-08", 288 "status": "clean" 289 }, 290 { 291 "date": "2026-03-09", 292 "status": "clean" 293 }, 294 { 295 "date": "2026-03-10", 296 "status": "clean" 297 }, 298 { 299 "date": "2026-03-11", 300 "status": "clean" 301 }, 302 { 303 "date": "2026-03-12", 304 "status": "clean" 305 }, 306 { 307 "date": "2026-03-13", 308 "status": "clean" 309 }, 310 { 311 "date": "2026-03-14", 312 "status": "clean" 313 }, 314 { 315 "date": "2026-03-15", 316 "status": "clean" 317 }, 318 { 319 "date": "2026-03-16", 320 "status": "clean" 321 }, 322 { 323 "date": "2026-03-17", 324 "status": "clean" 325 },
  3
  2
  6
  {
  3
  2
  7
  "
  d
  a
  t
  e
  ": "
  2
  0
  2
  6
- 0
  3
- 1
  8
  ", 328 "status": "clean" 329 }, 330 { 331 "date": "2026-03-19", 332 "status": "clean" 333 }, 334 { 335 "date": "2026-03-20", 336 "status": "clean" 337 }, 338 { 339 "date": "2026-03-21", 340 "status": "clean" 341 }, 342 { 343 "date": "2026-03-22", 344 "status": "clean" 345 }, 346 { 347 "date": "2026-03-23", 348 "status": "clean" 349 }, 350 { 351 "date": "2026-03-24", 352 "status": "clean" 353 }, 354 { 355 "date": "2026-03-25", 356 "status": "clean" 357 }, 358 { 359 "date": "2026-03-26", 360 "status": "clean" 361 }, 362 { 363 "date": "2026-03-27", 364 "status": "slipped" 365 }, 366 { 367 "date": "2026-03-28", 368 "status": "clean" 369 }, 370 { 371 "date": "2026-03-29", 372 "status": "clean" 373 }, 374 { 375 "date": "2026-03-30", 376 "status": "clean" 377 }, 378 { 379 "date": "2026-03-31", 380 "status": "clean" 381 }, 382 { 383 "date": "2026-04-01", 384 "status": "clean" 385 }, 386 { 387 "date": "2026-04-02", 388 "status": "clean" 389 }, 390 { 391 "date": "2026-04-03", 392 "status": "clean"
  3
  9
  3
  }, 394 { 395
  "
  d
  a
  t
  e
  ": "
  2
  0
  2
  6
- 0
  4
- 0
  4
  ", 396 "status": "clean" 397 }, 398 { 399 "date": "2026-04-05", 400 "status": "clean" 401 }, 402 { 403 "date": "2026-04-06", 404 "status": "clean" 405 }, 406 { 407 "date": "2026-04-07", 408 "status": "clean" 409 }, 410 { 411 "date": "2026-04-08", 412 "status": "clean" 413 }, 414 { 415 "date": "2026-04-09", 416 "status": "clean" 417 }, 418 { 419 "date": "2026-04-10", 420 "status": "clean" 421 }, 422 { 423 "date": "2026-04-11", 424 "status": "clean" 425 }, 426 { 427 "date": "2026-04-12", 428 "status": "clean" 429 }, 430 { 431 "date": "2026-04-13", 432 "status": "clean" 433 }, 434 { 435 "date": "2026-04-14", 436 "status": "clean" 437 }, 438 { 439 "date": "2026-04-15", 440 "status": "clean" 441 }, 442 { 443 "date": "2026-04-16", 444 "status": "clean" 445 }, 446 { 447 "date": "2026-04-17", 448 "status": "clean" 449 }, 450 { 451 "date": "2026-04-18", 452 "status": "clean" 453 }, 454 { 455 "date": "2026-04-19", 456 "status": "clean" 457 }, 458 { 459 "date": "2026-04-20",
  Global Stats
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Journal
  Save Entry
  Request URL:
  460 "status": "clean"
  461 },
  462 {
  463 "date": "2026-04-21",
  464 "status": "clean"
  465 },
  466 {
  467 "date": "2026-04-22",
  468 "status": "clean"
  469 },
  470 {
  471 "date": "2026-04-23",
  472 "status": "clean"
  473 },
  474 {
  475 "date": "2026-04-24",
  476 "status": "clean"
  477 },
  478 {
  479 "date": "2026-04-25",
  480 "status": "clean"
  481 },
  482 {
  483 "date": "2026-04-26",
  484 "status": "clean"
  485 }
  486 ]Global StatsGlobal Stats
  1 GET: {{baseUrl}}/analytics/global
  1 None
  1 {
  2 "totalUsers": 9,
  3 "totalHabitsTracked": 7,
  4 "totalCleanDays": 118,
  5 "totalMoneySaved": 17700.00
  6 }
  1 POST: {{baseUrl}}/journal
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Get My Entries (Params)
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  1 {
  2 "entryDate": "2026-04-26",
  3 "content": "Full reflection on triggers and progress.",
  4 "moodScore": 9,
  5 "moodEmoji": "😊",
  6 "triggers": ["stress", "evening"],
  7 "whatHelped": "Meditation",
  8 "isShared": true,
  9 "sharedWith": ["{{friendId}}"]
  10 }
  1 {
  2 "id": "65553058-c66d-433e-97a8-d54af59152a1",
  3 "message": "Journal entry created successfully. XP awarded!",
  4 "entryDate": "2024-04-28",
  5 "xpEarned": 25
  6 }
  1 GET: {{baseUrl}}/journal?limit=30
  1 None
  1 [
  2 {
  3 "id": "65553058-c66d-433e-97a8-d54af59152a1",
  4 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  5 "entryDate": "2026-04-26",
  6 "content": "Full reflection on triggers and progress.",
  7 "moodScore": 9,
  8 "moodEmoji": "😊",
  9 "triggers": [
  10 "stress",
  11 "evening"
  12 ],
  13 "whatHelped": "Meditation",
  14 "isShared": true,
  15 "sharedWith": [
  16 "7400f30c-e29e-4483-be48-a5933614acc6"
  17 ],
  18 "createdAt": "2026-04-28T11:58:50.711093Z",
  19 "updatedAt": "2026-04-28T11:58:50.711093Z"
  20 }
  Get Entry by Date
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Get Shared Entries
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  21 ]
  1 GET: {{baseUrl}}/journal/2026-04-26
  1 None
  1 {
  2 "id": "65553058-c66d-433e-97a8-d54af59152a1",
  3 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  4 "entryDate": "2026-04-26",
  5 "content": "Full reflection on triggers and progress.",
  6 "moodScore": 9,
  7 "moodEmoji": "😊",
  8 "triggers": [
  9 "stress",
  10 "evening"
  11 ],
  12 "whatHelped": "Meditation",
  13 "isShared": true,
  14 "sharedWith": [
  15 "7400f30c-e29e-4483-be48-a5933614acc6"
  16 ],
  17 "createdAt": "2026-04-28T11:58:50.711093Z",
  18 "updatedAt": "2026-04-28T11:58:50.711093Z"
  19 }
  1 GET: {{baseUrl}}/journal/shared
  1 None
  1 [
  2 {
  3 "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  4 "userId": "user-uuid-of-your-friend",
  Gamification
  XP Summary
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  5 "entryDate": "2026-04-27",
  6 "content": "Had a tough day but stayed strong. Shared this to
  stay accountable.",
  7 "moodScore": 6,
  8 "moodEmoji": "😟",
  9 "triggers": ["Stress", "Fatigue"],
  10 "whatHelped": "Talked to a friend",
  11 "isShared": true,
  12 "sharedWith": [
  13 "your-user-uuid",
  14 "another-friend-uuid"
  15 ],
  16 "createdAt": "2026-04-27T10:00:00Z",
  17 "updatedAt": "2026-04-27T10:00:00Z"
  18 }
  19 ]
  1 GET: {{baseUrl}}/xp/summary
  1 None
  1 {
  2 "xpToNextLevel": 1810,
  3 "recentEvents": [
  4 {
  5 "id": "8e950acd-a3b8-4ec9-9128-4fff303cca34",
  6 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  7 "eventType": "journal_entry",
  8 "xpAmount": 15,
  9 "referenceId": "65553058-c66d-433e-97a8-d54af59152a1",
  10 "description": "Journal entry for 2026-04-26",
  11 "createdAt": "2026-04-28T11:58:50.711093Z"
  12 },
  13 {
  14 "id": "3b534e3b-51d9-43ea-9b44-f61e904bd266",
  15 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  16 "eventType": "badge_earned",
  17 "xpAmount": 500,
  18 "referenceId": "85e1ebcf-baa2-4949-b5fd-f632adada74e",
  19 "description": "Earned badge: 30-Day Legend",
  20 "createdAt": "2026-04-26T09:44:06.415062Z"
  21 },
  22 {
  23 "id": "098a3a10-0dd0-44f5-a22e-5bb86396403a",
  24 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  25 "eventType": "daily_checkin",
  26 "xpAmount": 50,
  27 "referenceId": "ba0376e0-7c47-49c7-ac22-32442684fb45",
  28 "description": "Daily clean check-in (Tiered Reward)",
  29 "createdAt": "2026-04-26T09:44:06.415062Z"
  30 },
  31 {
  32 "id": "9dd919d2-4423-44d6-8723-1f917e336ea6",
  33 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  34 "eventType": "badge_earned",
  35 "xpAmount": 200,
  36 "referenceId": "ddd06ea6-9e4a-4443-b4bf-25574ccf3928",
  37 "description": "Earned badge: Two Week Titan",
  38 "createdAt": "2026-04-26T09:43:59.814815Z"
  39 },
  40 {
  41 "id": "5d538eaa-6920-4b6b-9ee1-242adcbe14a0",
  42 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  43 "eventType": "badge_earned",
  44 "xpAmount": 100,
  45 "referenceId": "b6412a25-4375-4035-91d7-16858a537b10",
  46 "description": "Earned badge: First Week Warrior",
  47 "createdAt": "2026-04-26T09:43:59.814815Z"
  48 },
  49 {
  50 "id": "e3ed6b83-f77f-4f79-b83e-5c9159b702c1",
  51 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  52 "eventType": "badge_earned",
  53 "xpAmount": 25,
  54 "referenceId": "7105b5ed-3aad-444f-a121-59a0766c505c",
  55 "description": "Earned badge: Day One",
  56 "createdAt": "2026-04-26T09:43:59.814815Z"
  57 },
  58 {
  59 "id": "9e74637b-c0e1-415b-803f-d04d47e8a31f",
  60 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  61 "eventType": "daily_checkin",
  62 "xpAmount": 50,
  63 "referenceId": "c3a2e207-f3b0-4a19-af62-df26e6c77738",
  64 "description": "Daily clean check-in (Tiered Reward)",
  65 "createdAt": "2026-04-26T09:43:59.814815Z"
  66 },
  67 {
  68 "id": "503cf330-803a-42ad-bf8e-4484cec5f9bd",
  69 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  70 "eventType": "daily_checkin",
  71 "xpAmount": 25,
  72 "referenceId": "e37417ac-315a-4cf4-b890-46e29ee0a6fc",
  73 "description": "Daily clean check-in (Tiered Reward)",
  74 "createdAt": "2026-04-26T09:43:54.91007Z"
  75 },
  76 {
  77 "id": "8f724c1b-6853-4ea1-898b-88b5e3b5eaad",
  78 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  79 "eventType": "daily_checkin",
  80 "xpAmount": 25,
  81 "referenceId": "c1445fb7-71b1-4bdf-82d3-0f2c325d76e7",
  82 "description": "Daily clean check-in (Tiered Reward)",
  83 "createdAt": "2026-04-26T09:43:49.955147Z"
  84 },
  85 {
  86 "id": "8ebe64a3-3396-417a-ae7b-d45f9234a499",
  87 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  88 "eventType": "daily_checkin",
  89 "xpAmount": 25,
  90 "referenceId": "b235fb32-c20e-41ec-84a4-d4b394cb124a",
  91 "description": "Daily clean check-in (Tiered Reward)",
  92 "createdAt": "2026-04-26T09:43:45.054859Z"
  93 }
  94 ],
  95 "totalXp": 4190,
  96 "currentLevel": {
  All Badges with Status
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  97 "levelNumber": 7,
  98 "name": "Reclaimer",
  99 "xpRequired": 4000
  100 }
  101 }
  1 GET: {{baseUrl}}/xp/summary
  1 None
  1 {
  2 "xpToNextLevel": 1810,
  3 "recentEvents": [
  4 {
  5 "id": "8e950acd-a3b8-4ec9-9128-4fff303cca34",
  6 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  7 "eventType": "journal_entry",
  8 "xpAmount": 15,
  9 "referenceId": "65553058-c66d-433e-97a8-d54af59152a1",
  10 "description": "Journal entry for 2026-04-26",
  11 "createdAt": "2026-04-28T11:58:50.711093Z"
  12 },
  13 {
  14 "id": "3b534e3b-51d9-43ea-9b44-f61e904bd266",
  15 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  16 "eventType": "badge_earned",
  17 "xpAmount": 500,
  18 "referenceId": "85e1ebcf-baa2-4949-b5fd-f632adada74e",
  19 "description": "Earned badge: 30-Day Legend",
  20 "createdAt": "2026-04-26T09:44:06.415062Z"
  21 },
  22 {
  23 "id": "098a3a10-0dd0-44f5-a22e-5bb86396403a",
  24 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  25 "eventType": "daily_checkin",
  26 "xpAmount": 50,
  27 "referenceId": "ba0376e0-7c47-49c7-ac22-32442684fb45",
  28 "description": "Daily clean check-in (Tiered Reward)",
  29 "createdAt": "2026-04-26T09:44:06.415062Z"
  30 },
  31 {
  32 "id": "9dd919d2-4423-44d6-8723-1f917e336ea6",
  33 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  34 "eventType": "badge_earned",
  35 "xpAmount": 200,
  36 "referenceId": "ddd06ea6-9e4a-4443-b4bf-25574ccf3928",
  37 "description": "Earned badge: Two Week Titan",
  38 "createdAt": "2026-04-26T09:43:59.814815Z"
  39 },
  40 {
  41 "id": "5d538eaa-6920-4b6b-9ee1-242adcbe14a0",
  42 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  43 "eventType": "badge_earned",
  44 "xpAmount": 100,
  45 "referenceId": "b6412a25-4375-4035-91d7-16858a537b10",
  46 "description": "Earned badge: First Week Warrior",
  47 "createdAt": "2026-04-26T09:43:59.814815Z"
  48 },
  49 {
  50 "id": "e3ed6b83-f77f-4f79-b83e-5c9159b702c1",
  51 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  52 "eventType": "badge_earned",
  53 "xpAmount": 25,
  54 "referenceId": "7105b5ed-3aad-444f-a121-59a0766c505c",
  55 "description": "Earned badge: Day One",
  56 "createdAt": "2026-04-26T09:43:59.814815Z"
  57 },
  58 {
  59 "id": "9e74637b-c0e1-415b-803f-d04d47e8a31f",
  60 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  61 "eventType": "daily_checkin",
  62 "xpAmount": 50,
  63 "referenceId": "c3a2e207-f3b0-4a19-af62-df26e6c77738",
  64 "description": "Daily clean check-in (Tiered Reward)",
  65 "createdAt": "2026-04-26T09:43:59.814815Z"
  66 },
  67 {
  68 "id": "503cf330-803a-42ad-bf8e-4484cec5f9bd",
  69 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  70 "eventType": "daily_checkin",
  71 "xpAmount": 25,
  72 "referenceId": "e37417ac-315a-4cf4-b890-46e29ee0a6fc",
  73 "description": "Daily clean check-in (Tiered Reward)",
  74 "createdAt": "2026-04-26T09:43:54.91007Z"
  75 },
  76 {
  77 "id": "8f724c1b-6853-4ea1-898b-88b5e3b5eaad",
  78 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  79 "eventType": "daily_checkin",
  80 "xpAmount": 25,
  81 "referenceId": "c1445fb7-71b1-4bdf-82d3-0f2c325d76e7",
  82 "description": "Daily clean check-in (Tiered Reward)",
  83 "createdAt": "2026-04-26T09:43:49.955147Z"
  84 },
  85 {
  86 "id": "8ebe64a3-3396-417a-ae7b-d45f9234a499",
  87 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  88 "eventType": "daily_checkin",
  89 "xpAmount": 25,
  90 "referenceId": "b235fb32-c20e-41ec-84a4-d4b394cb124a",
  91 "description": "Daily clean check-in (Tiered Reward)",
  92 "createdAt": "2026-04-26T09:43:45.054859Z"
  93 }
  94 ],
  95 "totalXp": 4190,
  96 "currentLevel": {
  97 "levelNumber": 7,
  98 "name": "Reclaimer",
  99 "xpRequired": 4000
  100 }
  101 }
  Earned Badges
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  1 GET: {{baseUrl}}/badges/earned
  1 None
  1 [
  2 {
  3 "id": "85e1ebcf-baa2-4949-b5fd-f632adada74e",
  4 "slug": "thirty_days",
  5 "name": "30-Day Legend",
  6 "description": "One month. Dopamine is rebuilding.",
  7 "iconUrl": null,
  8 "rarity": "epic",
  9 "xpReward": 500,
  10 "triggerType": "streak_days",
  11 "triggerValue": 30,
  12 "habitSlug": null,
  13 "createdAt": "2026-04-26T03:41:44.15349Z"
  14 },
  15 {
  16 "id": "7105b5ed-3aad-444f-a121-59a0766c505c",
  17 "slug": "first_day",
  18 "name": "Day One",
  19 "description": "You started. That's everything.",
  20 "iconUrl": null,
  21 "rarity": "common",
  22 "xpReward": 25,
  23 "triggerType": "streak_days",
  24 "triggerValue": 1,
  25 "habitSlug": null,
  26 "createdAt": "2026-04-26T03:41:44.15349Z"
  27 },
  28 {
  29 "id": "b6412a25-4375-4035-91d7-16858a537b10",
  30 "slug": "first_week",
  31 "name": "First Week Warrior",
  32 "description": "7 days. Your brain is already changing.",
  33 "iconUrl": null,
  34 "rarity": "common",
  35 "xpReward": 100,
  36 "triggerType": "streak_days",
  37 "triggerValue": 7,
  38 "habitSlug": null,
  39 "createdAt": "2026-04-26T03:41:44.15349Z"
  40 },
  41 {
  42 "id": "ddd06ea6-9e4a-4443-b4bf-25574ccf3928",
  43 "slug": "two_weeks",
  44 "name": "Two Week Titan",
  45 "description": "14 days. Your cilia are regenerating.",
  46 "iconUrl": null,
  47 "rarity": "rare",
  48 "xpReward": 200,
  49 "triggerType": "streak_days",
  50 "triggerValue": 14,
  Friends Leaderboard
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  51 "habitSlug": null,
  52 "createdAt": "2026-04-26T03:41:44.15349Z"
  53 },
  54 {
  55 "id": "a5b54b05-d33d-4dc6-afc5-76feb9b61000",
  56 "slug": "money_saver_10k",
  57 "name": "Smart Money",
  58 "description": "Saved â‚¹10,000. That's a real number.",
  59 "iconUrl": null,
  60 "rarity": "rare",
  61 "xpReward": 200,
  62 "triggerType": "money_saved",
  63 "triggerValue": 10000,
  64 "habitSlug": null,
  65 "createdAt": "2026-04-26T03:41:44.15349Z"
  66 },
  67 {
  68 "id": "44cd14d6-451a-4612-a845-868693b5f472",
  69 "slug": "rising_again",
  70 "name": "Rising Again",
  71 "description": "Came back after a slip and held for 7
  days.",
  72 "iconUrl": null,
  73 "rarity": "epic",
  74 "xpReward": 400,
  75 "triggerType": "relapse_recovery",
  76 "triggerValue": 7,
  77 "habitSlug": null,
  78 "createdAt": "2026-04-26T03:41:44.15349Z"
  79 },
  80 {
  81 "id": "d005ab4a-5629-4611-bb69-8e0ca011aaf0",
  82 "slug": "money_saver_1k",
  83 "name": "Saver",
  84 "description": "Saved your first â‚¹1,000.",
  85 "iconUrl": null,
  86 "rarity": "common",
  87 "xpReward": 50,
  88 "triggerType": "money_saved",
  89 "triggerValue": 1000,
  90 "habitSlug": null,
  91 "createdAt": "2026-04-26T03:41:44.15349Z"
  92 }
  93 ]
  1 GET: {{baseUrl}}/leaderboard/friends
  1 None
  1 [
  Global Leaderboard
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  2 {
  3 "userId": "uuid-of-top-friend",
  4 "username": "SuperQuitter",
  5 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
  seed=SuperQuitter",
  6 "totalCleanDays": 45,
  7 "longestStreak": 30,
  8 "totalXp": 2500,
  9 "level": 12,
  10 "rank": 1
  11 },
  12 {
  13 "userId": "your-user-uuid",
  14 "username": "You",
  15 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
  seed=You",
  16 "totalCleanDays": 15,
  17 "longestStreak": 15,
  18 "totalXp": 1200,
  19 "level": 8,
  20 "rank": 2
  21 }
  22 ]
  23
  1 GET: {{baseUrl}}/leaderboard/global
  1 None
  1 [
  2 {
  3 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  4 "username": "legend_608",
  5 "avatarUrl": null,
  6 "totalCleanDays": 118,
  7 "longestStreak": 39,
  8 "totalXp": 4190,
  9 "level": 7,
  10 "rank": 1
  11 },
  12 {
  13 "userId": "629d7989-2318-4f1d-be03-ebaee47e6fcc",
  14 "username": "recovery_pro",
  15 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
  seed=Updated",
  16 "totalCleanDays": 0,
  17 "longestStreak": 1,
  18 "totalXp": 0,
  19 "level": 1,
  20 "rank": 2
  21 },
  22 {
  23 "userId": "5ee1a5a1-669e-4659-bb5d-a9c198afb4e9",
  24 "username": "legend_93",
  25 "avatarUrl": null,
  26 "totalCleanDays": 0,
  27 "longestStreak": 0,
  28 "totalXp": 0,
  29 "level": 1,
  30 "rank": 3
  31 },
  32 {
  33 "userId": "4f1848bf-90ae-4e5b-8646-698023ed9f9e",
  34 "username": "legend_887",
  35 "avatarUrl": null,
  36 "totalCleanDays": 0,
  37 "longestStreak": 0,
  38 "totalXp": 0,
  39 "level": 1,
  40 "rank": 4
  41 },
  42 {
  43 "userId": "703f45d0-c020-4463-8d2d-7d72bd9f46d9",
  44 "username": "legend_299",
  45 "avatarUrl": null,
  46 "totalCleanDays": 0,
  47 "longestStreak": 0,
  48 "totalXp": 0,
  49 "level": 1,
  50 "rank": 5
  51 },
  52 {
  53 "userId": "5b86de01-4870-47bf-8ec5-0086130e50a6",
  54 "username": "legend_120",
  55 "avatarUrl": null,
  56 "totalCleanDays": 0,
  57 "longestStreak": 0,
  58 "totalXp": 0,
  59 "level": 1,
  60 "rank": 6
  61 },
  62 {
  63 "userId": "7386e51a-ea8d-4f58-861f-a8d13c216467",
  64 "username": "tester_1",
  65 "avatarUrl": null,
  66 "totalCleanDays": 0,
  67 "longestStreak": 0,
  68 "totalXp": 20,
  69 "level": 1,
  70 "rank": 7
  71 },
  72 {
  73 "userId": "86d2bcc3-f46b-4b30-84ae-c36606de2671",
  74 "username": "warrior_three",
  75 "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?
  seed=Updated",
  76 "totalCleanDays": 0,
  77 "longestStreak": 0,
  78 "totalXp": 20,
  79 "level": 1,
  80 "rank": 8
  81 },
  82 {
  83 "userId": "6d6ea896-86ac-4b97-ae68-135b22ce71dc",
  84 "username": "legend_943",
  85 "avatarUrl": null,
  86 "totalCleanDays": 0,
  87 "longestStreak": 0,
  88 "totalXp": 0,
  89 "level": 1,
  Content & Suggestions
  Withdrawal Info
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Dopamine Suggestions (Params)
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  90 "rank": 9
  91 }
  92 ]
  1 GET: {{baseUrl}}/content/withdrawal?habitId={{habitId}}&dayOffset=3
  1 None
  1 {
  2 "id": "73ac709d-9dce-4ee3-bf45-f231b845d80c",
  3 "habitId": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
  4 "dayOffset": 3,
  5 "message": "Peak Nicotine Withdrawal. Your brain is begging for
  a fix—don't give in. It lasts only 3-5 minutes.",
  6 "tone": "empathetic",
  7 "createdAt": "2026-04-26T09:08:04.105017Z"
  8 }
  1 GET: {{baseUrl}}/content/dopamine?habits=smoking,drinking
  1 None
  1 [
  2 {
  3 "id": "d7980bba-614c-43db-ae25-98dbfb362efe",
  4 "suggestion": "Practice 4-7-8 breathing: In for 4, hold for
  7, exhale for 8. Repeat 4 times.",
  5 "category": "mindfulness",
  6 "habitSlugs": [
  7 "smoking",
  8 "vaping",
  Money Spending Suggestion
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  9 "social_media"
  10 ],
  11 "difficulty": "easy",
  12 "createdAt": "2026-04-26T09:08:04.105017Z"
  13 },
  14 {
  15 "id": "691c8b0c-de5d-4776-bc54-6df16c026f7b",
  16 "suggestion": "Listen to one high-energy song and dance
  like nobody is watching.",
  17 "category": "creative",
  18 "habitSlugs": [
  19 "drinking",
  20 "smoking"
  21 ],
  22 "difficulty": "easy",
  23 "createdAt": "2026-04-26T09:08:04.105017Z"
  24 },
  25 {
  26 "id": "3f1e14c2-971b-4af8-bb65-e67e10ffb2a6",
  27 "suggestion": "Eat a small piece of 85%+ dark chocolate. It
  triggers endorphins without the sugar crash.",
  28 "category": "physical",
  29 "habitSlugs": [
  30 "sugar_junk_food",
  31 "drinking"
  32 ],
  33 "difficulty": "easy",
  34 "createdAt": "2026-04-26T09:08:04.105017Z"
  35 }
  36 ]
  1 GET: {{baseUrl}}/content/money?country=IN&amount=1000
  1 None
  1 {
  2 "id": "cc7d522c-2fa3-4251-9653-528afec17721",
  3 "countryCode": "IN",
  4 "amountMin": 501.00,
  5 "amountMax": 1500.00,
  6 "suggestion": "A movie ticket with popcorn for you and a
  friend.",
  7 "category": "Entertainment",
  8 "createdAt": "2026-04-28T13:27:09.439391Z"
  9 }
  Health Milestones
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  1 GET: {{baseUrl}}/content/health-milestones?habitId=
  {{habitId}}&dayOffset=30
  1 None
  1 [
  2 {
  3 "id": "6c4ead6d-f334-413f-aa33-a983b2a42b32",
  4 "habitId": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
  5 "dayOffset": 1,
  6 "title": "CO Levels Normal",
  7 "description": "Carbon monoxide levels in your blood have
  dropped to normal.",
  8 "icon": null,
  9 "sourceNote": null,
  10 "createdAt": "2026-04-28T13:38:20.302756Z"
  11 },
  12 {
  13 "id": "3e556865-05ee-42ca-ba2f-f9a76444e625",
  14 "habitId": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
  15 "dayOffset": 2,
  16 "title": "Nerve Endings Regrow",
  17 "description": "Your ability to smell and taste is enhanced
  as nerve endings start to regrow.",
  18 "icon": null,
  19 "sourceNote": null,
  20 "createdAt": "2026-04-28T13:38:20.302756Z"
  21 },
  22 {
  23 "id": "31e9e2f6-e1ac-4ff0-b3bd-abeaf0abb737",
  24 "habitId": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
  25 "dayOffset": 3,
  26 "title": "Breathing Easier",
  27 "description": "Your bronchial tubes have started to relax,
  making breathing easier and increasing energy levels.",
  28 "icon": null,
  29 "sourceNote": null,
  30 "createdAt": "2026-04-28T13:38:20.302756Z"
  31 },
  32 {
  33 "id": "f18e9a90-e50e-4908-92aa-3fdf8d822267",
  34 "habitId": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
  35 "dayOffset": 14,
  36 "title": "Circulation Improving",
  37 "description": "Blood flow to your hands and feet has
  improved significantly. Your lungs are starting to clear out
  mucus.",
  38 "icon": null,
  39 "sourceNote": null,
  40 "createdAt": "2026-04-28T13:38:20.302756Z"
  41 },
  42 {
  43 "id": "f2a94824-992a-46d5-b227-91e28915d9b6",
  44 "habitId": "9bb35ea9-fcfe-4440-9b6b-3d664f3fcdf0",
  Notifications & Push
  Get Notifications
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  45 "dayOffset": 30,
  46 "title": "Lungs Regenerating",
  47 "description": "Cilia (tiny hair-like structures) in your
  lungs have started to regrow, helping to clean the lungs and reduce
  infection risk.",
  48 "icon": null,
  49 "sourceNote": null,
  50 "createdAt": "2026-04-28T13:38:20.302756Z"
  51 }
  52 ]
  1 GET: {{baseUrl}}/notifications?onlyUnread=false
  1 None
  1 [
  2 {
  3 "id": "84a372ba-26aa-4951-80b9-3abc5ed48c3f",
  4 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  5 "type": "BADGE_EARNED",
  6 "title": "New Badge Earned! 🏅",
  7 "body": "You've earned the '30-Day Legend' badge. Keep it
  up!",
  8 "data": "{\"badgeId\": \"85e1ebcf-baa2-4949-b5fdf632adada74e\", \"badgeName\": \"30-Day Legend\"}",
  9 "isRead": false,
  10 "pushSent": true,
  11 "emailSent": false,
  12 "createdAt": "2026-04-26T09:44:06.415062Z"
  13 },
  14 {
  15 "id": "1b0e0bb3-c89b-486e-99fc-6a58eb69c506",
  16 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  17 "type": "MILESTONE",
  18 "title": "Achievement Unlocked! 🎉",
  19 "body": "You hit 30 days! Incredible work.",
  20 "data": "{\"streak\": 30, \"userHabitId\": \"d9b35c66-5869-
  4372-b85f-36115bf74bd6\"}",
  21 "isRead": false,
  22 "pushSent": true,
  23 "emailSent": false,
  24 "createdAt": "2026-04-26T09:44:06.415062Z"
  25 },
  26 {
  27 "id": "7cc86312-db5f-43b2-a43e-ca5f747442d0",
  28 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  29 "type": "BADGE_EARNED",
  30 "title": "New Badge Earned! 🏅",
  31 "body": "You've earned the 'First Week Warrior' badge. Keep
  it up!",
  32 "data": "{\"badgeId\": \"b6412a25-4375-4035-91d7-
  16858a537b10\", \"badgeName\": \"First Week Warrior\"}",
  33 "isRead": false,
  34 "pushSent": true,
  35 "emailSent": false,
  36 "createdAt": "2026-04-26T09:43:59.814815Z"
  37 },
  38 {
  39 "id": "093e24b0-9e23-4870-9e7d-1139a8e5d8ae",
  40 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  41 "type": "BADGE_EARNED",
  42 "title": "New Badge Earned! 🏅",
  43 "body": "You've earned the 'Day One' badge. Keep it up!",
  44 "data": "{\"badgeId\": \"7105b5ed-3aad-444f-a121-
  59a0766c505c\", \"badgeName\": \"Day One\"}",
  45 "isRead": false,
  46 "pushSent": true,
  47 "emailSent": false,
  48 "createdAt": "2026-04-26T09:43:59.814815Z"
  49 },
  50 {
  51 "id": "56bf70bf-0824-4cf5-ae69-a9967014516b",
  52 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  53 "type": "BADGE_EARNED",
  54 "title": "New Badge Earned! 🏅",
  55 "body": "You've earned the 'Two Week Titan' badge. Keep it
  up!",
  56 "data": "{\"badgeId\": \"ddd06ea6-9e4a-4443-b4bf25574ccf3928\", \"badgeName\": \"Two Week Titan\"}",
  57 "isRead": false,
  58 "pushSent": true,
  59 "emailSent": false,
  60 "createdAt": "2026-04-26T09:43:59.814815Z"
  61 },
  62 {
  63 "id": "5f392dde-3de5-49a3-9f53-b375381976d8",
  64 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  65 "type": "BADGE_EARNED",
  66 "title": "New Badge Earned! 🏅",
  67 "body": "You've earned the 'Smart Money' badge. Keep it
  up!",
  68 "data": "{\"badgeId\": \"a5b54b05-d33d-4dc6-afc5-
  76feb9b61000\", \"badgeName\": \"Smart Money\"}",
  69 "isRead": false,
  70 "pushSent": true,
  71 "emailSent": false,
  72 "createdAt": "2026-04-26T09:39:52.934767Z"
  73 },
  74 {
  75 "id": "df418182-0ed4-4ff2-a52b-65102d24232d",
  76 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  77 "type": "BADGE_EARNED",
  78 "title": "New Badge Earned! 🏅",
  79 "body": "You've earned the 'Rising Again' badge. Keep it
  up!",
  80 "data": "{\"badgeId\": \"44cd14d6-451a-4612-a845-
  868693b5f472\", \"badgeName\": \"Rising Again\"}",
  81 "isRead": false,
  82 "pushSent": true,
  83 "emailSent": false,
  84 "createdAt": "2026-04-26T09:36:30.094667Z"
  85 },
  86 {
  87 "id": "b5970ac7-5595-4473-b5a5-b0975d5caa44",
  88 "userId": "f832b956-832e-4acc-9ec7-a5911348b44b",
  89 "type": "BADGE_EARNED",
  90 "title": "New Badge Earned! 🏅",
  Mark as Read
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  Mark All as Read
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  91 "body": "You've earned the 'Saver' badge. Keep it up!",
  92 "data": "{\"badgeId\": \"d005ab4a-5629-4611-bb69-
  8e0ca011aaf0\", \"badgeName\": \"Saver\"}",
  93 "isRead": false,
  94 "pushSent": true,
  95 "emailSent": false,
  96 "createdAt": "2026-04-26T09:34:43.614893Z"
  97 }
  98 ]
  1 PUT: {{baseUrl}}/notifications/{{notificationId}}/read
  1 None
  1 {
  2 "message": "Notification 'New Friend Request' marked as read",
  3 "type": "friend_request"
  4 }
  5
  1 PUT: {{baseUrl}}/notifications/read-all
  1 None
  1 {
  2 "message": "Successfully marked 14 notifications as read",
  3 "count": 14
  4 }
  5 or
  6 {
  7 "message": "No unread notifications to mark",
  8 "count": 0
  9 }
  Get VAPID Public Key
  Request URL:
  Payload:
  Authorization: Bearer token from Login API response
  Response
  VAPID (Voluntary Application Server Identification) keys are basically a "Digital ID Card" for your backend
  server.
  When you want to send a push notification to a user's browser (Chrome, Safari, etc.), the
  browser needs to know that the notification is coming from your specific server and not a
  random hacker or spammer.
  Here is how the two keys work together:

1. The Public Key (The "Handshake")
   This key is safe to share with the world.
   Your frontend (the browser) uses this key when asking the user for permission: "Do you want
   to receive notifications?"
   The browser registers this key so it knows to only listen for messages signed by your
   corresponding private key.
2. The Private Key (The "Signature")
   Keep this secret! Never share it.
   Every time your backend wants to send a notification (like a "Daily Reminder" or "New Badge
   Earned"), it uses this private key to "sign" the message.
   The Push Service (Google or Apple) checks the signature using your Public Key to verify it's
   really you.
   1 GET: {{baseUrl}}/push/vapid-public-key
   1 None
   1 {
   2 "publicKey": "BOYBizT3-
   5U22nJyLQEDuFXN9YpsnJz2uFAMJP9Quwu451Qt4GjcfWlgABvno78UiXkr_aMw68rki
   C8Ih08S67s"
   3 }
   Why do we need it?
   Without VAPID, push services wouldn't know who is sending what. It prevents:
3. Spam: Only you can send messages to your subscribers.
4. Privacy issues: It creates a secure, encrypted link between your server and the user's
   device.
   In short: It’s the "Password" that authorizes your backend to talk to your users' browsers.
   Subscribe to Push (Enable Push Notification)
   Request URL:
   Payload:
   Authorization: Bearer token from Login API response
   Response
   This is what enables the notifications, and here is how it behaves on mobile and in the background:
5. Does it work on phones?
   Yes.
   Android: Works perfectly in Chrome, Edge, and other browsers.
   iOS (iPhone): It works, but with one condition: the user must "Add to Home Screen" your
   web app first. Once it's an icon on their home screen, it behaves just like a native app and can
   receive push notifications.
6. Does it work when the browser is closed?
   Yes. This is the "magic" of Web Push. It uses something called a Service Worker—a tiny script
   that lives in the browser's background even after you close the tab or the app.
   1 GET: {{baseUrl}}/push/vapid-public-key
   1 {
   2 "endpoint": "https://fcm.googleapis.com/fcm/send/example-endpoint-id123",
   3 "p256dh":
   "BLm5L8nO5vQ_pGq7Y7z7vYm9J6L5nO5vQ_pGq7Y7z7vYm9J6L5nO5vQ_pGq7Y7z7vY",
   4 "auth": "m5L8nO5vQ_pGq7Y7z7vY"
   5 }
   1 {
   2 "message": "Notifications enabled! This is a great step to stay
   committed—we've got your back on this journey."
   3 }
   When your backend sends a notification, the browser (or the phone's OS) wakes up that
   Service Worker.
   The Service Worker then displays the notification popup to the user.
   Summary of the Flow:
7. Tab Open: User subscribes.
8. Tab Closed: User goes about their day.
9. Backend Event: Your server sends a "New Challenge!" message.
10. OS/Browser: Receives the message, finds the Service Worker, and pops up the alert on the
    user's lock screen.
    This allows your web app to "feel" like a native Android or iOS app without the user having to
    download it from an App Store.
    How Payload is Constructed:
    Here’s the simple confirmation of what you said:
11. Every Browser has its own Push API: When you call subscribe() in your code, the
    browser (Chrome, Safari, etc.) actually reaches out to its own respective Push Service
    (Google's FCM for Chrome, Apple's APNs for Safari) to create a unique "mailbox" for that
    specific user.
12. The Browser Generates the Details: The browser then returns that Endpoint (the mailbox
    address), the p256dh (the encryption key), and the Auth (the secret handshake) back to your
    UI.
13. Your UI Sends it to Your Backend: Your UI code doesn't create these values; it just collects
    them from the browser and sends them to your {{baseUrl}}/push/subscribe API so
    your backend knows how to "address" notifications to that user in the future.
    It's essentially the browser doing the heavy lifting of talking to Google/Apple, and your UI just
    acting as the middleman to pass that "address" to your database!
    UnSubscribe to Push (Disable Push Notification)
    Request URL:
    Payload:
    1 DELETE: {{baseUrl}}/push/unsubscribe?
    endpoint=https://fcm.googleapis.com/fcm/send/example-endpoint-id-123
    Authorization: Bearer token from Login API response
    Response
    Payments & Status
    Subscribe to Push (Enable Push Notification)
    Request URL:
    Payload:
    Authorization: Bearer token from Login API response
    Response
    1 None
    1 //when days<30
    2 {
    3 "message": "Unsubscribed. You're still early in your journey (2
    days clean). We recommend staying connected for another few weeks
    for maximum support!"
    4 }
    5 //when days<90
    6 {
    7 "message": "Unsubscribed. 45 days clean is a huge achievement!
    Stay vigilant—you've got this, and we're proud of how far you've
    come."
    8 }
    9 //when days>90
    10 {
    11 "message": "Unsubscribed. 120 days clean! We trust that you've
    built the strength to stay safe and healthy now. We're so happy to
    have helped you on this path."
    12 }
    1 DELETE: {{baseUrl}}/push/unsubscribe?
    endpoint=https://fcm.googleapis.com/fcm/send/example-endpoint-id-123
    1 None
    Subscribe to Push (Enable Push Notification)
    Request URL:
    Payload:
    Authorization: Bearer token from Login API response
    Response
    Get Subscription Status
    Request URL:
    Payload:
    1 //when days<30
    2 {
    3 "message": "Unsubscribed. You're still early in your journey (2
    days clean). We recommend staying connected for another few weeks
    for maximum support!"
    4 }
    5 //when days<90
    6 {
    7 "message": "Unsubscribed. 45 days clean is a huge achievement!
    Stay vigilant—you've got this, and we're proud of how far you've
    come."
    8 }
    9 //when days>90
    10 {
    11 "message": "Unsubscribed. 120 days clean! We trust that you've
    built the strength to stay safe and healthy now. We're so happy to
    have helped you on this path."
    12 }
    1 POST: {{baseUrl}}/payments/checkout
    1 {
    2 "successUrl": "http://localhost:3000/success",
    3 "cancelUrl": "http://localhost:3000/cancel"
    4 }
    1 {
    2 "url":
    "https://checkout.stripe.com/c/pay/cs_test_a1aZMQrJKbGyslnX5hKkaUlns
    mLmcCMmKaRSpVVCLkghpuw1meg1vJ2nPq#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEn
    KSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMD
    RWQU93MkJnbmxOYkcwQnMxfGNJPDc0XzBXX0hXTGpcQWJqMEJHMnIwaVNidHRGcj01XU
    hqMjJuYUFqRFJQfG93MmRQQlduNlZJdzZJVH1dXFJRTmtWdGY1NWtKPVNDfE1RJyknY3
    dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpw
    cVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
    3 }
    1 GET: {{baseUrl}}/payments/status
    Authorization: Bearer token from Login API response
    Response
    1 {
    2 "returnUrl": "http://localhost:3000/settings"
    3 }
    1 {
    2 "status": "inactive",
    3 "tier": "free"
    4 }
    5 or
    6 {
    7 "status": "active",
    8 "tier": "premium"
    9 }
    10
