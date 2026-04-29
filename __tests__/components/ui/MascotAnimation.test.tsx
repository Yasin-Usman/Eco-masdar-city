import React from 'react'
import { render, screen } from '@testing-library/react'
import MascotAnimation from '@/components/ui/MascotAnimation'

jest.mock('lottie-react', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ loop, onComplete, style, className, animationData }: any) =>
      React.createElement('div', {
        'data-testid': 'lottie',
        'data-loop': String(loop),
        'data-has-oncomplete': String(!!onComplete),
        style,
        className,
      }),
  }
})

describe('MascotAnimation', () => {
  it('renders a Lottie element for idle state', () => {
    render(<MascotAnimation state="idle" />)
    expect(screen.getByTestId('lottie')).toBeInTheDocument()
  })

  it('renders with loop=true for idle state', () => {
    render(<MascotAnimation state="idle" />)
    expect(screen.getByTestId('lottie')).toHaveAttribute('data-loop', 'true')
  })

  it('renders with loop=false for wave state', () => {
    render(<MascotAnimation state="wave" />)
    expect(screen.getByTestId('lottie')).toHaveAttribute('data-loop', 'false')
  })

  it('renders with loop=false for wrong state', () => {
    render(<MascotAnimation state="wrong" />)
    expect(screen.getByTestId('lottie')).toHaveAttribute('data-loop', 'false')
  })

  it('renders with loop=false for happy state', () => {
    render(<MascotAnimation state="happy" />)
    expect(screen.getByTestId('lottie')).toHaveAttribute('data-loop', 'false')
  })

  it('renders with loop=true for winner state', () => {
    render(<MascotAnimation state="winner" />)
    expect(screen.getByTestId('lottie')).toHaveAttribute('data-loop', 'true')
  })

  it('uses default size of 180', () => {
    render(<MascotAnimation state="idle" />)
    const el = screen.getByTestId('lottie')
    expect(el).toHaveStyle({ width: '180px', height: '180px' })
  })

  it('respects custom size prop', () => {
    render(<MascotAnimation state="idle" size={100} />)
    const el = screen.getByTestId('lottie')
    expect(el).toHaveStyle({ width: '100px', height: '100px' })
  })

  it('passes className to Lottie', () => {
    render(<MascotAnimation state="idle" className="my-class" />)
    expect(screen.getByTestId('lottie')).toHaveClass('my-class')
  })

  it('passes onComplete for non-looping states', () => {
    const onComplete = jest.fn()
    render(<MascotAnimation state="wave" onComplete={onComplete} />)
    expect(screen.getByTestId('lottie')).toHaveAttribute('data-has-oncomplete', 'true')
  })

  it('does not pass onComplete for looping states (idle)', () => {
    const onComplete = jest.fn()
    render(<MascotAnimation state="idle" onComplete={onComplete} />)
    expect(screen.getByTestId('lottie')).toHaveAttribute('data-has-oncomplete', 'false')
  })
})
