import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DesktopSidebar from '@/components/ui/DesktopSidebar'
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

jest.mock('@/components/ui/CartoonAvatar', () => {
  const React = require('react')
  return { __esModule: true, default: ({ name }: { name: string }) => React.createElement('div', { 'data-testid': 'cartoon-avatar' }, name) }
})

beforeEach(() => {
  useGameStore.setState({
    coins: 0, currentStreak: 0, lives: 3, unlockedLevels: [1],
    completedLevels: [], newlyUnlocked: null, hydrated: true, playerName: 'Test Player',
  })
})

describe('DesktopSidebar', () => {
  it('shows the player name', () => {
    render(<DesktopSidebar onOpenProfile={jest.fn()} />)
    expect(screen.getAllByText('Test Player').length).toBeGreaterThanOrEqual(1)
  })

  it('shows "Tap to edit profile" text', () => {
    render(<DesktopSidebar onOpenProfile={jest.fn()} />)
    expect(screen.getByText('Tap to edit profile')).toBeInTheDocument()
  })

  it('calls onOpenProfile when the profile card is clicked', () => {
    const onOpenProfile = jest.fn()
    render(<DesktopSidebar onOpenProfile={onOpenProfile} />)
    fireEvent.click(screen.getByText('Tap to edit profile'))
    expect(onOpenProfile).toHaveBeenCalledTimes(1)
  })

  it('shows streak count from store', () => {
    useGameStore.setState({ currentStreak: 3 })
    render(<DesktopSidebar onOpenProfile={jest.fn()} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows coins count from store', () => {
    useGameStore.setState({ coins: 75 })
    render(<DesktopSidebar onOpenProfile={jest.fn()} />)
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('shows progress fraction', () => {
    useGameStore.setState({ completedLevels: [1, 2] })
    render(<DesktopSidebar onOpenProfile={jest.fn()} />)
    expect(screen.getByText('2/5')).toBeInTheDocument()
  })

  it('shows Your Stats section', () => {
    render(<DesktopSidebar onOpenProfile={jest.fn()} />)
    expect(screen.getByText('Your Stats')).toBeInTheDocument()
  })

  it('shows eco-city motivational quote when no levels completed', () => {
    render(<DesktopSidebar onOpenProfile={jest.fn()} />)
    expect(screen.getByText(/Every great eco-city starts with one step/i)).toBeInTheDocument()
  })

  it('shows different quote when more than 0 levels are completed', () => {
    useGameStore.setState({ completedLevels: [1] })
    render(<DesktopSidebar onOpenProfile={jest.fn()} />)
    expect(screen.getByText(/You're building something amazing/i)).toBeInTheDocument()
  })

  it('shows CartoonAvatar with player name', () => {
    render(<DesktopSidebar onOpenProfile={jest.fn()} />)
    expect(screen.getByTestId('cartoon-avatar')).toBeInTheDocument()
  })
})
