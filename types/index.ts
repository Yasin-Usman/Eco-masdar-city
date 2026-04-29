export type QuestionType = 'multiple_choice' | 'true_false'

export interface Question {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  correct: number | boolean
  explanation: string
}

export interface Level {
  id: number
  title: string
  subtitle: string
  icon: string
  color: string
  unlocks: string
  unlocksIcon: string
  description: string
  coins: number
  questions: Question[]
}

export type LevelStatus = 'locked' | 'active' | 'completed'

export interface GameState {
  coins: number
  currentStreak: number
  lives: number
  unlockedLevels: number[]
  completedLevels: number[]
  newlyUnlocked: number | null
  hydrated: boolean
  playerName: string
}

export interface GameActions {
  addCoins: (amount: number) => void
  loseLife: () => void
  resetLives: () => void
  completeLevel: (levelId: number) => void
  setNewlyUnlocked: (levelId: number | null) => void
  incrementStreak: () => void
  resetStreak: () => void
  hydrate: () => void
  setPlayerName: (name: string) => void
}
