import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EventModal from '../components/EventModal.jsx'
import { mockT } from './mocks/locale.js'

describe('EventModal', () => {
  const mockTags = [
    { id: '1', name: 'Work', color: '#ff0000' },
    { id: '2', name: 'Personal', color: '#00ff00' },
  ]

  const defaultProps = {
    event: null,
    initialDate: '2024-03-15',
    onSave: vi.fn(),
    onDelete: vi.fn(),
    onClose: vi.fn(),
    tags: mockTags,
    onAddTag: vi.fn(),
    t: mockT,
  }

  const renderModal = (overrides = {}) => render(<EventModal {...defaultProps} {...overrides} />)

  it('should render in create mode', () => {
    renderModal()
    expect(screen.getByText('New event')).toBeInTheDocument()
  })

  it('should render in edit mode', () => {
    renderModal({
      event: {
        id: '1',
        title: 'Test Event',
        startDate: '2024-03-15',
        endDate: '2024-03-15',
        tagId: '1',
      },
      initialDate: null,
    })
    expect(screen.getByText('Edit event')).toBeInTheDocument()
  })

  it('should populate form with event data in edit mode', () => {
    renderModal({
      event: {
        id: '1',
        title: 'Test Event',
        startDate: '2024-03-15',
        endDate: '2024-03-17',
        tagId: '1',
      },
      initialDate: null,
    })
    expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2024-03-15')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2024-03-17')).toBeInTheDocument()
  })

  it('should populate with initial date in create mode', () => {
    renderModal({ initialDate: '2024-06-20' })
    // Both start and end date should have the initial date
    const dateInputs = screen.getAllByDisplayValue('2024-06-20')
    expect(dateInputs).toHaveLength(2)
  })

  it('should call onSave when clicking save', () => {
    const onSave = vi.fn()
    renderModal({ onSave })

    fireEvent.change(screen.getByPlaceholderText('Event title'), {
      target: { value: 'New Event' },
    })
    fireEvent.click(screen.getByText('Save'))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Event',
        startDate: '2024-03-15',
        endDate: '2024-03-15',
      })
    )
  })

  it('should call onClose when clicking cancel', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should call onClose when clicking close button', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should show delete button in edit mode', () => {
    renderModal({
      event: { id: '1', title: 'Test Event', startDate: '2024-03-15', endDate: '2024-03-15' },
      initialDate: null,
    })
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('should not show delete button in create mode', () => {
    renderModal()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('should call onDelete when clicking delete', () => {
    const onDelete = vi.fn()
    renderModal({
      event: { id: '1', title: 'Test Event', startDate: '2024-03-15', endDate: '2024-03-15' },
      initialDate: null,
      onDelete,
    })
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalled()
  })

  it('should show tag options', () => {
    renderModal()
    expect(screen.getByText('None')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
  })

  it('should select tag when clicking', () => {
    const onSave = vi.fn()
    renderModal({ onSave })

    fireEvent.change(screen.getByPlaceholderText('Event title'), {
      target: { value: 'Tagged Event' },
    })
    fireEvent.click(screen.getByText('Work'))
    fireEvent.click(screen.getByText('Save'))

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ tagId: '1' }))
  })

  it('should show new tag form when clicking + New tag', () => {
    renderModal()
    fireEvent.click(screen.getByText('+ New tag'))
    expect(screen.getByPlaceholderText('Tag name')).toBeInTheDocument()
    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('should create new tag and select it', () => {
    const onAddTag = vi.fn().mockReturnValue({ id: '3', name: 'New Tag', color: '#3b82f6' })
    renderModal({ onAddTag })

    fireEvent.click(screen.getByText('+ New tag'))
    fireEvent.change(screen.getByPlaceholderText('Tag name'), {
      target: { value: 'New Tag' },
    })
    fireEvent.click(screen.getByText('Create'))

    expect(onAddTag).toHaveBeenCalledWith({ name: 'New Tag', color: '#3b82f6' })
  })

  it('should disable save when title is empty', () => {
    renderModal()
    expect(screen.getByText('Save')).toBeDisabled()
  })

  it('should have correct dialog attributes', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'New event')
  })
})
