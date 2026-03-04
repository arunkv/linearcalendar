import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TagFilterBar from '../components/TagFilterBar.jsx'

describe('TagFilterBar', () => {
  const mockTags = [
    { id: '1', name: 'Work', color: '#ff0000' },
    { id: '2', name: 'Personal', color: '#00ff00' },
    { id: '3', name: 'Urgent', color: '#0000ff' },
  ]

  it('should render nothing when no tags exist', () => {
    const { container } = render(
      <TagFilterBar
        tags={[]}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render all tags', () => {
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('should call onToggle when clicking a tag chip', () => {
    const onToggle = vi.fn()
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={onToggle}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    
    fireEvent.click(screen.getByText('Work'))
    expect(onToggle).toHaveBeenCalledWith('1')
  })

  it('should show hidden tags with reduced opacity class', () => {
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set(['1'])}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    
    const workChip = screen.getByText('Work').closest('.tag-filter-bar__chip')
    expect(workChip).toHaveClass('tag-filter-bar__chip--hidden')
  })

  it('should open edit mode when clicking edit icon', () => {
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    
    const editButton = screen.getByLabelText('Edit tag Work')
    fireEvent.click(editButton)
    
    expect(screen.getByDisplayValue('Work')).toBeInTheDocument()
  })

  it('should call onEditTag when saving edited tag', () => {
    const onEditTag = vi.fn()
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={onEditTag}
        onDelete={vi.fn()}
      />
    )
    
    // Enter edit mode
    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    
    // Change the name
    const input = screen.getByDisplayValue('Work')
    fireEvent.change(input, { target: { value: 'Job' } })
    
    // Click save
    fireEvent.click(screen.getByText('Save'))
    
    expect(onEditTag).toHaveBeenCalledWith('1', { name: 'Job', color: '#ff0000' })
  })

  it('should cancel edit mode when clicking cancel', () => {
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    
    // Enter edit mode
    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    expect(screen.getByDisplayValue('Work')).toBeInTheDocument()
    
    // Cancel
    fireEvent.click(screen.getByText('Cancel'))
    
    // Input should be gone
    expect(screen.queryByDisplayValue('Work')).not.toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
  })

  it('should cancel edit mode when pressing Escape', () => {
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    
    // Enter edit mode
    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    const input = screen.getByDisplayValue('Work')
    
    // Press Escape
    fireEvent.keyDown(input, { key: 'Escape' })
    
    // Input should be gone
    expect(screen.queryByDisplayValue('Work')).not.toBeInTheDocument()
  })

  it('should save edit when pressing Enter', () => {
    const onEditTag = vi.fn()
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={onEditTag}
        onDelete={vi.fn()}
      />
    )
    
    // Enter edit mode
    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    
    // Change and press Enter
    const input = screen.getByDisplayValue('Work')
    fireEvent.change(input, { target: { value: 'Job' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(onEditTag).toHaveBeenCalled()
  })

  it('should show color swatches in edit mode', () => {
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    
    fireEvent.click(screen.getByLabelText('Edit tag Work'))
    
    // Should have color swatches
    const swatches = document.querySelectorAll('.tag-filter-bar__edit-swatch')
    expect(swatches.length).toBeGreaterThan(0)
  })

  it('should call onDelete when clicking delete icon', () => {
    const onDelete = vi.fn()
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={onDelete}
      />
    )
    
    const deleteButton = screen.getByLabelText('Delete tag Work')
    fireEvent.click(deleteButton)
    
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('should have correct aria-pressed for visible tags', () => {
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set()}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    
    const workChip = screen.getByText('Work').closest('[role="button"]')
    expect(workChip).toHaveAttribute('aria-pressed', 'true')
  })

  it('should have correct aria-pressed for hidden tags', () => {
    render(
      <TagFilterBar
        tags={mockTags}
        hiddenTagIds={new Set(['1'])}
        onToggle={vi.fn()}
        onEditTag={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    
    const workChip = screen.getByText('Work').closest('[role="button"]')
    expect(workChip).toHaveAttribute('aria-pressed', 'false')
  })
})
