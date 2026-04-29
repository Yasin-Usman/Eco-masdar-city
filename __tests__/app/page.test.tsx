import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '@/app/page'
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

jest.mock('@/hooks/useSounds', () => ({
  useSounds: () => ({
    playTap: jest.fn(), playNodeClick: jest.fn(), playCorrect: jest.fn(),
    playWrong: jest.fn(), playHeartLoss: jest.fn(), playLevelStart: jest.fn(),
    playVictory: jest.fn(), playCoin: jest.fn(), playSlide: jest.fn(),
  }),
}))

jest.mock('@/components/ui/WelcomeScreen', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ onStart }: any) =>
      React.createElement('div', { 'data-testid': 'welcome-screen' },
        React.createElement('button', { onClick: onStart }, 'Start Adventure!'),
      ),
  }
})

jest.mock('@/components/map/MapScreen', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ onStartLevel }: any) =>
      React.createElement('div', { 'data-testid': 'map-screen' },
        React.createElement('button', {
          onClick: () => onStartLevel({
            id: 1, title: 'Catch the Sun!', subtitle: 'Solar Harvesting', icon: '☀️',
            color: '#f59e0b', unlocks: 'Solar Panel Array', unlocksIcon: '🔆',
            description: 'Learn about solar energy.', coins: 20, questions: [],
          }),
        }, 'Start Level'),
      ),
  }
})

jest.mock('@/components/quiz/QuizScreen', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ onComplete, onGameOver, onQuit }: any) =>
      React.createElement('div', { 'data-testid': 'quiz-screen' },
        React.createElement('button', { onClick: () => onComplete(20) }, 'Complete'),
        React.createElement('button', { onClick: onGameOver }, 'Game Over'),
        React.createElement('button', { onClick: onQuit }, 'Quit'),
      ),
  }
})

jest.mock('@/components/quiz/VictoryScreen', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ onBackToMap }: any) =>
      React.createElement('div', { 'data-testid': 'victory-screen' },
        React.createElement('button', { onClick: onBackToMap }, 'Back to Map'),
      ),
  }
})

jest.mock('@/components/quiz/GameOverScreen', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ onRetry, onBackToMap }: any) =>
      React.createElement('div', { 'data-testid': 'gameover-screen' },
        React.createElement('button', { onClick: onRetry }, 'Retry'),
        React.createElement('button', { onClick: onBackToMap }, 'Back to Map'),
      ),
  }
})

beforeEach(() => {
  useGameStore.setState({
    coins: 0, currentStreak: 0, lives: 3, unlockedLevels: [1],
    completedLevels: [], newlyUnlocked: null, hydrated: true, playerName: 'Test Player',
  })
})

describe('Home (page.tsx)', () => {
  it('renders WelcomeScreen when hydrated=true', () => {
    render(<Home />)
    expect(screen.getByTestId('welcome-screen')).toBeInTheDocument()
  })

  it('shows loading spinner when hydrated=false', () => {
    useGameStore.setState({ hydrated: false })
    const { container } = render(<Home />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    expect(screen.queryByTestId('welcome-screen')).not.toBeInTheDocument()
  })

  it('transitions to MapScreen after clicking Start Adventure!', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Start Adventure!'))
    expect(screen.getByTestId('map-screen')).toBeInTheDocument()
    expect(screen.queryByTestId('welcome-screen')).not.toBeInTheDocument()
  })

  it('transitions to QuizScreen after starting a level', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Start Adventure!'))
    fireEvent.click(screen.getByText('Start Level'))
    expect(screen.getByTestId('quiz-screen')).toBeInTheDocument()
  })

  it('transitions to VictoryScreen after completing the quiz', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Start Adventure!'))
    fireEvent.click(screen.getByText('Start Level'))
    fireEvent.click(screen.getByText('Complete'))
    expect(screen.getByTestId('victory-screen')).toBeInTheDocument()
  })

  it('transitions to GameOverScreen when game over occurs', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Start Adventure!'))
    fireEvent.click(screen.getByText('Start Level'))
    fireEvent.click(screen.getByText('Game Over'))
    expect(screen.getByTestId('gameover-screen')).toBeInTheDocument()
  })

  it('goes back to MapScreen from VictoryScreen', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Start Adventure!'))
    fireEvent.click(screen.getByText('Start Level'))
    fireEvent.click(screen.getByText('Complete'))
    fireEvent.click(screen.getByText('Back to Map'))
    expect(screen.getByTestId('map-screen')).toBeInTheDocument()
  })

  it('goes back to MapScreen from GameOverScreen', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Start Adventure!'))
    fireEvent.click(screen.getByText('Start Level'))
    fireEvent.click(screen.getByText('Game Over'))
    fireEvent.click(screen.getByText('Back to Map'))
    expect(screen.getByTestId('map-screen')).toBeInTheDocument()
  })

  it('retries quiz from GameOverScreen', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Start Adventure!'))
    fireEvent.click(screen.getByText('Start Level'))
    fireEvent.click(screen.getByText('Game Over'))
    fireEvent.click(screen.getByText('Retry'))
    expect(screen.getByTestId('quiz-screen')).toBeInTheDocument()
  })

  it('quits quiz and returns to map', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Start Adventure!'))
    fireEvent.click(screen.getByText('Start Level'))
    fireEvent.click(screen.getByText('Quit'))
    expect(screen.getByTestId('map-screen')).toBeInTheDocument()
  })
})
