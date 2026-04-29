import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileScreen from '@/components/ui/ProfileScreen'
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
    coins: 50, currentStreak: 3, lives: 3, unlockedLevels: [1],
    completedLevels: [], newlyUnlocked: null, hydrated: true, playerName: 'Test Player',
  })
})

describe('ProfileScreen', () => {
  it('shows the player name', () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    // getAllByText because CartoonAvatar mock may also render the name
    expect(screen.getAllByText('Test Player').length).toBeGreaterThanOrEqual(1)
  })

  it('shows the edit name button', () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    expect(screen.getByText(/Edit name/i)).toBeInTheDocument()
  })

  it('shows input field when edit name is clicked', () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    fireEvent.click(screen.getByText(/Edit name/i))
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
  })

  it('shows Save and Cancel buttons when editing', () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    fireEvent.click(screen.getByText(/Edit name/i))
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
  })

  it('saves new name when Save is clicked', () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    fireEvent.click(screen.getByText(/Edit name/i))
    const input = screen.getByPlaceholderText('Your name')
    fireEvent.change(input, { target: { value: 'Aisha' } })
    fireEvent.click(screen.getByRole('button', { name: /Save/i }))
    expect(useGameStore.getState().playerName).toBe('Aisha')
  })

  it('shows "Saved!" toast after saving', async () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    fireEvent.click(screen.getByText(/Edit name/i))
    const input = screen.getByPlaceholderText('Your name')
    fireEvent.change(input, { target: { value: 'Sultan' } })
    fireEvent.click(screen.getByRole('button', { name: /Save/i }))
    expect(screen.getByText('Saved!')).toBeInTheDocument()
  })

  it('cancels editing when Cancel is clicked', () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    fireEvent.click(screen.getByText(/Edit name/i))
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }))
    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument()
  })

  it('shows the close X button and calls onClose when clicked', () => {
    const onClose = jest.fn()
    render(<ProfileScreen onClose={onClose} />)
    fireEvent.click(screen.getByText('✕'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows coins in stats section', () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('shows streak in stats section', () => {
    useGameStore.setState({ currentStreak: 7, lives: 2 })
    render(<ProfileScreen onClose={jest.fn()} />)
    // Streak value appears in both the hero card and the stats grid
    expect(screen.getAllByText('7').length).toBeGreaterThanOrEqual(1)
  })

  it('shows Level Journey section', () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    expect(screen.getByText('Level Journey')).toBeInTheDocument()
  })

  it('shows Newcomer rank when no levels completed', () => {
    render(<ProfileScreen onClose={jest.fn()} />)
    expect(screen.getByText('Newcomer')).toBeInTheDocument()
  })

  it('shows Solar Pioneer rank when 1 level completed', () => {
    useGameStore.setState({ completedLevels: [1] })
    render(<ProfileScreen onClose={jest.fn()} />)
    expect(screen.getByText('Solar Pioneer')).toBeInTheDocument()
  })
})
