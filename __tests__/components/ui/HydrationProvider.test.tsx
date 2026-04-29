import React from 'react'
import { render, screen } from '@testing-library/react'
import HydrationProvider from '@/components/ui/HydrationProvider'
import { useGameStore } from '@/store/gameStore'

// Mock the persist rehydrate method
beforeEach(() => {
  useGameStore.setState({
    coins: 0, currentStreak: 0, lives: 3, unlockedLevels: [1],
    completedLevels: [], newlyUnlocked: null, hydrated: false, playerName: 'Test Player',
  })
  // Ensure persist.rehydrate exists as a mock
  if (!useGameStore.persist?.rehydrate) {
    Object.defineProperty(useGameStore, 'persist', {
      value: { rehydrate: jest.fn() },
      configurable: true,
      writable: true,
    })
  } else {
    jest.spyOn(useGameStore.persist, 'rehydrate').mockImplementation(jest.fn())
  }
})

describe('HydrationProvider', () => {
  it('renders children', () => {
    render(
      <HydrationProvider>
        <div data-testid="child">Hello</div>
      </HydrationProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders multiple children', () => {
    render(
      <HydrationProvider>
        <span data-testid="child-1">First</span>
        <span data-testid="child-2">Second</span>
      </HydrationProvider>
    )
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })

  it('calls hydrate action on mount, setting hydrated to true', () => {
    expect(useGameStore.getState().hydrated).toBe(false)
    render(
      <HydrationProvider>
        <div>child</div>
      </HydrationProvider>
    )
    expect(useGameStore.getState().hydrated).toBe(true)
  })

  it('calls persist.rehydrate on mount', () => {
    const rehydrateSpy = jest.spyOn(useGameStore.persist, 'rehydrate')
    render(
      <HydrationProvider>
        <div>child</div>
      </HydrationProvider>
    )
    expect(rehydrateSpy).toHaveBeenCalled()
  })

  it('does not wrap children in an extra DOM element', () => {
    const { container } = render(
      <HydrationProvider>
        <div data-testid="only-child">Only child</div>
      </HydrationProvider>
    )
    // The provider uses a fragment, so the first element should be the child directly
    expect(container.firstChild).toBe(screen.getByTestId('only-child'))
  })
})
