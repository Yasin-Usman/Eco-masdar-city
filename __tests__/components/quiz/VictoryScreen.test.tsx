import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VictoryScreen from '@/components/quiz/VictoryScreen'
import { useGameStore } from '@/store/gameStore'

jest.mock('lottie-react', () => {
  const React = require('react')
  return { __esModule: true, default: (props: any) => React.createElement('div', { 'data-testid': 'lottie' }) }
})

jest.mock('framer-motion', () => {
  const React = require('react')
  const make = (tag: string) =>
    function Comp({ children, initial, animate, exit, whileHover, whileTap, whileFocus, transition, variants, layout, layoutId, onClick, ...rest }: any) {
      return React.createElement(tag, { onClick, ...rest }, children)
    }
  return {
    motion: { div: make('div'), button: make('button'), span: make('span'), p: make('p'), a: make('a') },
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({ start: jest.fn(), set: jest.fn() }),
  }
})

jest.mock('@/hooks/useSounds', () => ({
  useSounds: () => ({
    playTap: jest.fn(), playNodeClick: jest.fn(), playCorrect: jest.fn(),
    playWrong: jest.fn(), playHeartLoss: jest.fn(), playLevelStart: jest.fn(),
    playVictory: jest.fn(), playCoin: jest.fn(), playSlide: jest.fn(),
  }),
}))

jest.mock('canvas-confetti', () => jest.fn())

jest.mock('@/components/ui/MascotAnimation', () => {
  const React = require('react')
  return { __esModule: true, default: () => React.createElement('div', { 'data-testid': 'mascot' }) }
})

jest.mock('@/components/ui/RoadmapBackground', () => {
  const React = require('react')
  return { __esModule: true, default: () => React.createElement('div', { 'data-testid': 'roadmap-bg' }) }
})

jest.mock('@/components/ui/AnimatedIcons', () => {
  const React = require('react')
  return {
    AnimatedCoin: () => React.createElement('div', { 'data-testid': 'animated-coin' }),
  }
})

const mockLevel = {
  id: 1,
  title: 'Catch the Sun!',
  subtitle: 'Solar Harvesting',
  icon: '☀️',
  color: '#f59e0b',
  unlocks: 'Solar Panel Array',
  unlocksIcon: '🔆',
  description: 'Learn about solar energy in the UAE.',
  coins: 20,
  questions: [],
}

beforeEach(() => {
  useGameStore.setState({
    coins: 40, currentStreak: 0, lives: 3, unlockedLevels: [1, 2],
    completedLevels: [1], newlyUnlocked: null, hydrated: true, playerName: 'Test Player',
  })
  // Mock requestAnimationFrame
  global.requestAnimationFrame = jest.fn()
})

describe('VictoryScreen', () => {
  it('renders the "Amazing!" heading', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByText('Amazing!')).toBeInTheDocument()
  })

  it('shows "You completed Level 1"', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByText('You completed Level 1')).toBeInTheDocument()
  })

  it('shows coins earned as +20', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByText('+20')).toBeInTheDocument()
  })

  it('shows total coins from store', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByText('40')).toBeInTheDocument()
  })

  it('renders "Back to Map" button', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByRole('button', { name: /Back to Map/i })).toBeInTheDocument()
  })

  it('calls onBackToMap when "Back to Map" button is clicked', () => {
    const onBackToMap = jest.fn()
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={onBackToMap} />)
    fireEvent.click(screen.getByRole('button', { name: /Back to Map/i }))
    expect(onBackToMap).toHaveBeenCalledTimes(1)
  })

  it('renders the X (✕) close button', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByText('✕')).toBeInTheDocument()
  })

  it('calls onBackToMap when ✕ button is clicked', () => {
    const onBackToMap = jest.fn()
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={onBackToMap} />)
    fireEvent.click(screen.getByText('✕'))
    expect(onBackToMap).toHaveBeenCalledTimes(1)
  })

  it('shows unlocked building name', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByText('Solar Panel Array')).toBeInTheDocument()
  })

  it('shows the mascot in winner state', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByTestId('mascot')).toBeInTheDocument()
  })

  it('shows "You unlocked" section header', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByText('You unlocked')).toBeInTheDocument()
  })

  it('shows "Added to Masdar City!" text', () => {
    render(<VictoryScreen level={mockLevel} coinsEarned={20} onBackToMap={jest.fn()} />)
    expect(screen.getByText('Added to Masdar City!')).toBeInTheDocument()
  })
})
