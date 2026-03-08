import { useState, useEffect, useRef } from 'react'
import './TagFilterBar.css'
import t from '../locales/index.js'

const PRESET_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f97316',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f59e0b',
  '#6b7280',
]

export default function TagFilterBar({ tags, hiddenTagIds, onToggle, onEditTag, onDelete }) {
  const [editingTagId, setEditingTagId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState(PRESET_COLORS[0])
  const editInputRef = useRef(null)

  // Auto-focus edit input when form opens
  useEffect(() => {
    if (editingTagId) editInputRef.current?.focus()
  }, [editingTagId])

  // Render nothing when there are no tags yet
  if (tags.length === 0) return null

  function startEdit(tag, e) {
    e.stopPropagation()
    setEditingTagId(tag.id)
    setEditName(tag.name)
    setEditColor(tag.color)
  }

  function handleSaveEdit() {
    if (!editName.trim()) return
    onEditTag(editingTagId, { name: editName.trim(), color: editColor })
    setEditingTagId(null)
  }

  function handleCancelEdit() {
    setEditingTagId(null)
  }

  return (
    <div className="tag-filter-bar">
      <span className="tag-filter-bar__label">{t.tagFilterBar.label}</span>
      <div className="tag-filter-bar__chips">
        {tags.map(tag => {
          // ── Inline edit form ───────────────────────────────────────────────
          if (editingTagId === tag.id) {
            return (
              <div key={tag.id} className="tag-filter-bar__edit-form">
                <input
                  ref={editInputRef}
                  className="tag-filter-bar__edit-input"
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveEdit()
                    if (e.key === 'Escape') handleCancelEdit()
                  }}
                  placeholder={t.tagFilterBar.tagNamePlaceholder}
                />
                <div className="tag-filter-bar__edit-swatches">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={[
                        'tag-filter-bar__edit-swatch',
                        c === editColor ? 'tag-filter-bar__edit-swatch--selected' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{ backgroundColor: c }}
                      onClick={() => setEditColor(c)}
                      aria-label={c}
                      title={c}
                    />
                  ))}
                </div>
                <div className="tag-filter-bar__edit-actions">
                  <button
                    type="button"
                    className="tag-filter-bar__edit-btn tag-filter-bar__edit-btn--save"
                    disabled={!editName.trim()}
                    onClick={handleSaveEdit}
                  >
                    {t.tagFilterBar.save}
                  </button>
                  <button
                    type="button"
                    className="tag-filter-bar__edit-btn tag-filter-bar__edit-btn--cancel"
                    onClick={handleCancelEdit}
                  >
                    {t.tagFilterBar.cancel}
                  </button>
                </div>
              </div>
            )
          }

          // ── Normal chip ────────────────────────────────────────────────────
          const isHidden = hiddenTagIds.has(tag.id)
          return (
            <div
              key={tag.id}
              className={['tag-filter-bar__chip', isHidden ? 'tag-filter-bar__chip--hidden' : '']
                .filter(Boolean)
                .join(' ')}
              role="button"
              tabIndex={0}
              aria-pressed={!isHidden}
              onClick={() => onToggle(tag.id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(tag.id)}
            >
              <span className="tag-filter-bar__chip-dot" style={{ backgroundColor: tag.color }} />
              <span className="tag-filter-bar__chip-label">{tag.name}</span>
              {/* ✏ edit icon */}
              <span
                className="tag-filter-bar__chip-edit"
                role="button"
                tabIndex={0}
                aria-label={t.tagFilterBar.editTag(tag.name)}
                onClick={e => startEdit(tag, e)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && startEdit(tag, e)}
              >
                ✏
              </span>
              {/* × delete icon */}
              <span
                className="tag-filter-bar__chip-delete"
                role="button"
                tabIndex={0}
                aria-label={t.tagFilterBar.deleteTag(tag.name)}
                onClick={e => {
                  e.stopPropagation()
                  onDelete(tag.id)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    onDelete(tag.id)
                  }
                }}
              >
                ×
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
