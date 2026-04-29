import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MapScreen from '@/components/map/MapScreen'
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

jest.mock('@/components/map/LevelNode', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ level, status, onClick }: any) =>
      React.createElement('button', {
        'data-testid': `level-node-${level.id}`,
        'data-status': status,
        onClick,
      }, level.title),
  }
})

jest.mock('@/components/map/LevelIntroSheet', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ level, onStart, onClose }: any) =>
      level
        ? React.createElement('div', { 'data-testid': 'level-intro-sheet' },
            React.createElement('span', {}, level.title),
            React.createElement('button', { onClick: onStart }, 'Start'),
            React.createElement('button', { onClick: onClose }, 'Close'),
          )
        : null,
  }
})

jest.mock('@/components/ui/DesktopSidebar', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ onOpenProfile }: any) =>
      React.createElement('div', { 'data-testid': 'desktop-sidebar' },
        React.createElement('button', { onClick: onOpenProfile }, 'Open Profile'),
      ),
  }
})

jest.mock('@/components/ui/CityStatsPanel', () => {
  const React = require('react')
  return { __esModule: true, default: () => React.createElement('div', { 'data-testid': 'city-stats-panel' }) }
})

jest.mock('@/components/ui/ProfileScreen', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ onClose }: any) =>
      React.createElement('div', { 'data-testid': 'profile-screen' },
        React.createElement('button', { onClick: onClose }, 'Close Profile'),
      ),
  }
})

jest.mock('@/components/ui/MascotAnimation', () => {
  const React = require('react')
  return { __esModule: true, default: () => React.createElement('div', { 'data-testid': 'mascot' }) }
})

jest.mock('@/components/ui/StatsBar', () => {
  const React = require('react')
  return { __esModule: true, default: () => React.createElement('div', { 'data-testid': 'stats-bar' }) }
})

jest.mock('@/components/ui/RoadmapBackground', () => {
  const React = require('react')
  return { __esModule: true, default: () => React.createElement('div', { 'data-testid': 'roadmap-bg' }) }
})

beforeEach(() => {
  useGameStore.setState({
    coins: 0, currentStreak: 0, lives: 3, unlockedLevels: [1],
    completedLevels: [], newlyUnlocked: null, hydrated: true, playerName: 'Test Player',
  })
})

describe('MapScreen', () => {
  it('renders the Masdar City title', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    expect(screen.getByText('🌟 Masdar City')).toBeInTheDocument()
  })

  it('renders all 5 level nodes', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`level-node-${i}`)).toBeInTheDocument()
    }
  })

  it('shows the desktop sidebar', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    expect(screen.getByTestId('desktop-sidebar')).toBeInTheDocument()
  })

  it('shows the city stats panel', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    expect(screen.getByTestId('city-stats-panel')).toBeInTheDocument()
  })

  it('shows the stats bar', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    expect(screen.getByTestId('stats-bar')).toBeInTheDocument()
  })

  it('shows level intro sheet when a level node is clicked', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    fireEvent.click(screen.getByTestId('level-node-1'))
    // The intro sheet mock renders a wrapping div with data-testid
    expect(screen.getByTestId('level-intro-sheet')).toBeInTheDocument()
    // Multiple elements may contain the title (node button + sheet span) — just confirm at least one exists
    expect(screen.getAllByText('Catch the Sun!').length).toBeGreaterThanOrEqual(1)
  })

  it('hides level intro sheet when Close is clicked', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    fireEvent.click(screen.getByTestId('level-node-1'))
    expect(screen.getByTestId('level-intro-sheet')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('level-intro-sheet')).not.toBeInTheDocument()
  })

  it('calls onStartLevel and hides sheet when Start is clicked', () => {
    const onStartLevel = jest.fn()
    render(<MapScreen onStartLevel={onStartLevel} />)
    fireEvent.click(screen.getByTestId('level-node-1'))
    fireEvent.click(screen.getByText('Start'))
    expect(onStartLevel).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('level-intro-sheet')).not.toBeInTheDocument()
  })

  it('shows profile screen when Open Profile in sidebar is clicked', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    fireEvent.click(screen.getByText('Open Profile'))
    expect(screen.getByTestId('profile-screen')).toBeInTheDocument()
  })

  it('hides profile screen when Close Profile is clicked', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    fireEvent.click(screen.getByText('Open Profile'))
    expect(screen.getByTestId('profile-screen')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Close Profile'))
    expect(screen.queryByTestId('profile-screen')).not.toBeInTheDocument()
  })

  it('shows mobile profile avatar button with initial letter of playerName', () => {
    render(<MapScreen onStartLevel={jest.fn()} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })
})
