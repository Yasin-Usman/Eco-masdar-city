import React from 'react'
import { render, screen } from '@testing-library/react'
import RoadmapBackground from '@/components/ui/RoadmapBackground'

describe('RoadmapBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<RoadmapBackground />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders an absolutely positioned wrapper div', () => {
    const { container } = render(<RoadmapBackground />)
    const wrapper = container.querySelector('.absolute.inset-0')
    expect(wrapper).toBeInTheDocument()
  })

  it('renders SVG elements for the desert dunes', () => {
    const { container } = render(<RoadmapBackground />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(1)
  })

  it('SVG desert dunes are aria-hidden', () => {
    const { container } = render(<RoadmapBackground />)
    const svgs = container.querySelectorAll('svg[aria-hidden="true"]')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('renders the gradient base layer', () => {
    const { container } = render(<RoadmapBackground />)
    // The base div should have a style with gradient
    const gradientDiv = container.querySelector('[style*="linear-gradient"]')
    expect(gradientDiv).toBeInTheDocument()
  })

  it('renders the skyline SVG with building rects', () => {
    const { container } = render(<RoadmapBackground />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBeGreaterThan(0)
  })

  it('renders the overflow-hidden pointer-events-none wrapper', () => {
    const { container } = render(<RoadmapBackground />)
    const wrapper = container.querySelector('.overflow-hidden.pointer-events-none')
    expect(wrapper).toBeInTheDocument()
  })
})
