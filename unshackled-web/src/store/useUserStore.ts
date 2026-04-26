import { create } from "zustand";
import { UserResponse } from "@/lib/api/types";

interface UserState {
  user: UserResponse | null;
  loading: boolean;
  setUser: (user: UserResponse | null) => void;
  updateUser: (updates: Partial<UserResponse>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Global store for user profile data.
 * Handles the state of the currently authenticated user across the application.
 */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true, // Initialized to true while we verify session

  /**
   * Sets the full user profile.
   */
  setUser: (user) => set({ user, loading: false }),

  /**
   * Updates specific fields of the user profile without replacing the entire object.
   */
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  /**
   * Clears the user state (on logout).
   */
  clearUser: () => set({ user: null, loading: false }),

  /**
   * Manually toggles the loading state.
   */
  setLoading: (loading) => set({ loading }),
}));
