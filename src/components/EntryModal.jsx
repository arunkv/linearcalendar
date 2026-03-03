import { useState, useEffect, useRef } from 'react'
import './EntryModal.css'

export default function EntryModal({ dateKey, initialText, onSave, onClose }) {
  const [text, setText] = useState(initialText || '')
  const textareaRef = useRef(null)

  // Format the date key into a readable heading
  const [year, month, day] = dateKey.split('-').map(Number)
  const heading = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Escape key closes the modal
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleSave() {
    onSave(text)
    onClose()
  }

  function handleDelete() {
    onSave('')
    onClose()
  }

  const hasExistingEntry = Boolean(initialText)

  return (
    <div className="entry-modal__overlay" onMouseDown={handleOverlayClick}>
      <div className="entry-modal__dialog" role="dialog" aria-modal="true" aria-label={heading}>
        <div className="entry-modal__header">
          <h2 className="entry-modal__date">{heading}</h2>
          <button className="entry-modal__close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <textarea
          ref={textareaRef}
          className="entry-modal__textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a note for this date…"
          rows={5}
        />

        <div className="entry-modal__footer">
          {hasExistingEntry && (
            <button className="entry-modal__delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
          <div className="entry-modal__footer-right">
            <button className="entry-modal__cancel-btn" onClick={onClose}>Cancel</button>
            <button className="entry-modal__save-btn" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
