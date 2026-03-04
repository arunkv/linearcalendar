import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import YearSwitcher from '../components/YearSwitcher.jsx'

describe('YearSwitcher', () => {
  it('should render the current year', () => {
    render(<YearSwitcher year={2024} onYearChange={vi.fn()} />)
    expect(screen.getByDisplayValue('2024')).toBeInTheDocument()
  })

  it('should call onYearChange with previous year when clicking left arrow', () => {
    const onYearChange = vi.fn()
    render(<YearSwitcher year={2024} onYearChange={onYearChange} />)
    
    const prevButton = screen.getByLabelText('Previous year')
    fireEvent.click(prevButton)
    
    expect(onYearChange).toHaveBeenCalledWith(2023)
  })

  it('should call onYearChange with next year when clicking right arrow', () => {
    const onYearChange = vi.fn()
    render(<YearSwitcher year={2024} onYearChange={onYearChange} />)
    
    const nextButton = screen.getByLabelText('Next year')
    fireEvent.click(nextButton)
    
    expect(onYearChange).toHaveBeenCalledWith(2025)
  })

  it('should have year select dropdown', () => {
    render(<YearSwitcher year={2024} onYearChange={vi.fn()} />)
    expect(screen.getByLabelText('Select year')).toBeInTheDocument()
  })

  it('should call onYearChange when selecting a year from dropdown', () => {
    const onYearChange = vi.fn()
    render(<YearSwitcher year={2024} onYearChange={onYearChange} />)
    
    const select = screen.getByLabelText('Select year')
    fireEvent.change(select, { target: { value: '2025' } })
    
    expect(onYearChange).toHaveBeenCalledWith(2025)
  })

  it('should disable previous button at year 1', () => {
    render(<YearSwitcher year={1} onYearChange={vi.fn()} />)
    const prevButton = screen.getByLabelText('Previous year')
    expect(prevButton).toBeDisabled()
  })

  it('should disable next button at year 9999', () => {
    render(<YearSwitcher year={9999} onYearChange={vi.fn()} />)
    const nextButton = screen.getByLabelText('Next year')
    expect(nextButton).toBeDisabled()
  })

  it('should open custom year input when selecting "Enter year…"', () => {
    render(<YearSwitcher year={2024} onYearChange={vi.fn()} />)
    
    const select = screen.getByLabelText('Select year')
    fireEvent.change(select, { target: { value: '__custom__' } })
    
    expect(screen.getByLabelText('Enter year')).toBeInTheDocument()
  })

  it('should call onYearChange when entering custom year', () => {
    const onYearChange = vi.fn()
    render(<YearSwitcher year={2024} onYearChange={onYearChange} />)
    
    // Open custom input
    fireEvent.change(screen.getByLabelText('Select year'), { target: { value: '__custom__' } })
    
    // Enter a year
    const input = screen.getByLabelText('Enter year')
    fireEvent.change(input, { target: { value: '1990' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(onYearChange).toHaveBeenCalledWith(1990)
  })

  it('should handle large year values', () => {
    render(<YearSwitcher year={9999} onYearChange={vi.fn()} />)
    const select = screen.getByLabelText('Select year')
    expect(select).toHaveValue('9999')
  })
})
