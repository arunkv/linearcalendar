import { useState, useEffect, useRef } from 'react'
import './EventModal.css'

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f97316', // orange
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#6b7280', // gray
]

export default function EventModal({ event, initialDate, onSave, onDelete, onClose }) {
  const isEditing = Boolean(event)

  const [title, setTitle]       = useState(event?.title     ?? '')
  const [startDate, setStart]   = useState(event?.startDate ?? initialDate ?? '')
  const [endDate, setEnd]       = useState(event?.endDate   ?? initialDate ?? '')
  const [color, setColor]       = useState(event?.color     ?? PRESET_COLORS[0])

  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function handleSave() {
    if (!title.trim() || !startDate || !endDate) return
    // Ensure end >= start
    const finalEnd = endDate < startDate ? startDate : endDate
    onSave({ title: title.trim(), startDate, endDate: finalEnd, color })
  }

  return (
    <div className="event-modal__overlay" onClick={onClose}>
      <div
        className="event-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? 'Edit event' : 'New event'}
      >
        <div className="event-modal__header">
          <h2 className="event-modal__title">{isEditing ? 'Edit event' : 'New event'}</h2>
          <button className="event-modal__close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="event-modal__body">
          {/* Title */}
          <label className="event-modal__label">
            Title
            <input
              ref={titleRef}
              className="event-modal__input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Event title"
            />
          </label>

          {/* Dates */}
          <div className="event-modal__dates">
            <label className="event-modal__label">
              Start
              <input
                className="event-modal__input"
                type="date"
                value={startDate}
                onChange={e => setStart(e.target.value)}
              />
            </label>
            <label className="event-modal__label">
              End
              <input
                className="event-modal__input"
                type="date"
                value={endDate}
                min={startDate}
                onChange={e => setEnd(e.target.value)}
              />
            </label>
          </div>

          {/* Color swatches */}
          <div className="event-modal__label">
            Color
            <div className="event-modal__swatches">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  className={['event-modal__swatch', c === color ? 'event-modal__swatch--selected' : ''].filter(Boolean).join(' ')}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={c}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="event-modal__footer">
          {isEditing && onDelete && (
            <button className="event-modal__btn event-modal__btn--delete" onClick={onDelete}>
              Delete
            </button>
          )}
          <div className="event-modal__footer-right">
            <button className="event-modal__btn event-modal__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="event-modal__btn event-modal__btn--save"
              onClick={handleSave}
              disabled={!title.trim() || !startDate || !endDate}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
