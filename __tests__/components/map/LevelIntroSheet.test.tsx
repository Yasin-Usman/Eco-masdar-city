import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LevelIntroSheet from '@/components/map/LevelIntroSheet'

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
  questions: [
    { id: '1-1', type: 'multiple_choice' as const, question: 'Q1?', options: ['A', 'B', 'C', 'D'], correct: 1, explanation: 'Exp 1' },
    { id: '1-2', type: 'true_false' as const, question: 'Q2?', correct: true, explanation: 'Exp 2' },
    { id: '1-3', type: 'multiple_choice' as const, question: 'Q3?', options: ['A', 'B'], correct: 0, explanation: 'Exp 3' },
    { id: '1-4', type: 'true_false' as const, question: 'Q4?', correct: false, explanation: 'Exp 4' },
    { id: '1-5', type: 'multiple_choice' as const, question: 'Q5?', options: ['A', 'B'], correct: 0, explanation: 'Exp 5' },
  ],
}

describe('LevelIntroSheet', () => {
  it('renders nothing when level is null', () => {
    const { container } = render(<LevelIntroSheet level={null} onStart={jest.fn()} onClose={jest.fn()} />)
    expect(container.textContent).toBe('')
  })

  it('shows level title when level is provided', () => {
    render(<LevelIntroSheet level={mockLevel} onStart={jest.fn()} onClose={jest.fn()} />)
    expect(screen.getByText('Catch the Sun!')).toBeInTheDocument()
  })

  it('shows level subtitle', () => {
    render(<LevelIntroSheet level={mockLevel} onStart={jest.fn()} onClose={jest.fn()} />)
    expect(screen.getByText('Solar Harvesting')).toBeInTheDocument()
  })

  it('shows level description', () => {
    render(<LevelIntroSheet level={mockLevel} onStart={jest.fn()} onClose={jest.fn()} />)
    expect(screen.getByText('Learn about solar energy in the UAE.')).toBeInTheDocument()
  })

  it('shows coin count as +20', () => {
    render(<LevelIntroSheet level={mockLevel} onStart={jest.fn()} onClose={jest.fn()} />)
    expect(screen.getByText('+20')).toBeInTheDocument()
  })

  it('shows the "Let\'s Go!" button', () => {
    render(<LevelIntroSheet level={mockLevel} onStart={jest.fn()} onClose={jest.fn()} />)
    expect(screen.getByRole('button', { name: /Let's Go!/i })).toBeInTheDocument()
  })

  it('calls onStart when "Let\'s Go!" is clicked', () => {
    const onStart = jest.fn()
    render(<LevelIntroSheet level={mockLevel} onStart={onStart} onClose={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /Let's Go!/i }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn()
    render(<LevelIntroSheet level={mockLevel} onStart={jest.fn()} onClose={onClose} />)
    // The backdrop is the first fixed div with onClick
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/40')
    if (backdrop) fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows the mascot component', () => {
    render(<LevelIntroSheet level={mockLevel} onStart={jest.fn()} onClose={jest.fn()} />)
    expect(screen.getByTestId('mascot')).toBeInTheDocument()
  })

  it('shows level badge text', () => {
    render(<LevelIntroSheet level={mockLevel} onStart={jest.fn()} onClose={jest.fn()} />)
    expect(screen.getByText('Level 1')).toBeInTheDocument()
  })
})
