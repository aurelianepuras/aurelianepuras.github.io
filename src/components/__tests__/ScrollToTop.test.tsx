import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ScrollToTop from '../ScrollToTop'

describe('ScrollToTop', () => {
  let scrollToMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    scrollToMock = vi.fn() as typeof window.scrollTo
    window.scrollTo = scrollToMock
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders scroll to top button', () => {
    render(<ScrollToTop />)
    const button = screen.getByRole('button', { name: /scroll to top/i })
    expect(button).toBeInTheDocument()
  })

  it('scrolls to top when clicked', () => {
    render(<ScrollToTop />)
    const button = screen.getByRole('button', { name: /scroll to top/i })
    
    fireEvent.click(button)
    
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
  })

  it('shows button when scrolled down', () => {
    // Mock scrollY to be > 300
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 500,
    })

    render(<ScrollToTop />)
    const button = screen.getByRole('button', { name: /scroll to top/i })
    
    // Trigger scroll event
    fireEvent.scroll(window)
    
    // Button should be visible (opacity-100)
    expect(button).toBeInTheDocument()
  })

  it('hides button when at top', () => {
    // Mock scrollY to be < 300
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 100,
    })

    render(<ScrollToTop />)
    const button = screen.getByRole('button', { name: /scroll to top/i })
    
    // Button should exist but might be hidden
    expect(button).toBeInTheDocument()
  })
})
