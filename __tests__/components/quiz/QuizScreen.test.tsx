import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import QuizScreen from '@/components/quiz/QuizScreen'
import { useGameStore } from '@/store/gameStore'

jest.mock('lottie-react', () => {
  const React = require('react')
  return { __esModule: true, default: (props: any) => React.createElement('div', { 'data-testid': 'lottie' }) }
})

jest.mock('framer-motion', () => {
  const React = require('react')
  const make = (tag: string) =>
    function Comp({ children, initial, animate, exit, whileHover, whileTap, whileFocus, transition, variants, layout, layoutId, onClick, disabled, className, style, ...rest }: any) {
      return React.createElement(tag, { onClick, disabled, className, style, ...rest }, children)
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
    LifeHeart: () => React.createElement('div', { 'data-testid': 'life-heart' }),
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
    { id: '1-1', type: 'multiple_choice' as const, question: 'What do solar panels capture?', options: ['Wind', 'Sunlight', 'Water', 'Sand'], correct: 1, explanation: 'Solar panels capture sunlight.' },
    { id: '1-2', type: 'true_false' as const, question: 'Solar energy is renewable.', correct: true, explanation: 'Yes, solar energy is renewable.' },
    { id: '1-3', type: 'multiple_choice' as const, question: 'Best country for solar?', options: ['Canada', 'UAE', 'Norway', 'Iceland'], correct: 1, explanation: 'The UAE has ideal conditions.' },
    { id: '1-4', type: 'true_false' as const, question: 'Solar panels need wind.', correct: false, explanation: 'Only sunlight is needed.' },
    { id: '1-5', type: 'multiple_choice' as const, question: 'Masdar City aims to be:', options: ['Oil-powered', 'Carbon-neutral', 'Nuclear-powered', 'Coal-powered'], correct: 1, explanation: 'Masdar City aims to be carbon-neutral.' },
  ],
}

beforeEach(() => {
  useGameStore.setState({
    coins: 0, currentStreak: 0, lives: 3, unlockedLevels: [1],
    completedLevels: [], newlyUnlocked: null, hydrated: true, playerName: 'Test Player',
  })
})

describe('QuizScreen', () => {
  it('renders the first question text', () => {
    render(<QuizScreen level={mockLevel} onComplete={jest.fn()} onGameOver={jest.fn()} onQuit={jest.fn()} />)
    expect(screen.getByText('What do solar panels capture?')).toBeInTheDocument()
  })

  it('renders 4 answer option buttons for multiple choice', () => {
    render(<QuizScreen level={mockLevel} onComplete={jest.fn()} onGameOver={jest.fn()} onQuit={jest.fn()} />)
    expect(screen.getByText('Wind')).toBeInTheDocument()
    expect(screen.getByText('Sunlight')).toBeInTheDocument()
    expect(screen.getByText('Water')).toBeInTheDocument()
    expect(screen.getByText('Sand')).toBeInTheDocument()
  })

  it('shows explanation after clicking a correct answer', () => {
    render(<QuizScreen level={mockLevel} onComplete={jest.fn()} onGameOver={jest.fn()} onQuit={jest.fn()} />)
    fireEvent.click(screen.getByText('Sunlight'))
    expect(screen.getByText('Solar panels capture sunlight.')).toBeInTheDocument()
  })

  it('shows "Next Question →" button after answering', () => {
    render(<QuizScreen level={mockLevel} onComplete={jest.fn()} onGameOver={jest.fn()} onQuit={jest.fn()} />)
    fireEvent.click(screen.getByText('Sunlight'))
    expect(screen.getByText('Next Question →')).toBeInTheDocument()
  })

  it('advances to next question when "Next Question →" is clicked', () => {
    render(<QuizScreen level={mockLevel} onComplete={jest.fn()} onGameOver={jest.fn()} onQuit={jest.fn()} />)
    fireEvent.click(screen.getByText('Sunlight'))
    fireEvent.click(screen.getByText('Next Question →'))
    expect(screen.getByText('Solar energy is renewable.')).toBeInTheDocument()
  })

  it('shows explanation after wrong answer', () => {
    render(<QuizScreen level={mockLevel} onComplete={jest.fn()} onGameOver={jest.fn()} onQuit={jest.fn()} />)
    fireEvent.click(screen.getByText('Wind'))
    expect(screen.getByText('Solar panels capture sunlight.')).toBeInTheDocument()
  })

  it('decrements a life when wrong answer is chosen', () => {
    render(<QuizScreen level={mockLevel} onComplete={jest.fn()} onGameOver={jest.fn()} onQuit={jest.fn()} />)
    expect(useGameStore.getState().lives).toBe(3)
    fireEvent.click(screen.getByText('Wind'))
    expect(useGameStore.getState().lives).toBe(2)
  })

  it('calls onQuit and resets lives when X button is clicked', () => {
    const onQuit = jest.fn()
    render(<QuizScreen level={mockLevel} onComplete={jest.fn()} onGameOver={jest.fn()} onQuit={onQuit} />)
    fireEvent.click(screen.getByText('✕'))
    expect(onQuit).toHaveBeenCalledTimes(1)
    expect(useGameStore.getState().lives).toBe(3)
  })

  it('shows "🏆 Finish Level!" on the last question after answering', () => {
    render(<QuizScreen level={mockLevel} onComplete={jest.fn()} onGameOver={jest.fn()} onQuit={jest.fn()} />)

    // Answer all questions correctly to get to the last one
    // Q1: index 1 = Sunlight
    fireEvent.click(screen.getByText('Sunlight'))
    fireEvent.click(screen.getByText('Next Question →'))
    // Q2: True/False - index 0 = True ✅
    fireEvent.click(screen.getByText('True ✅'))
    fireEvent.click(screen.getByText('Next Question →'))
    // Q3: index 1 = UAE
    fireEvent.click(screen.getByText('UAE'))
    fireEvent.click(screen.getByText('Next Question →'))
    // Q4: index 1 = False ❌
    fireEvent.click(screen.getByText('False ❌'))
    fireEvent.click(screen.getByText('Next Question →'))
    // Q5: last question - answer correctly
    fireEvent.click(screen.getByText('Carbon-neutral'))
    expect(screen.getByText('🏆 Finish Level!')).toBeInTheDocument()
  })

  it('calls onComplete with coins when Finish Level is clicked', () => {
    const onComplete = jest.fn()
    render(<QuizScreen level={mockLevel} onComplete={onComplete} onGameOver={jest.fn()} onQuit={jest.fn()} />)

    fireEvent.click(screen.getByText('Sunlight'))
    fireEvent.click(screen.getByText('Next Question →'))
    fireEvent.click(screen.getByText('True ✅'))
    fireEvent.click(screen.getByText('Next Question →'))
    fireEvent.click(screen.getByText('UAE'))
    fireEvent.click(screen.getByText('Next Question →'))
    fireEvent.click(screen.getByText('False ❌'))
    fireEvent.click(screen.getByText('Next Question →'))
    fireEvent.click(screen.getByText('Carbon-neutral'))
    fireEvent.click(screen.getByText('🏆 Finish Level!'))

    expect(onComplete).toHaveBeenCalledWith(20)
  })
})
