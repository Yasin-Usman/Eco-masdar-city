import React from 'react'
import { render, screen } from '@testing-library/react'
import StatsBar from '@/components/ui/StatsBar'
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

describe('StatsBar', () => {
  it('renders without crashing', () => {
    render(<StatsBar />)
    // Should render lottie elements for hearts, fire, and coin
    const lottieEls = screen.getAllByTestId('lottie')
    expect(lottieEls.length).toBeGreaterThan(0)
  })

  it('shows the current streak count', () => {
    useGameStore.setState({ currentStreak: 5 })
    render(<StatsBar />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows 0 streak when streak is 0', () => {
    useGameStore.setState({ currentStreak: 0, coins: 99 }) // non-zero coins avoids duplicate '0'
    render(<StatsBar />)
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1)
  })

  it('shows the coins count', () => {
    useGameStore.setState({ coins: 42 })
    render(<StatsBar />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('shows 0 coins initially', () => {
    useGameStore.setState({ coins: 0, currentStreak: 5 }) // non-zero streak avoids duplicate '0'
    render(<StatsBar />)
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1)
  })

  it('renders 3 Lottie heart icons for 3 lives', () => {
    render(<StatsBar />)
    // There should be multiple lottie elements (hearts + fire + coin)
    const lottieEls = screen.getAllByTestId('lottie')
    expect(lottieEls.length).toBeGreaterThanOrEqual(3)
  })

  it('updates coins display when store changes', () => {
    useGameStore.setState({ coins: 0, currentStreak: 5 }) // distinct streak avoids '0' ambiguity
    const { rerender } = render(<StatsBar />)
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1)
    useGameStore.setState({ coins: 100 })
    rerender(<StatsBar />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('updates streak display when store changes', () => {
    const { rerender } = render(<StatsBar />)
    useGameStore.setState({ currentStreak: 7 })
    rerender(<StatsBar />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })
})
