import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GameOverScreen from '@/components/quiz/GameOverScreen'
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
    AnimatedLife: ({ active }: any) => React.createElement('div', { 'data-testid': 'animated-life', 'data-active': String(active) }),
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
    coins: 0, currentStreak: 0, lives: 0, unlockedLevels: [1],
    completedLevels: [], newlyUnlocked: null, hydrated: true, playerName: 'Test Player',
  })
})

describe('GameOverScreen', () => {
  it('renders the "Oh no!" heading', () => {
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={jest.fn()} />)
    expect(screen.getByText('Oh no!')).toBeInTheDocument()
  })

  it('shows level id in the subtitle', () => {
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={jest.fn()} />)
    expect(screen.getByText(/Level 1/)).toBeInTheDocument()
  })

  it('renders the "Try Again!" button', () => {
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={jest.fn()} />)
    expect(screen.getByRole('button', { name: /Try Again!/i })).toBeInTheDocument()
  })

  it('calls onRetry and resets lives when "Try Again!" is clicked', () => {
    const onRetry = jest.fn()
    useGameStore.setState({ lives: 0 })
    render(<GameOverScreen level={mockLevel} onRetry={onRetry} onBackToMap={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /Try Again!/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(useGameStore.getState().lives).toBe(3)
  })

  it('renders the "Back to Map" button', () => {
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={jest.fn()} />)
    expect(screen.getByRole('button', { name: /Back to Map/i })).toBeInTheDocument()
  })

  it('calls onBackToMap when "Back to Map" button is clicked', () => {
    const onBackToMap = jest.fn()
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={onBackToMap} />)
    fireEvent.click(screen.getByRole('button', { name: /Back to Map/i }))
    expect(onBackToMap).toHaveBeenCalledTimes(1)
  })

  it('renders the X (✕) close button', () => {
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={jest.fn()} />)
    expect(screen.getByText('✕')).toBeInTheDocument()
  })

  it('calls onBackToMap when X button is clicked', () => {
    const onBackToMap = jest.fn()
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={onBackToMap} />)
    fireEvent.click(screen.getByText('✕'))
    expect(onBackToMap).toHaveBeenCalledTimes(1)
  })

  it('renders the mascot component', () => {
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={jest.fn()} />)
    expect(screen.getByTestId('mascot')).toBeInTheDocument()
  })

  it('renders 3 empty heart icons', () => {
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={jest.fn()} />)
    const hearts = screen.getAllByTestId('animated-life')
    expect(hearts).toHaveLength(3)
    hearts.forEach(heart => {
      expect(heart).toHaveAttribute('data-active', 'false')
    })
  })

  it('shows encouraging message', () => {
    render(<GameOverScreen level={mockLevel} onRetry={jest.fn()} onBackToMap={jest.fn()} />)
    expect(screen.getByText(/failure is a part of success/i)).toBeInTheDocument()
  })
})
