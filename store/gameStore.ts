'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, GameActions } from '@/types'

const initialState: GameState = {
  coins: 0,
  currentStreak: 0,
  lives: 3,
  unlockedLevels: [1],
  completedLevels: [],
  newlyUnlocked: null,
  hydrated: false,
  playerName: 'Sultan',
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initialState,

      hydrate: () => set({ hydrated: true }),

      addCoins: (amount) =>
        set((state) => ({ coins: state.coins + amount })),

      loseLife: () =>
        set((state) => ({ lives: Math.max(0, state.lives - 1) })),

      resetLives: () => set({ lives: 3 }),

      completeLevel: (levelId) =>
        set((state) => {
          const nextLevel = levelId + 1
          const alreadyCompleted = state.completedLevels.includes(levelId)
          const nextUnlocked =
            !alreadyCompleted && nextLevel <= 5 && !state.unlockedLevels.includes(nextLevel)

          return {
            completedLevels: alreadyCompleted
              ? state.completedLevels
              : [...state.completedLevels, levelId],
            unlockedLevels: nextUnlocked
              ? [...state.unlockedLevels, nextLevel]
              : state.unlockedLevels,
            newlyUnlocked: nextUnlocked ? nextLevel : null,
          }
        }),

      setNewlyUnlocked: (levelId) => set({ newlyUnlocked: levelId }),

      incrementStreak: () =>
        set((state) => ({ currentStreak: state.currentStreak + 1 })),

      resetStreak: () => set({ currentStreak: 0 }),

      setPlayerName: (name) => set({ playerName: name }),
    }),
    {
      name: 'masdar-game-state',
      skipHydration: true,
    }
  )
)
