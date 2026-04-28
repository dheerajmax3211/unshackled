"use client";

import { useEffect, useRef } from "react";
import { getMe } from "@/lib/api/users";
import { getMyHabits } from "@/lib/api/habits";
import { getMyStreaks } from "@/lib/api/streaks";
import { getNotifications } from "@/lib/api/notifications";
import { getChallenges } from "@/lib/api/challenges";
import { useRouter, usePathname } from "next/navigation";

import { useUserStore } from "@/store/useUserStore";
import { useHabitStore } from "@/store/useHabitStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useChallengeStore } from "@/store/useChallengeStore";
import { useAuth } from "@/hooks/useAuth";

/**
 * StoreHydrator is a Client Component that synchronizes the global Zustand stores
 * with the backend data upon initial mount and whenever the authentication session changes.
 */
export function StoreHydrator({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const hydrated = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  // Get store setters
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const setUserLoading = useUserStore((state) => state.setLoading);

  const setHabits = useHabitStore((state) => state.setHabits);
  const setStreaks = useHabitStore((state) => state.setStreaks);
  const setHabitLoading = useHabitStore((state) => state.setLoading);

  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const setNotificationLoading = useNotificationStore((state) => state.setLoading);

  const setChallenges = useChallengeStore((state) => state.setChallenges);
  const setChallengeLoading = useChallengeStore((state) => state.setLoading);

  useEffect(() => {
    // If auth is still loading, do nothing yet
    if (authLoading) return;

    // If no session exists, clear the stores (handles logout)
    if (!session) {
      clearUser();
      setHabits([]);
      setStreaks([]);
      setNotifications([]);
      setChallenges([]);
      hydrated.current = false;
      return;
    }

    // Prevent multiple concurrent hydrations if session didn't change
    if (hydrated.current) return;

    async function hydrate() {
      try {
        setUserLoading(true);
        setHabitLoading(true);
        setNotificationLoading(true);
        setChallengeLoading(true);

        // Fetch all essential data in parallel
        const [user, habits, streaks, notifications, challenges] = await Promise.all([
          getMe(),
          getMyHabits(),
          getMyStreaks(),
          getNotifications(false),
          getChallenges(),
        ]);

        // Populate stores
        setUser(user);
        setHabits(habits);
        setStreaks(streaks);
        setNotifications(notifications);
        setChallenges(challenges);

        // Redirect if onboarding is not complete
        if (!user.onboardingCompleted && !pathname.startsWith("/onboarding")) {
          router.push("/onboarding");
        }

        hydrated.current = true;
      } catch (error) {
        console.error("Failed to hydrate global stores:", error);
        // We don't clear user here to avoid redirect loops if it's just a transient API error
      } finally {
        setUserLoading(false);
        setHabitLoading(false);
        setNotificationLoading(false);
        setChallengeLoading(false);
      }
    }

    hydrate();
  }, [
    session,
    authLoading,
    clearUser,
    setHabits,
    setStreaks,
    setUser,
    setNotifications,
    setChallenges,
    setUserLoading,
    setHabitLoading,
    setNotificationLoading,
    setChallengeLoading,
  ]);

  return <>{children}</>;
}
