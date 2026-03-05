import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockSearch = '?year=2024'
  })

  it('should render the calendar with year from URL', () => {
    localStorage.getItem.mockReturnValue(null)
    render(<App />)
    
    expect(screen.getByDisplayValue('2024')).toBeInTheDocument()
  })

  it('should display all 12 months', () => {
    localStorage.getItem.mockReturnValue(null)
    render(<App />)
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach(month => {
      expect(screen.getByText(month)).toBeInTheDocument()
    })
  })

  it('should render the app title', () => {
    localStorage.getItem.mockReturnValue(null)
    render(<App />)
    
    expect(screen.getByText('Linear Calendar')).toBeInTheDocument()
  })

  it('should have action buttons', () => {
    localStorage.getItem.mockReturnValue(null)
    render(<App />)
    
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
    expect(screen.getByTitle('Export events as .ics')).toBeInTheDocument()
    expect(screen.getByTitle('Import events from .ics')).toBeInTheDocument()
    expect(screen.getByTitle('Print calendar')).toBeInTheDocument()
  })

  it('should toggle theme when theme button is clicked', () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'theme') return 'light'
      return null
    })
    render(<App />)
    
    const themeButton = screen.getByLabelText('Switch to dark mode')
    fireEvent.click(themeButton)
    
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('should update document title with selected year', () => {
    localStorage.getItem.mockReturnValue(null)
    render(<App />)
    
    expect(document.title).toBe('2024 — Linear Calendar')
  })

  it('should open event modal when clicking a date cell', () => {
    localStorage.getItem.mockReturnValue(null)
    render(<App />)
    
    // Find a clickable date cell (contains a day number)
    const dayCells = screen.getAllByText(/^[1-9]$/)
    expect(dayCells.length).toBeGreaterThan(0)
    fireEvent.click(dayCells[0])
    expect(screen.getByText('New event')).toBeInTheDocument()
  })

  it('should close modal when clicking cancel', () => {
    localStorage.getItem.mockReturnValue(null)
    render(<App />)
    
    // Open modal
    const dayCells = screen.getAllByText(/^[1-9]$/)
    fireEvent.click(dayCells[0])
    
    expect(screen.getByText('New event')).toBeInTheDocument()
    
    // Close modal
    fireEvent.click(screen.getByText('Cancel'))
    
    expect(screen.queryByText('New event')).not.toBeInTheDocument()
  })

  it('should close modal when clicking overlay', () => {
    localStorage.getItem.mockReturnValue(null)
    render(<App />)
    
    // Open modal
    const dayCells = screen.getAllByText(/^[1-9]$/)
    fireEvent.click(dayCells[0])
    
    expect(screen.getByText('New event')).toBeInTheDocument()
    
    // Click overlay (outside the modal)
    const overlay = screen.getByRole('dialog').parentElement
    fireEvent.click(overlay)
    
    expect(screen.queryByText('New event')).not.toBeInTheDocument()
  })

  it('should change year when using year switcher', () => {
    localStorage.getItem.mockReturnValue(null)
    render(<App />)
    
    const nextButton = screen.getByLabelText('Next year')
    fireEvent.click(nextButton)
    
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument()
  })
})
