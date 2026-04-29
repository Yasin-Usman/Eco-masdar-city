import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import WelcomeScreen from '@/components/ui/WelcomeScreen'

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

jest.mock('@/components/ui/MascotAnimation', () => {
  const React = require('react')
  return { __esModule: true, default: () => React.createElement('div', { 'data-testid': 'mascot' }) }
})

jest.mock('@/components/ui/RoadmapBackground', () => {
  const React = require('react')
  return { __esModule: true, default: () => React.createElement('div', { 'data-testid': 'roadmap-bg' }) }
})

describe('WelcomeScreen', () => {
  it('renders the Masdar title text', () => {
    render(<WelcomeScreen onStart={jest.fn()} />)
    expect(screen.getByText('Masdar')).toBeInTheDocument()
  })

  it('renders the Eco-Builder span with teal color', () => {
    render(<WelcomeScreen onStart={jest.fn()} />)
    const ecoBuilder = screen.getByText('Eco-Builder')
    expect(ecoBuilder).toBeInTheDocument()
    expect(ecoBuilder).toHaveStyle({ color: '#5eead4' })
  })

  it('renders the Start Adventure! button', () => {
    render(<WelcomeScreen onStart={jest.fn()} />)
    expect(screen.getByRole('button', { name: /Start Adventure!/i })).toBeInTheDocument()
  })

  it('renders the stats tagline text', () => {
    render(<WelcomeScreen onStart={jest.fn()} />)
    expect(screen.getByText('5 levels • 25 questions • UAE Science')).toBeInTheDocument()
  })

  it('renders the mascot component', () => {
    render(<WelcomeScreen onStart={jest.fn()} />)
    expect(screen.getByTestId('mascot')).toBeInTheDocument()
  })

  it('renders the good luck message', () => {
    render(<WelcomeScreen onStart={jest.fn()} />)
    expect(screen.getByText('Good luck building UAE more green')).toBeInTheDocument()
  })

  it('calls onStart when Start Adventure! button is clicked', () => {
    const onStart = jest.fn()
    render(<WelcomeScreen onStart={onStart} />)
    fireEvent.click(screen.getByRole('button', { name: /Start Adventure!/i }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('does not throw when Start Adventure! button is clicked', () => {
    // playLevelStart is called inside the click handler via useSounds (already mocked)
    expect(() => {
      render(<WelcomeScreen onStart={jest.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /Start Adventure!/i }))
    }).not.toThrow()
  })

  it('renders the roadmap background', () => {
    render(<WelcomeScreen onStart={jest.fn()} />)
    expect(screen.getByTestId('roadmap-bg')).toBeInTheDocument()
  })
})
