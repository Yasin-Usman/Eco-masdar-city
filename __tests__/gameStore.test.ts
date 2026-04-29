import { useGameStore } from '@/store/gameStore'

// Reset store between tests
beforeEach(() => {
  useGameStore.setState({
    coins: 0,
    currentStreak: 0,
    lives: 3,
    unlockedLevels: [1],
    completedLevels: [],
    newlyUnlocked: null,
    hydrated: false,
    playerName: 'Eco Explorer',
  })
})

describe('gameStore', () => {
  it('starts with correct initial state', () => {
    const state = useGameStore.getState()
    expect(state.coins).toBe(0)
    expect(state.lives).toBe(3)
    expect(state.unlockedLevels).toEqual([1])
    expect(state.completedLevels).toEqual([])
    expect(state.currentStreak).toBe(0)
  })

  it('addCoins increases coin count', () => {
    useGameStore.getState().addCoins(20)
    expect(useGameStore.getState().coins).toBe(20)

    useGameStore.getState().addCoins(15)
    expect(useGameStore.getState().coins).toBe(35)
  })

  it('loseLife decrements lives and clamps at 0', () => {
    useGameStore.getState().loseLife()
    expect(useGameStore.getState().lives).toBe(2)

    useGameStore.getState().loseLife()
    useGameStore.getState().loseLife()
    expect(useGameStore.getState().lives).toBe(0)

    // Should not go below 0
    useGameStore.getState().loseLife()
    expect(useGameStore.getState().lives).toBe(0)
  })

  it('resetLives restores lives to 3', () => {
    useGameStore.getState().loseLife()
    useGameStore.getState().loseLife()
    expect(useGameStore.getState().lives).toBe(1)

    useGameStore.getState().resetLives()
    expect(useGameStore.getState().lives).toBe(3)
  })

  it('completeLevel marks level as completed and unlocks next', () => {
    useGameStore.getState().completeLevel(1)

    const state = useGameStore.getState()
    expect(state.completedLevels).toContain(1)
    expect(state.unlockedLevels).toContain(2)
    expect(state.newlyUnlocked).toBe(2)
  })

  it('completing the last level does not unlock level 6', () => {
    useGameStore.setState({ unlockedLevels: [1, 2, 3, 4, 5] })
    useGameStore.getState().completeLevel(5)

    const state = useGameStore.getState()
    expect(state.unlockedLevels).not.toContain(6)
  })

  it('completing a level twice does not duplicate it', () => {
    useGameStore.getState().completeLevel(1)
    useGameStore.getState().completeLevel(1)

    const { completedLevels } = useGameStore.getState()
    const count = completedLevels.filter((id) => id === 1).length
    expect(count).toBe(1)
  })

  it('incrementStreak and resetStreak work correctly', () => {
    useGameStore.getState().incrementStreak()
    useGameStore.getState().incrementStreak()
    expect(useGameStore.getState().currentStreak).toBe(2)

    useGameStore.getState().resetStreak()
    expect(useGameStore.getState().currentStreak).toBe(0)
  })

  it('setNewlyUnlocked sets and clears the value', () => {
    useGameStore.getState().setNewlyUnlocked(3)
    expect(useGameStore.getState().newlyUnlocked).toBe(3)

    useGameStore.getState().setNewlyUnlocked(null)
    expect(useGameStore.getState().newlyUnlocked).toBeNull()
  })

  it('setPlayerName updates the playerName in state', () => {
    expect(useGameStore.getState().playerName).toBe('Eco Explorer')

    useGameStore.getState().setPlayerName('Sultan')
    expect(useGameStore.getState().playerName).toBe('Sultan')

    useGameStore.getState().setPlayerName('Aisha')
    expect(useGameStore.getState().playerName).toBe('Aisha')
  })
})
