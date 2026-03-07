import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App.jsx'

// Mock URL
let mockSearch = '?year=2024'
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    get search() { return mockSearch },
    set search(v) { mockSearch = v },
    pathname: '/',
    href: 'http://localhost/',
  },
})

describe('App', () => {
  function mockStorage(overrides = {}) {
    localStorage.getItem.mockImplementation((key) => {
      if (key in overrides) return overrides[key]
      return null
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockSearch = '?year=2024'
  })

  it('should render the calendar with year from URL', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)
    
    expect(screen.getByDisplayValue('2024')).toBeInTheDocument()
  })

  it('should display all 12 months', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach(month => {
      expect(screen.getByText(month)).toBeInTheDocument()
    })
  })

  it('should render the app title', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)
    
    expect(screen.getByText('Linear Calendar')).toBeInTheDocument()
  })

  it('should have action buttons', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)
    
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
    expect(screen.getByTitle('Export events as .ics')).toBeInTheDocument()
    expect(screen.getByTitle('Import events from .ics')).toBeInTheDocument()
    expect(screen.getByTitle('Print calendar')).toBeInTheDocument()
  })

  it('should toggle theme when theme button is clicked', () => {
    mockStorage({ theme: 'light', helpSeen: '1' })
    render(<App />)
    
    const themeButton = screen.getByLabelText('Switch to dark mode')
    fireEvent.click(themeButton)
    
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('should update document title with selected year', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)
    
    expect(document.title).toBe('2024 — Linear Calendar')
  })

  it('should open event modal when clicking a date cell', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)

    // Find a clickable date cell (contains a day number)
    const dayCells = screen.getAllByText(/^[1-9]$/)
    expect(dayCells.length).toBeGreaterThan(0)
    // Cells now use onPointerDown; a tap fires pointerdown then pointerup (no movement)
    fireEvent.pointerDown(dayCells[0], { button: 0, pointerId: 1 })
    fireEvent.pointerUp(document, { pointerId: 1 })
    expect(screen.getByText('New event')).toBeInTheDocument()
  })

  it('should close modal when clicking cancel', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)

    // Open modal
    const dayCells = screen.getAllByText(/^[1-9]$/)
    fireEvent.pointerDown(dayCells[0], { button: 0, pointerId: 1 })
    fireEvent.pointerUp(document, { pointerId: 1 })

    expect(screen.getByText('New event')).toBeInTheDocument()

    // Close modal
    fireEvent.click(screen.getByText('Cancel'))

    expect(screen.queryByText('New event')).not.toBeInTheDocument()
  })

  it('should close modal when clicking overlay', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)

    // Open modal
    const dayCells = screen.getAllByText(/^[1-9]$/)
    fireEvent.pointerDown(dayCells[0], { button: 0, pointerId: 1 })
    fireEvent.pointerUp(document, { pointerId: 1 })

    expect(screen.getByText('New event')).toBeInTheDocument()

    // Click overlay (outside the modal)
    const overlay = screen.getByRole('dialog', { name: 'New event' }).parentElement
    fireEvent.click(overlay)

    expect(screen.queryByText('New event')).not.toBeInTheDocument()
  })

  it('should have a Clear button', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)

    expect(screen.getByTitle('Clear all events and tags')).toBeInTheDocument()
  })

  it('should show confirmation dialog when Clear is clicked', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)

    fireEvent.click(screen.getByTitle('Clear all events and tags'))

    expect(screen.getByRole('dialog', { name: 'Clear calendar confirmation' })).toBeInTheDocument()
    expect(screen.getByText('Clear everything')).toBeInTheDocument()
  })

  it('should change year when using year switcher', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)
    
    const nextButton = screen.getByLabelText('Next year')
    fireEvent.click(nextButton)
    
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument()
  })

  it('should open help when pressing ?', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)

    fireEvent.keyDown(document, { key: '?', shiftKey: true })

    expect(screen.getByRole('dialog', { name: 'Help' })).toBeInTheDocument()
  })

  it('should open a new event modal when pressing n', () => {
    mockStorage({ helpSeen: '1' })
    render(<App />)

    fireEvent.keyDown(document, { key: 'n' })

    expect(screen.getByRole('dialog', { name: 'New event' })).toBeInTheDocument()
  })

  it('should export when pressing x', () => {
    mockStorage({ helpSeen: '1' })
    const createObjectURL = vi.fn(() => 'blob:calendar')
    const revokeObjectURL = vi.fn()
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    render(<App />)
    fireEvent.keyDown(document, { key: 'x' })

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:calendar')

    clickSpy.mockRestore()
  })

  it('should open the import picker when pressing i', () => {
    mockStorage({ helpSeen: '1' })
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})

    render(<App />)
    fireEvent.keyDown(document, { key: 'i' })

    expect(clickSpy).toHaveBeenCalledTimes(1)

    clickSpy.mockRestore()
  })

  it('should ignore shortcuts while typing in an input', () => {
    mockStorage({ helpSeen: '1' })
    const createObjectURL = vi.fn(() => 'blob:calendar')
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = vi.fn()

    render(<App />)
    fireEvent.keyDown(document, { key: 'n' })

    const titleInput = screen.getByPlaceholderText('Event title')
    fireEvent.keyDown(titleInput, { key: 'x' })
    fireEvent.keyDown(titleInput, { key: '?' , shiftKey: true })

    expect(createObjectURL).not.toHaveBeenCalled()
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
  })
})
