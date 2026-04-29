import React from 'react'
import { render, screen } from '@testing-library/react'
import { AnimatedFire, AnimatedCoin, AnimatedLife, LifeHeart } from '@/components/ui/AnimatedIcons'

jest.mock('lottie-react', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ loop, autoplay, onComplete, style, animationData, ...rest }: any) =>
      React.createElement('div', { 'data-testid': 'lottie', 'data-loop': String(loop), style }),
  }
})

describe('AnimatedFire', () => {
  it('renders a Lottie element', () => {
    render(<AnimatedFire />)
    expect(screen.getByTestId('lottie')).toBeInTheDocument()
  })

  it('uses default size of 22', () => {
    render(<AnimatedFire />)
    const el = screen.getByTestId('lottie')
    expect(el).toHaveStyle({ width: '22px', height: '22px' })
  })

  it('respects custom size prop', () => {
    render(<AnimatedFire size={36} />)
    const el = screen.getByTestId('lottie')
    expect(el).toHaveStyle({ width: '36px', height: '36px' })
  })
})

describe('AnimatedCoin', () => {
  it('renders a Lottie element', () => {
    render(<AnimatedCoin />)
    expect(screen.getByTestId('lottie')).toBeInTheDocument()
  })

  it('uses default size of 24', () => {
    render(<AnimatedCoin />)
    const el = screen.getByTestId('lottie')
    expect(el).toHaveStyle({ width: '24px', height: '24px' })
  })

  it('respects custom size prop', () => {
    render(<AnimatedCoin size={48} />)
    const el = screen.getByTestId('lottie')
    expect(el).toHaveStyle({ width: '48px', height: '48px' })
  })
})

describe('AnimatedLife', () => {
  it('renders a Lottie element when active', () => {
    render(<AnimatedLife active={true} />)
    expect(screen.getByTestId('lottie')).toBeInTheDocument()
  })

  it('renders a Lottie element when inactive', () => {
    render(<AnimatedLife active={false} />)
    expect(screen.getByTestId('lottie')).toBeInTheDocument()
  })

  it('defaults to active=true', () => {
    render(<AnimatedLife />)
    expect(screen.getByTestId('lottie')).toBeInTheDocument()
  })

  it('respects custom size prop', () => {
    render(<AnimatedLife size={32} />)
    const el = screen.getByTestId('lottie')
    expect(el).toHaveStyle({ width: '32px', height: '32px' })
  })
})

describe('LifeHeart', () => {
  it('renders in active state', () => {
    render(<LifeHeart state="active" />)
    expect(screen.getByTestId('lottie')).toBeInTheDocument()
  })

  it('renders in breaking state', () => {
    render(<LifeHeart state="breaking" onBreakComplete={jest.fn()} />)
    expect(screen.getByTestId('lottie')).toBeInTheDocument()
  })

  it('renders in empty state with grayscale wrapper', () => {
    const { container } = render(<LifeHeart state="empty" />)
    expect(container.querySelector('.grayscale')).toBeInTheDocument()
  })

  it('uses default size of 24', () => {
    render(<LifeHeart state="active" />)
    const el = screen.getByTestId('lottie')
    expect(el).toHaveStyle({ width: '24px', height: '24px' })
  })

  it('respects custom size prop', () => {
    render(<LifeHeart state="active" size={40} />)
    const el = screen.getByTestId('lottie')
    expect(el).toHaveStyle({ width: '40px', height: '40px' })
  })
})
