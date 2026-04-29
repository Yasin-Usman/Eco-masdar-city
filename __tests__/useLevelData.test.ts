import { useLevelData } from '@/hooks/useLevelData'

describe('useLevelData', () => {
  it('returns all 5 levels', () => {
    const { levels } = useLevelData([1], [])
    expect(levels).toHaveLength(5)
  })

  it('getLevelStatus returns locked for levels not in unlockedLevels', () => {
    const { getLevelStatus } = useLevelData([1], [])
    expect(getLevelStatus(2)).toBe('locked')
    expect(getLevelStatus(3)).toBe('locked')
  })

  it('getLevelStatus returns active for unlocked but not completed levels', () => {
    const { getLevelStatus } = useLevelData([1, 2], [])
    expect(getLevelStatus(1)).toBe('active')
    expect(getLevelStatus(2)).toBe('active')
  })

  it('getLevelStatus returns completed for completed levels', () => {
    const { getLevelStatus } = useLevelData([1, 2], [1])
    expect(getLevelStatus(1)).toBe('completed')
    expect(getLevelStatus(2)).toBe('active')
  })

  it('getLevel returns the correct level by id', () => {
    const { getLevel } = useLevelData([1], [])
    const level = getLevel(1)
    expect(level).toBeDefined()
    expect(level?.id).toBe(1)
    expect(level?.subtitle).toBe('Solar Harvesting')
  })

  it('getLevel returns undefined for non-existent id', () => {
    const { getLevel } = useLevelData([1], [])
    expect(getLevel(99)).toBeUndefined()
  })

  it('each level has the required fields', () => {
    const { levels } = useLevelData([1], [])
    levels.forEach((level) => {
      expect(level.id).toBeDefined()
      expect(level.title).toBeDefined()
      expect(level.questions).toHaveLength(5)
      expect(level.coins).toBeGreaterThan(0)
    })
  })

  it('all questions have required fields', () => {
    const { levels } = useLevelData([1], [])
    levels.forEach((level) => {
      level.questions.forEach((q) => {
        expect(q.id).toBeDefined()
        expect(q.type).toMatch(/^(multiple_choice|true_false)$/)
        expect(q.question).toBeDefined()
        expect(q.explanation).toBeDefined()
      })
    })
  })
})
