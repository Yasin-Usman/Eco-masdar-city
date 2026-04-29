import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LevelNode from '@/components/map/LevelNode'

jest.mock('lottie-react', () => {
  const React = require('react')
  return { __esModule: true, default: (props: any) => React.createElement('div', { 'data-testid': 'lottie' }) }
})

jest.mock('framer-motion', () => {
  const React = require('react')
  const make = (tag: string) =>
    function Comp({ children, initial, animate, exit, whileHover, whileTap, whileFocus, transition, variants, layout, layoutId, disabled, onClick, 'aria-label': ariaLabel, className, style, ...rest }: any) {
      return React.createElement(tag, { onClick, disabled, 'aria-label': ariaLabel, className, style, ...rest }, children)
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

describe('LevelNode', () => {
  it('renders the level title text', () => {
    render(<LevelNode level={mockLevel} status="active" isNewlyUnlocked={false} textSide="right" onClick={jest.fn()} />)
    expect(screen.getByText('Catch the Sun!')).toBeInTheDocument()
  })

  it('has the correct aria-label', () => {
    render(<LevelNode level={mockLevel} status="active" isNewlyUnlocked={false} textSide="right" onClick={jest.fn()} />)
    expect(screen.getByRole('button', { name: 'Level 1: Catch the Sun! - active' })).toBeInTheDocument()
  })

  it('is disabled when locked', () => {
    render(<LevelNode level={mockLevel} status="locked" isNewlyUnlocked={false} textSide="right" onClick={jest.fn()} />)
    const button = screen.getByRole('button', { name: /locked/i })
    expect(button).toBeDisabled()
  })

  it('does not call onClick when locked node is clicked', () => {
    const onClick = jest.fn()
    render(<LevelNode level={mockLevel} status="locked" isNewlyUnlocked={false} textSide="right" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button', { name: /locked/i }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('calls onClick when active node is clicked', () => {
    const onClick = jest.fn()
    render(<LevelNode level={mockLevel} status="active" isNewlyUnlocked={false} textSide="right" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button', { name: /active/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClick when completed node is clicked', () => {
    const onClick = jest.fn()
    render(<LevelNode level={mockLevel} status="completed" isNewlyUnlocked={false} textSide="right" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button', { name: /completed/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows "Done! ✓" text for completed levels', () => {
    render(<LevelNode level={mockLevel} status="completed" isNewlyUnlocked={false} textSide="right" onClick={jest.fn()} />)
    expect(screen.getByText('Done! ✓')).toBeInTheDocument()
  })

  it('does not show "Done! ✓" text for active levels', () => {
    render(<LevelNode level={mockLevel} status="active" isNewlyUnlocked={false} textSide="right" onClick={jest.fn()} />)
    expect(screen.queryByText('Done! ✓')).not.toBeInTheDocument()
  })

  it('applies muted text style for locked levels', () => {
    render(<LevelNode level={mockLevel} status="locked" isNewlyUnlocked={false} textSide="right" onClick={jest.fn()} />)
    const titleEl = screen.getByText('Catch the Sun!')
    expect(titleEl).toHaveClass('text-neutral-500')
  })

  it('applies white text style for active levels', () => {
    render(<LevelNode level={mockLevel} status="active" isNewlyUnlocked={false} textSide="right" onClick={jest.fn()} />)
    const titleEl = screen.getByText('Catch the Sun!')
    expect(titleEl).toHaveClass('text-white')
  })
})
