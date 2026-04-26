import { create } from "zustand";

interface HabitConfig {
  habitId: string;
  quitDate: string;
  config: Record<string, any>;
}

interface OnboardingState {
  // Navigation
  step: number;
  
  // Basic Profile Info (Temporary until submission)
  username: string;
  displayName: string;
  country: string;
  currency: string;
  
  // Selection
  selectedHabitIds: string[]; // UUIDs of the habits selected from the catalog
  habitConfigs: Record<string, any>; // habitId -> custom config (e.g., cigarettesPerDay)
  
  // Global Settings
  quitDate: string; // Default quit date if not habit-specific
  isSupporter: boolean;
  
  // Actions
  setProfileInfo: (info: { username: string; displayName: string; country: string; currency: string }) => void;
  setSelectedHabitIds: (ids: string[]) => void;
  setHabitConfig: (habitId: string, config: Record<string, any>) => void;
  setGlobalQuitDate: (date: string) => void;
  setSupporter: (isSupporter: boolean) => void;
  
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  reset: () => void;
}

/**
 * Transient store for the onboarding flow.
 * Holds multi-step form data before it is submitted to the backend.
 */
export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  username: "",
  displayName: "",
  country: "IN",
  currency: "INR",
  selectedHabitIds: [],
  habitConfigs: {},
  quitDate: new Date().toISOString().split("T")[0],
  isSupporter: false,

  setProfileInfo: (info) => set((state) => ({ ...state, ...info })),

  setSelectedHabitIds: (ids) => set({ selectedHabitIds: ids }),

  setHabitConfig: (habitId, config) =>
    set((state) => ({
      habitConfigs: {
        ...state.habitConfigs,
        [habitId]: { ...state.habitConfigs[habitId], ...config },
      },
    })),

  setGlobalQuitDate: (quitDate) => set({ quitDate }),

  setSupporter: (isSupporter) => set({ isSupporter }),

  nextStep: () => set((state) => ({ step: state.step + 1 })),

  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),

  setStep: (step) => set({ step }),

  reset: () =>
    set({
      step: 1,
      selectedHabitIds: [],
      habitConfigs: {},
      isSupporter: false,
    }),
}));
