/**
 * Historical Data Seeder for Unshackled
 * This script simulates 4 months of habit tracking for a test user.
 */
const BASE_URL = 'http://localhost:8080/api';

async function seed() {
    console.log("🚀 Starting historical data simulation...");

    try {
        const timestamp = Date.now();
        const quitDateStr = new Date(Date.now() - (120 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

        // 1. Register User
        const registerRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `legend_${timestamp}@example.com`,
                password: 'password123',
                username: `legend_${Math.floor(Math.random() * 1000)}`,
                displayName: 'Legend Warrior',
                isSupporter: true,
                country: 'IN',
                currency: 'INR'
            })
        });

        const authData = await registerRes.json();
        const token = authData.access_token || authData.session?.access_token;
        
        if (!token) {
            console.error("❌ Failed to get auth token. Response:", authData);
            return;
        }
        const userId = authData.user.id;
        console.log("✅ User registered and authenticated. ID:", userId);

        // 2. Fetch Habits to get IDs
        const habitsRes = await fetch(`${BASE_URL}/habits`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const allHabits = await habitsRes.json();
        const smokingHabitId = allHabits.find(h => h.slug === 'smoking').id;

        // 3. Add User Habit (Smoking only to bypass free tier limit)
        const addHabit = async (habitId, config) => {
            const res = await fetch(`${BASE_URL}/habits/mine`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ habitId, quitDate: quitDateStr, ...config })
            });
            const data = await res.json();
            if (!res.ok) {
                console.error("❌ Add Habit Failed:", data);
                throw new Error("Habit creation failed");
            }
            return data;
        };

        const userSmoking = await addHabit(smokingHabitId, { cigarettesPerDay: 10, costPerCigarette: 15 });
        console.log("✅ Smoking habit added to user profile.");

        // 4. Backdate Check-ins (Last 120 days)
        const checkIn = async (userHabitId, date, status, mood, slipReason) => {
            const res = await fetch(`${BASE_URL}/checkins`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    userHabitId,
                    status,
                    mood,
                    slipReason,
                    checkinDate: date.toISOString().split('T')[0]
                })
            });
        };

        console.log("⏳ Simulating 120 days of check-ins for Smoking...");

        for (let i = 120; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Smoking logic: Slips at 100, 70, 30 days ago to show a "struggling but succeeding" pattern
            let status = 'clean';
            let mood = 'CALM';
            let reason = null;

            if (i === 100) { status = 'slipped'; mood = 'STRESSED'; reason = 'WORK_PRESSURE'; }
            if (i === 70)  { status = 'slipped'; mood = 'ANXIOUS';  reason = 'SOCIAL_PRESSURE'; }
            if (i === 30)  { status = 'slipped'; mood = 'BORED';    reason = 'BOREDOM'; }

            await checkIn(userSmoking.id, date, status, mood, reason);

            if (i % 20 === 0) console.log(`... ${i} days remaining`);
        }

        console.log("✅ Simulation complete!");
        console.log(`\n--- TEST DATA READY ---`);
        console.log(`Email: legend_${timestamp}@example.com`);
        console.log(`Token: ${token}`);
        console.log(`------------------------\n`);

        console.log("✅ Simulation complete!");
        console.log(`\n--- TEST DATA READY ---`);
        console.log(`Email: legend_${timestamp}@example.com`);
        console.log(`Token: ${token}`);
        console.log(`------------------------\n`);

    } catch (err) {
        console.error("❌ Error during seeding:", err.message);
    }
}

seed();
