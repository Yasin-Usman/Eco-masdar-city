import levelsData from '@/data/levels.json'
import type { Level, LevelStatus } from '@/types'

const levels = levelsData as Level[]

export function useLevelData(unlockedLevels: number[], completedLevels: number[]) {
  const getLevelStatus = (levelId: number): LevelStatus => {
    if (completedLevels.includes(levelId)) return 'completed'
    if (unlockedLevels.includes(levelId)) return 'active'
    return 'locked'
  }

  return {
    levels,
    getLevelStatus,
    getLevel: (id: number) => levels.find((l) => l.id === id),
  }
}
