# Unshackled API Definitions

This document provides a detailed breakdown of each API endpoint in the Unshackled platform, including its primary function and how it drives the User Interface (UI).

---

## 1. Auth Controller

### **Login (Supabase Proxy)**
- **Endpoint:** `POST /auth/login`
- **Definition:** Authenticates the user via Supabase, returning a JWT access token and user metadata.
- **UI Use Case:** Used on the **Login Page**. The UI stores the returned `access_token` in secure storage (like a cookie or localStorage) to authorize all subsequent API calls. It also uses the `user` object to populate the initial app state (username, email, etc.).

### **Create New User**
- **Endpoint:** `POST /auth/register`
- **Definition:** Registers a new user account in both Supabase Auth and the local application database.
- **UI Use Case:** Used on the **Sign Up Page**. Upon success, the UI automatically logs the user in and redirects them to the **Onboarding Flow**.

---

## 2. Users Controller

### **Create User Profile**
- **Endpoint:** `POST /users`
- **Definition:** Initializes the application-specific user profile data (username, display name, etc.) after authentication.
- **UI Use Case:** Triggered automatically during the **Onboarding Process** if a user is logging in for the first time. It ensures the local database is synced with the Supabase Auth record.

### **Update Profile**
- **Endpoint:** `PATCH /users/me`
- **Definition:** Updates the authenticated user's profile information, including bio, avatar, and notification preferences.
- **UI Use Case:** Used in the **Settings/Profile Page**. It allows users to personalize their experience, change their daily reminder time, and toggle leaderboard participation.

### **Get My Profile**
- **Endpoint:** `GET /users/me`
- **Definition:** Retrieves the full profile details for the currently authenticated user.
- **UI Use Case:** Used across the entire app to fetch the user's current status (e.g., if they are a **Premium/Sovereign** user or a **Supporter**). It’s essential for the **Dashboard** and **Settings** views.

### **Get Public Profile**
- **Endpoint:** `GET /users/{username}`
- **Definition:** Retrieves the public-facing profile of another user by their unique username.
- **UI Use Case:** Used when a user clicks on a friend or a stranger in the **Leaderboard**. It shows the target user's bio, level, and recent badges (social proof).

### **Delete My Account**
- **Endpoint:** `DELETE /users/me`
- **Definition:** Permanently removes the user's account and all associated data (habits, check-ins, journal entries).
- **UI Use Case:** A "danger zone" action in the **Settings Page**. The UI should wrap this in a confirmation modal to prevent accidental deletion.

---

## 3. Onboarding & Habits Controller

### **Get Onboarding Status**
- **Endpoint:** `GET /onboarding/status`
- **Definition:** Checks if the user has completed the initial onboarding flow (setting up their first habit).
- **UI Use Case:** Used as a **Root Redirector**. If the app loads and this returns `onboardingCompleted: false`, the UI forces the user into the **Onboarding Wizard** before showing the Dashboard.

### **Complete Onboarding**
- **Endpoint:** `POST /onboarding/complete`
- **Definition:** Saves the user's initial habit selection and profile setup in one batch operation.
- **UI Use Case:** The final step of the **Onboarding Wizard**. Once submitted, the UI shows a celebration animation (Three.js) and unlocks the main Dashboard.

### **Get Habit Catalog**
- **Endpoint:** `GET /habits`
- **Definition:** Fetches a list of all supported habits (Smoking, Drinking, Vaping, etc.) that users can track.
- **UI Use Case:** Used in the **"Add New Habit" Modal** or the **Onboarding habit selection screen**. It provides the display names and icons for the grid of options.

### **Get My Habits**
- **Endpoint:** `GET /habits/mine`
- **Definition:** Retrieves all habits that the current user is actively (or has previously) tracked.
- **UI Use Case:** Populates the **Habits List** on the Dashboard. It includes configuration details like "cigarettes per day" or "pod cost" to calculate savings.

### **Add Single Habit**
- **Endpoint:** `POST /habits/mine`
- **Definition:** Allows an existing user to start tracking a new habit.
- **UI Use Case:** Used in the **"Add New Habit" flow**. Note: The UI must handle the `402 Payment Required` error if a free user tries to add a second habit, prompting them to upgrade to **Sovereign Premium**.

### **Update Habit Config**
- **Endpoint:** `PUT /habits/mine/{userHabitId}`
- **Definition:** Updates the configuration for a specific habit (e.g., increasing the cost per session or changing the quit date).
- **UI Use Case:** Used in the **Habit Settings** screen. Users can fine-tune their tracking parameters as their life situation changes.

### **Deactivate Habit**
- **Endpoint:** `DELETE /habits/mine/{userHabitId}`
- **Definition:** Stops tracking a specific habit without deleting the history.
- **UI Use Case:** Used in **Habit Settings**. The UI should mark the habit as "Archived" or remove it from the active Dashboard.

---

## 4. Check-ins & History

### **Submit Check-in**
- **Endpoint:** `POST /checkins`
- **Definition:** Reports the daily status of a habit (Clean or Slipped), along with mood and optional notes.
- **UI Use Case:** The most frequent interaction in the app! Used in the **Daily Check-in Card**. Upon submission, the UI displays XP earned, new streaks, and potentially a **Withdrawal Empathy Message** if the user slipped.

### **Check-in History**
- **Endpoint:** `GET /checkins/history/{userHabitId}`
- **Definition:** Retrieves a chronological list of check-ins for a specific habit.
- **UI Use Case:** Used to build the **Activity Feed** or **History Tab** for a habit. It shows the user's journey over the last 30+ days, including their notes and mood trends.

### **Has Checked In Today?**
- **Endpoint:** `GET /checkins/today`
- **Definition:** A quick check to see if the user has already reported their status for the current day.
- **UI Use Case:** Drives the **Dashboard Reminder**. If `false`, the UI displays a prominent "Time to Check-in" call-to-action (CTA).

---

## 5. Streaks

### **Get All My Streaks**
- **Endpoint:** `GET /streaks`
- **Definition:** Fetches current and longest streak data for all of the user's habits.
- **UI Use Case:** Used on the **Main Dashboard** to show the large "Days Clean" numbers. It’s the primary motivational metric shown to the user.

### **Get Specific Habit Streak**
- **Endpoint:** `GET /streaks/{userHabitId}`
- **Definition:** Retrieves detailed streak metrics for a single habit.
- **UI Use Case:** Used on the **Habit Detail Page**. It allows for habit-specific deep dives into progress and consistency.

---

## 6. Friends & Search

### **Search Users**
- **Endpoint:** `GET /friends/search`
- **Definition:** Searches the platform for other users by username or display name.
- **UI Use Case:** Used in the **"Add Friends" search bar**. It provides a list of potential accountability partners to connect with.

### **Send Friend Request**
- **Endpoint:** `POST /friends/request`
- **Definition:** Sends an invitation to another user to become accountability partners.
- **UI Use Case:** Triggered when the user clicks "Connect" on a search result. The UI should show a "Pending" state after this call.

### **Get Pending Requests**
- **Endpoint:** `GET /friends/pending`
- **Definition:** Retrieves a list of friend requests that the current user has received and not yet answered.
- **UI Use Case:** Populates the **Notification Center** or **Social Tab** with a "New Request" badge, allowing the user to Accept or Decline.

### **Respond to Friend Request**
- **Endpoint:** `PUT /friends/{friendId}/respond`
- **Definition:** Accepts or declines a pending friend request.
- **UI Use Case:** Used for the "Accept" and "Decline" buttons in the **Social Tab**. Accepting immediately creates a reciprocal social link.

### **Get Friends List**
- **Endpoint:** `GET /friends`
- **Definition:** Retrieves a list of all confirmed accountability partners.
- **UI Use Case:** Populates the **Social/Friends Feed**. It allows users to see their friends' progress and send challenges (if implemented).

### **Remove Friend**
- **Endpoint:** `DELETE /friends/{friendId}`
- **Definition:** Ends an accountability partnership.
- **UI Use Case:** A settings option within the **Friends List**. It allows users to prune their social network.

---

## 7. Analytics & Dashboard

### **Dashboard Summary**
- **Endpoint:** `GET /dashboard/summary`
- **Definition:** A high-level aggregate of active habits, money saved (today/week/month), current level, and recent badges.
- **UI Use Case:** The **primary data source for the Main Dashboard**. It provides everything needed to render the "Overview" screen in a single request, including the **Today's Motivational Message**.

### **Money Saved Breakdown**
- **Endpoint:** `GET /analytics/money/{userHabitId}`
- **Definition:** Calculates exactly how much money the user has saved for a specific habit across different timeframes.
- **UI Use Case:** Populates the **"Money Saved" widget**. The UI uses these numbers to show progress toward financial goals.

### **Graph-Ready Analytics**
- **Endpoint:** `GET /analytics/money/{userHabitId}/series`
- **Definition:** Returns time-series data (Daily, Weekly, Monthly) formatted specifically for charts.
- **UI Use Case:** Directly feeds into **Chart components (like Recharts or Chart.js)** to show the growth of savings over time.

### **Heatmap Data**
- **Endpoint:** `GET /analytics/heatmap/{userHabitId}`
- **Definition:** Provides a simplified map of check-in statuses (Clean/Slipped) for the last 12 months.
- **UI Use Case:** Renders a **GitHub-style contribution grid** (Heatmap) for the habit. Darker or distinct colors represent "Clean" days, creating a visual "Don't Break the Chain" effect.

### **Global Stats**
- **Endpoint:** `GET /analytics/global`
- **Definition:** Returns platform-wide aggregates (Total Users, Total Money Saved).
- **UI Use Case:** Used on the **Public Landing Page** or **App Stats screen** to provide social proof of the app's impact on the global community.

---

## 8. Journal

### **Save Entry**
- **Endpoint:** `POST /journal`
- **Definition:** Saves a daily reflection, mood score, triggers, and "what helped" information.
- **UI Use Case:** Used on the **Journaling Page**. It rewards the user with XP for practicing mindfulness and helps them identify patterns in their recovery.

### **Get My Entries**
- **Endpoint:** `GET /journal`
- **Definition:** Retrieves a list of the user's past journal entries.
- **UI Use Case:** Populates the **Journal History Feed**. Users can scroll through their past thoughts and mood trends.

### **Get Entry by Date**
- **Endpoint:** `GET /journal/{date}`
- **Definition:** Fetches the specific journal entry for a given day.
- **UI Use Case:** Used in the **Calendar View**. When a user clicks a specific date, the UI calls this to show what they wrote that day.

### **Get Shared Entries**
- **Endpoint:** `GET /journal/shared`
- **Definition:** Retrieves journal entries shared by friends for accountability.
- **UI Use Case:** Populates the **"Friends Activity" Feed**. It allows users to see their friends' reflections (if they opted to share) and provide support.

---

## 9. Gamification

### **XP Summary**
- **Endpoint:** `GET /xp/summary`
- **Definition:** Provides current XP, level progress (XP needed for next level), and a history of recent XP-earning events.
- **UI Use Case:** Drives the **XP Progress Bar** and **Level Badge** in the UI header. The event list is often shown in a "Recent Activity" or "Quest Log" section.

### **Earned Badges**
- **Endpoint:** `GET /badges/earned`
- **Definition:** Lists all badges the user has unlocked, including description and rarity.
- **UI Use Case:** Populates the **"Badges/Trophy Case" screen**. It celebrates milestones and encourages users to "collect them all."

---

## 10. Leaderboard

### **Friends Leaderboard**
- **Endpoint:** `GET /leaderboard/friends`
- **Definition:** Ranks the user and their friends based on total XP and clean days.
- **UI Use Case:** Populates the **"Friends" tab on the Leaderboard screen**. It creates healthy competition and social accountability.

### **Global Leaderboard**
- **Endpoint:** `GET /leaderboard/global`
- **Definition:** Ranks all users on the platform who have opted into the leaderboard.
- **UI Use Case:** Populates the **"Global" tab on the Leaderboard screen**. It lets users see how they stack up against the entire community.

---

## 11. Content & Suggestions

### **Withdrawal Info**
- **Endpoint:** `GET /content/withdrawal`
- **Definition:** Fetches habit-specific medical/psychological info for a specific day clean.
- **UI Use Case:** Used to show **"What's happening in your body right now"** cards on the habit detail page. It provides science-backed motivation.

### **Dopamine Suggestions**
- **Endpoint:** `GET /content/dopamine`
- **Definition:** Provides healthy alternatives for dopamine stimulation (Breathing, Exercise, Cold Showers).
- **UI Use Case:** Used in the **"Emergency / Craving" tool**. When a user feels a craving, the UI presents these "Dopamine Resets" to help them through the moment.

### **Money Spending Suggestion**
- **Endpoint:** `GET /content/money`
- **Definition:** Maps a saved amount to a culturally relevant purchase (e.g., "You've saved enough for a road trip!").
- **UI Use Case:** Used on the **Dashboard** to make abstract savings feel "real" and rewarding.

### **Health Milestones**
- **Endpoint:** `GET /content/health-milestones`
- **Definition:** Lists scientific health improvements (e.g., "Lung cilia regenerating") for a specific duration.
- **UI Use Case:** Populates the **Health Timeline** view. It’s a powerful visual of the physical benefits of quitting.

---

## 12. Notifications & Push

### **Get Notifications**
- **Endpoint:** `GET /notifications`
- **Definition:** Retrieves in-app notifications (Badge alerts, Friend requests, Streak milestones).
- **UI Use Case:** Populates the **Notification Drawer (Bell icon)**. It keeps the user informed about social and gamification events.

### **Mark as Read / Read All**
- **Endpoint:** `PUT /notifications/.../read`
- **Definition:** Clears notification badges by marking them as viewed.
- **UI Use Case:** Triggered when the user opens the notification drawer or clicks a specific item.

### **VAPID Public Key**
- **Endpoint:** `GET /push/vapid-public-key`
- **Definition:** Provides the server's public key needed to initialize the browser's Push API.
- **UI Use Case:** Used in the **Settings/Onboarding** when the user clicks "Enable Notifications". The UI uses this key to register the Service Worker.

### **Subscribe to Push**
- **Endpoint:** `POST /push/subscribe`
- **Definition:** Saves the browser's unique push endpoint and encryption keys to the backend.
- **UI Use Case:** The final step of the **"Enable Push" flow**. Once this is called, the backend can send real-time alerts to the user's device.

### **Unsubscribe from Push**
- **Endpoint:** `DELETE /push/unsubscribe`
- **Definition:** Disables push notifications and returns a final empathetic message.
- **UI Use Case:** Used in **Settings**. The backend returns a motivational message (e.g., "45 days clean is huge!") to remind the user of their progress even as they turn off notifications.

---

## 13. Payments & Status

### **Create Checkout Session**
- **Endpoint:** `POST /payments/checkout`
- **Definition:** Generates a Stripe Checkout URL for the Sovereign Premium subscription.
- **UI Use Case:** Triggered when the user clicks **"Upgrade to Sovereign"**. The UI redirects the user to the Stripe-hosted payment page.

### **Get Subscription Status**
- **Endpoint:** `GET /payments/status`
- **Definition:** Returns the user's current payment tier (`free` or `premium`) and subscription status (`active`, `inactive`).
- **UI Use Case:** Critical for **Feature Gating**. The UI checks this to decide whether to show the "Upgrade" button or unlock "Unlimited Habits" and "Advanced Analytics."
