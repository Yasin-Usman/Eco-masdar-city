import React from 'react'
import { render, screen } from '@testing-library/react'
import CityStatsPanel from '@/components/ui/CityStatsPanel'
import { useGameStore } from '@/store/gameStore'

jest.mock('lottie-react', () => {
  const React = require('react')
  return { __esModule: true, default: (props: any) => React.createElement('div', { 'data-testid': 'lottie' }) }
})

jest.mock('framer-motion', () => {
  const React = require('react')
  const make = (tag: string) =>
    function Comp({ children, initial, animate, exit, whileHover, whileTap, whileFocus, transition, variants, layout, layoutId, ...rest }: any) {
      return React.createElement(tag, rest, children)
    }
  return {
    motion: { div: make('div'), button: make('button'), span: make('span'), p: make('p'), a: make('a') },
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({ start: jest.fn(), set: jest.fn() }),
  }
})

beforeEach(() => {
  useGameStore.setState({
    coins: 0, currentStreak: 0, lives: 3, unlockedLevels: [1],
    completedLevels: [], newlyUnlocked: null, hydrated: true, playerName: 'Test Player',
  })
})

describe('CityStatsPanel', () => {
  it('renders "Your Masdar City" header', () => {
    render(<CityStatsPanel />)
    expect(screen.getByText('Your Masdar City')).toBeInTheDocument()
  })

  it('shows prompt to complete levels when nothing is done', () => {
    render(<CityStatsPanel />)
    expect(screen.getByText('Complete levels to unlock buildings!')).toBeInTheDocument()
  })

  it('shows "Locked" text for uncompleted levels', () => {
    render(<CityStatsPanel />)
    const lockedTexts = screen.getAllByText('Locked')
    expect(lockedTexts.length).toBe(5)
  })

  it('renders 5 building cards', () => {
    render(<CityStatsPanel />)
    // Level 1 through 5 - when locked they show "Level X"
    expect(screen.getByText('Level 1')).toBeInTheDocument()
    expect(screen.getByText('Level 2')).toBeInTheDocument()
    expect(screen.getByText('Level 3')).toBeInTheDocument()
    expect(screen.getByText('Level 4')).toBeInTheDocument()
    expect(screen.getByText('Level 5')).toBeInTheDocument()
  })

  it('shows unlocked count when levels are completed', () => {
    useGameStore.setState({ completedLevels: [1, 2] })
    render(<CityStatsPanel />)
    expect(screen.getByText('2 of 5 buildings unlocked')).toBeInTheDocument()
  })

  it('shows unlocked building name for completed levels', () => {
    useGameStore.setState({ completedLevels: [1] })
    render(<CityStatsPanel />)
    expect(screen.getByText('Solar Panel Array')).toBeInTheDocument()
  })

  it('shows checkmark for completed levels', () => {
    useGameStore.setState({ completedLevels: [1] })
    render(<CityStatsPanel />)
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('shows City Complete badge when all 5 levels are done', () => {
    useGameStore.setState({ completedLevels: [1, 2, 3, 4, 5] })
    render(<CityStatsPanel />)
    expect(screen.getByText('🏆 City Complete!')).toBeInTheDocument()
    expect(screen.getByText('Masdar City is fully built!')).toBeInTheDocument()
  })

  it('does not show City Complete badge when not all levels done', () => {
    useGameStore.setState({ completedLevels: [1, 2] })
    render(<CityStatsPanel />)
    expect(screen.queryByText('🏆 City Complete!')).not.toBeInTheDocument()
  })
})
