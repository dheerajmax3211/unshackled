import { create } from "zustand";
import { Challenge } from "@/lib/api/types";

interface ChallengeState {
  activeChallenges: Challenge[];
  pendingReview: Challenge[];
  loading: boolean;

  // Actions
  setChallenges: (challenges: Challenge[]) => void;
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  removeChallenge: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Global store for accountability challenges.
 * Segregates challenges into active ones (sent/received) and those awaiting user review.
 */
export const useChallengeStore = create<ChallengeState>((set) => ({
  activeChallenges: [],
  pendingReview: [],
  loading: false,

  /**
   * Initializes the challenge state from a list (e.g., from getChallenges API).
   * Automatically sorts them into active and pending review categories.
   */
  setChallenges: (allChallenges) => {
    set({
      activeChallenges: allChallenges.filter((c) => c.status === "pending"),
      pendingReview: allChallenges.filter((c) => c.status === "responded"), // Awaiting friend review
      loading: false,
    });
  },

  /**
   * Adds a new challenge to the active list.
   */
  addChallenge: (challenge) =>
    set((state) => ({
      activeChallenges: [challenge, ...state.activeChallenges],
    })),

  /**
   * Updates an existing challenge's state and re-categorizes if necessary.
   */
  updateChallenge: (id, updates) =>
    set((state) => {
      const allChallenges = [...state.activeChallenges, ...state.pendingReview];
      const updatedList = allChallenges.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );

      return {
        activeChallenges: updatedList.filter((c) => c.status === "pending"),
        pendingReview: updatedList.filter((c) => c.status === "responded"),
      };
    }),

  /**
   * Removes a challenge from the store (e.g., if deleted).
   */
  removeChallenge: (id) =>
    set((state) => ({
      activeChallenges: state.activeChallenges.filter((c) => c.id !== id),
      pendingReview: state.pendingReview.filter((c) => c.id !== id),
    })),

  /**
   * Manually toggles the loading state.
   */
  setLoading: (loading) => set({ loading }),
}));
