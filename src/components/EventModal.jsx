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

export default function EventModal({
  event,
  initialDate,
  onSave,
  onDelete,
  onClose,
  tags = [],
  onAddTag,
}) {
  const isEditing = Boolean(event)

  const [title, setTitle]             = useState(event?.title     ?? '')
  const [startDate, setStart]         = useState(event?.startDate ?? initialDate ?? '')
  const [endDate, setEnd]             = useState(event?.endDate   ?? initialDate ?? '')
  const [tagId, setTagId]             = useState(event?.tagId     ?? null)
  // legacyColor: used by the "None" chip dot and by old events that have a raw color
  const [legacyColor, setLegacyColor] = useState(event?.color     ?? PRESET_COLORS[0])

  // Inline new-tag form state
  const [showNewTagForm, setShowNewTagForm] = useState(false)
  const [newTagName, setNewTagName]         = useState('')
  const [newTagColor, setNewTagColor]       = useState(PRESET_COLORS[0])

  const titleRef      = useRef(null)
  const newTagInputRef = useRef(null)

  // Auto-focus title on open
  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  // Auto-focus tag name input when new-tag form opens
  useEffect(() => {
    if (showNewTagForm) newTagInputRef.current?.focus()
  }, [showNewTagForm])

  // Escape key closes modal
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // ── Create tag inline ────────────────────────────────────────────────────
  function handleCreateTag() {
    if (!newTagName.trim()) return
    const tag = onAddTag({ name: newTagName.trim(), color: newTagColor })
    setTagId(tag.id)
    setShowNewTagForm(false)
    setNewTagName('')
    setNewTagColor(PRESET_COLORS[0])
  }

  // ── Save event ───────────────────────────────────────────────────────────
  function handleSave() {
    if (!title.trim() || !startDate || !endDate) return
    const finalEnd = endDate < startDate ? startDate : endDate
    // Pass both tagId and color (belt-and-suspenders: color used as fallback
    // if this event is later viewed without its tag in the store).
    onSave({ title: title.trim(), startDate, endDate: finalEnd, color: legacyColor, tagId })
  }

  // Show legacy color swatches only when editing an old event that has a raw
  // color but no tagId (so the user can still change the swatch color).
  const showLegacyColors =
    tagId === null && isEditing && Boolean(event?.color) && !event?.tagId

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

          {/* ── Tag picker ────────────────────────────────────────────────── */}
          <div className="event-modal__label">
            Tag
            <div className="event-modal__tag-picker">
              {/* "None" chip — keeps event using its legacyColor */}
              <button
                type="button"
                className={[
                  'event-modal__tag-option',
                  tagId === null ? 'event-modal__tag-option--selected' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => setTagId(null)}
              >
                <span
                  className="event-modal__tag-dot"
                  style={{ backgroundColor: legacyColor }}
                />
                None
              </button>

              {/* Existing tags */}
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className={[
                    'event-modal__tag-option',
                    tagId === tag.id ? 'event-modal__tag-option--selected' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => setTagId(tag.id)}
                >
                  <span
                    className="event-modal__tag-dot"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
              ))}

              {/* New-tag trigger (hidden while inline form is open) */}
              {!showNewTagForm && (
                <button
                  type="button"
                  className="event-modal__tag-new-trigger"
                  onClick={() => setShowNewTagForm(true)}
                >
                  + New tag
                </button>
              )}
            </div>

            {/* ── Inline new-tag form ──────────────────────────────────── */}
            {showNewTagForm && (
              <div className="event-modal__new-tag-form">
                <input
                  ref={newTagInputRef}
                  className="event-modal__input event-modal__input--compact"
                  type="text"
                  value={newTagName}
                  onChange={e => setNewTagName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateTag()}
                  placeholder="Tag name"
                />
                <div className="event-modal__swatches">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={[
                        'event-modal__swatch',
                        c === newTagColor ? 'event-modal__swatch--selected' : '',
                      ].filter(Boolean).join(' ')}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewTagColor(c)}
                      aria-label={c}
                      title={c}
                    />
                  ))}
                </div>
                <div className="event-modal__new-tag-actions">
                  <button
                    type="button"
                    className="event-modal__btn event-modal__btn--sm event-modal__btn--save"
                    disabled={!newTagName.trim()}
                    onClick={handleCreateTag}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="event-modal__btn event-modal__btn--sm event-modal__btn--cancel"
                    onClick={() => {
                      setShowNewTagForm(false)
                      setNewTagName('')
                      setNewTagColor(PRESET_COLORS[0])
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Legacy color swatches (editing old event with raw color) ── */}
          {showLegacyColors && (
            <div className="event-modal__label">
              Color
              <div className="event-modal__swatches">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={[
                      'event-modal__swatch',
                      c === legacyColor ? 'event-modal__swatch--selected' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ backgroundColor: c }}
                    onClick={() => setLegacyColor(c)}
                    aria-label={c}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}
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
