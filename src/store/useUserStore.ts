import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserState {
  // --- Persisted State ---
  hasCompletedOnboarding: boolean;
  totalXP: number;
  currentStreak: number;
  totalSessions: number;
  minutesMeditated: number;

  // --- Actions ---
  completeOnboarding: () => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  logSession: (durationInMinutes: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Default values
      hasCompletedOnboarding: false,
      totalXP: 0,
      currentStreak: 0,
      totalSessions: 0,
      minutesMeditated: 0,

      // Actions
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      addXP: (amount) =>
        set((state) => ({ totalXP: state.totalXP + amount })),

      incrementStreak: () =>
        set((state) => ({ currentStreak: state.currentStreak + 1 })),

      logSession: (durationInMinutes) =>
        set((state) => ({
          totalSessions: state.totalSessions + 1,
          minutesMeditated: state.minutesMeditated + durationInMinutes,
        })),
    }),
    {
      name: 'serenova-user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
