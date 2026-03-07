import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HelpModal from '../components/HelpModal.jsx'

describe('HelpModal', () => {
  const renderModal = (overrides = {}) =>
    render(<HelpModal onClose={vi.fn()} {...overrides} />)

  it('renders the dialog with correct role and label', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Help')
  })

  it('renders the title', () => {
    renderModal()
    expect(screen.getByText('Welcome to Linear Calendar')).toBeInTheDocument()
  })

  it('renders all content sections', () => {
    renderModal()
    expect(screen.getByText('Getting started')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('Import & Export')).toBeInTheDocument()
    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
  })

  it('calls onClose when the close (✕) button is clicked', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the "Got it" button is clicked', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByText('Got it'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the overlay backdrop is clicked', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    const overlay = screen.getByRole('dialog').parentElement
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when clicking inside the dialog', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders the keyboard shortcuts list', () => {
    renderModal()
    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument()
    expect(screen.getByText((_, node) => node.textContent === '? — open help.')).toBeInTheDocument()
    expect(screen.getByText((_, node) => node.textContent === 'N — create a new event.')).toBeInTheDocument()
    expect(screen.getByText((_, node) => node.textContent === 'X — export events as .ics.')).toBeInTheDocument()
    expect(screen.getByText((_, node) => node.textContent === 'I — import from a .ics file.')).toBeInTheDocument()
    expect(screen.getByText((_, node) => node.textContent === 'Esc — close the current dialog.')).toBeInTheDocument()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose for other key presses', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(onClose).not.toHaveBeenCalled()
  })
})
