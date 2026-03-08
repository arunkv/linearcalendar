import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TagFilterBar from '../components/TagFilterBar.jsx'
import { mockT } from './mocks/locale.js'

describe('TagFilterBar', () => {
  const mockTags = [
    { id: '1', name: 'Work', color: '#ff0000' },
    { id: '2', name: 'Personal', color: '#00ff00' },
    { id: '3', name: 'Urgent', color: '#0000ff' },
  ]

  const defaultProps = {
    tags: mockTags,
    hiddenTagIds: new Set(),
    onToggle: vi.fn(),
    onEditTag: vi.fn(),
    onDelete: vi.fn(),
    t: mockT,
  }

  const renderBar = (overrides = {}) => render(<TagFilterBar {...defaultProps} {...overrides} />)

  it('should render nothing when no tags exist', () => {
    const { container } = renderBar({ tags: [] })
    expect(container.firstChild).toBeNull()
  })

  it('should render all tags', () => {
    renderBar()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('should call onToggle when clicking a tag chip', () => {
    const onToggle = vi.fn()
    renderBar({ onToggle })
    fireEvent.click(screen.getByText('Work'))
    expect(onToggle).toHaveBeenCalledWith('1')
  })

  it('should show hidden tags with reduced opacity class', () => {
    renderBar({ hiddenTagIds: new Set(['1']) })
    const workChip = screen.getByText('Work').closest('.tag-filter-bar__chip')
    expect(workChip).toHaveClass('tag-filter-bar__chip--hidden')
  })

  it('should open edit mode when clicking edit icon', () => {
    renderBar()
    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    expect(screen.getByDisplayValue('Work')).toBeInTheDocument()
  })

  it('should call onEditTag when saving edited tag', () => {
    const onEditTag = vi.fn()
    renderBar({ onEditTag })

    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    fireEvent.change(screen.getByDisplayValue('Work'), { target: { value: 'Job' } })
    fireEvent.click(screen.getByText('Save'))

    expect(onEditTag).toHaveBeenCalledWith('1', { name: 'Job', color: '#ff0000' })
  })

  it('should cancel edit mode when clicking cancel', () => {
    renderBar()
    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    expect(screen.getByDisplayValue('Work')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancel'))

    expect(screen.queryByDisplayValue('Work')).not.toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
  })

  it('should cancel edit mode when pressing Escape', () => {
    renderBar()
    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    fireEvent.keyDown(screen.getByDisplayValue('Work'), { key: 'Escape' })
    expect(screen.queryByDisplayValue('Work')).not.toBeInTheDocument()
  })

  it('should save edit when pressing Enter', () => {
    const onEditTag = vi.fn()
    renderBar({ onEditTag })

    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    const input = screen.getByDisplayValue('Work')
    fireEvent.change(input, { target: { value: 'Job' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onEditTag).toHaveBeenCalled()
  })

  it('should show color swatches in edit mode', () => {
    renderBar()
    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    const swatches = document.querySelectorAll('.tag-filter-bar__edit-swatch')
    expect(swatches.length).toBeGreaterThan(0)
  })

  it('should call onDelete when clicking delete icon', () => {
    const onDelete = vi.fn()
    renderBar({ onDelete })
    fireEvent.click(screen.getByLabelText('Delete tag Work'))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('should have correct aria-pressed for visible tags', () => {
    renderBar()
    const workChip = screen.getByText('Work').closest('[role="button"]')
    expect(workChip).toHaveAttribute('aria-pressed', 'true')
  })

  it('should have correct aria-pressed for hidden tags', () => {
    renderBar({ hiddenTagIds: new Set(['1']) })
    const workChip = screen.getByText('Work').closest('[role="button"]')
    expect(workChip).toHaveAttribute('aria-pressed', 'false')
  })
})
