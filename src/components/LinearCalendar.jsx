import { Fragment, useMemo, useState, useRef } from 'react'
import {
  buildMonthRow,
  getMonthName,
  DAY_ABBRS,
  GRID_COLS,
  isToday,
  isWeekendColumn,
  toDateKey,
  getEventsForMonth,
  eventsToIcs,
  icsToEvents,
} from '../utils/calendarUtils.js'
import { useEvents } from '../hooks/useEvents.js'
import { useTags } from '../hooks/useTags.js'
import EventModal from './EventModal.jsx'
import YearSwitcher from './YearSwitcher.jsx'
import TagFilterBar from './TagFilterBar.jsx'
import './LinearCalendar.css'

// Stable module-level arrays — built once, not on every render
const MONTH_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const COL_INDICES = Array.from({ length: GRID_COLS }, (_, i) => i) // eslint-disable-line no-unused-vars

// ── Color resolution ──────────────────────────────────────────────────────────
// Tagged event → use tag's current color; otherwise neutral gray
function resolveEventColor(ev, tagsById) {
  if (ev.tagId && tagsById[ev.tagId]) return tagsById[ev.tagId].color
  return '#6b7280'
}

export default function LinearCalendar({ year, onChangeYear, theme, onToggleTheme }) {
  const { events, addEvent, updateEvent, deleteEvent, replaceAll } = useEvents()
  const { tags, addTag, updateTag, deleteTag, clearAll: clearAllTags, replaceAll: replaceAllTags } = useTags()

  const [modalState, setModalState] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  // null = closed
  // { mode: 'create', initialDate: 'YYYY-MM-DD' }
  // { mode: 'edit', event: {...} }

  // ephemeral — not persisted; Set of tag IDs whose events are hidden
  const [hiddenTagIds, setHiddenTagIds] = useState(() => new Set())

  const importInputRef = useRef(null)

  // Pre-compute all 12 month rows; recomputes only when `year` changes
  const monthRows = useMemo(
    () =>
      MONTH_INDICES.map((monthIndex) => ({
        monthIndex,
        name: getMonthName(monthIndex).slice(0, 3),
        cells: buildMonthRow(year, monthIndex),
      })),
    [year]
  )

  // Fast lookup: { [tagId]: tag }
  const tagsById = useMemo(
    () => Object.fromEntries(tags.map(t => [t.id, t])),
    [tags]
  )

  // Filter before passing to getEventsForMonth so row-packing sees only visible
  // events (no ghost rows from hidden-tag events).
  const visibleEvents = useMemo(() => {
    if (hiddenTagIds.size === 0) return events
    return events.filter(ev => !ev.tagId || !hiddenTagIds.has(ev.tagId))
  }, [events, hiddenTagIds])

  // ── Tag visibility toggle ─────────────────────────────────────────────────
  function toggleTagVisibility(tagId) {
    setHiddenTagIds(prev => {
      const next = new Set(prev)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  // ── Tag deletion (with guard if events use the tag) ───────────────────────
  function handleDeleteTag(tagId) {
    const affected = events.filter(ev => ev.tagId === tagId)
    if (
      affected.length > 0 &&
      !window.confirm(
        `${affected.length} event${affected.length === 1 ? '' : 's'} use this tag. ` +
        `Remove the tag from those events and delete it?`
      )
    ) {
      return
    }
    // Batch-clear tagId from every affected event
    affected.forEach(ev => updateEvent(ev.id, { tagId: null }))
    // Remove from hidden set if present
    setHiddenTagIds(prev => {
      const next = new Set(prev)
      next.delete(tagId)
      return next
    })
    deleteTag(tagId)
  }

  // ── Clear all events and tags ─────────────────────────────────────────────
  function handleClearAll() {
    replaceAll([])
    clearAllTags()
    setHiddenTagIds(new Set())
    setShowClearConfirm(false)
  }

  // ── Export events as .ics file download ───────────────────────────────────
  function handleExport() {
    const blob = new Blob([eventsToIcs(events, tagsById)], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'linear-calendar-events.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Import events from a .ics file ────────────────────────────────────────
  function handleImportChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const { events: parsed, tags: parsedTags } = icsToEvents(ev.target.result)
        if (parsed.length > 0) {
          replaceAll(parsed)
          replaceAllTags(parsedTags)
          setHiddenTagIds(new Set())
        }
      } catch {
        // ignore invalid .ics
      }
    }
    reader.readAsText(file)
    e.target.value = '' // reset so same file can be re-imported
  }

  return (
    <div className="linear-calendar">
      {/* ── Top header bar ─────────────────────────────────────────────────── */}
      <div className="linear-calendar__header">
        {/* Brand: logo + app title */}
        <div className="linear-calendar__brand">
          <img
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            className="linear-calendar__brand-logo"
            alt=""
            aria-hidden="true"
          />
          <span className="linear-calendar__brand-title">Linear Calendar</span>
        </div>

        <YearSwitcher year={year} onYearChange={onChangeYear} />

        <div className="linear-calendar__header-actions">
          <button
            className="linear-calendar__action-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          <button
            className="linear-calendar__action-btn"
            onClick={handleExport}
            title="Export events as .ics"
          >
            ↓ Export
          </button>

          <button
            className="linear-calendar__action-btn"
            onClick={() => importInputRef.current?.click()}
            title="Import events from .ics"
          >
            ↑ Import
          </button>

          <button
            className="linear-calendar__action-btn linear-calendar__action-btn--danger"
            onClick={() => setShowClearConfirm(true)}
            title="Clear all events and tags"
          >
            ✕ Clear
          </button>

          <button
            className="linear-calendar__action-btn"
            onClick={() => window.print()}
            title="Print calendar"
          >
            ⎙ Print
          </button>

          {/* Hidden file input for import */}
          <input
            ref={importInputRef}
            type="file"
            accept=".ics"
            style={{ display: 'none' }}
            onChange={handleImportChange}
          />
        </div>
      </div>

      {/* ── Tag filter bar (hidden when no tags exist) ──────────────────────── */}
      <TagFilterBar
        tags={tags}
        hiddenTagIds={hiddenTagIds}
        onToggle={toggleTagVisibility}
        onEditTag={updateTag}
        onDelete={handleDeleteTag}
      />

      {/* ── Grid wrapper (handles fallback scroll on narrow viewports) ──────── */}
      <div className="linear-calendar__grid-wrapper">
        <div className="linear-calendar__grid">

          {/* ── One pair of rows per month ────────────────────────────────── */}
          {monthRows.map(({ monthIndex, name, cells }) => {
            const monthEvents = getEventsForMonth(visibleEvents, year, monthIndex)

            return (
              <Fragment key={monthIndex}>
                {/* Date row */}
                <div className="linear-calendar__row">
                  <div className="linear-calendar__month-label">{name}</div>

                  {cells.map((day, colIndex) => {
                    const empty = day === null
                    const weekend = isWeekendColumn(colIndex)
                    const today = !empty && isToday(year, monthIndex, day)
                    const dateKey = !empty ? toDateKey(year, monthIndex, day) : null

                    const cellClass = [
                      'linear-calendar__cell',
                      empty   ? 'linear-calendar__cell--empty'     : 'linear-calendar__cell--clickable',
                      weekend ? 'linear-calendar__cell--weekend'    : '',
                      today   ? 'linear-calendar__cell--today'      : '',
                    ].filter(Boolean).join(' ')

                    return (
                      <div
                        key={colIndex}
                        className={cellClass}
                        onClick={empty ? undefined : () => setModalState({ mode: 'create', initialDate: dateKey })}
                      >
                        {!empty && (
                          <>
                            {today
                              ? <span className="linear-calendar__today-dot">{day}</span>
                              : <span className="linear-calendar__cell-day">{day}</span>
                            }
                            <span className="linear-calendar__cell-dow">
                              {DAY_ABBRS[colIndex % 7]}
                            </span>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Events row */}
                <div className="linear-calendar__row">
                  <div className="linear-calendar__events-container">
                    {monthEvents.map(ev => (
                      <div
                        key={ev.id}
                        className="linear-calendar__event-bar"
                        style={{
                          gridColumn: `${ev.startCol + 1} / ${ev.endCol + 2}`,
                          gridRow: ev.row,
                          backgroundColor: resolveEventColor(ev, tagsById),
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setModalState({ mode: 'edit', event: ev })
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              </Fragment>
            )
          })}

        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="linear-calendar__footer">
        <span>© {year} Arun K Viswanathan</span>
        <span className="linear-calendar__footer-sep">·</span>
        <span>Built with <a href="https://claude.ai" target="_blank" rel="noreferrer">Claude</a></span>
      </footer>

      {/* ── Clear confirmation dialog ────────────────────────────────────────── */}
      {showClearConfirm && (
        <div className="linear-calendar__overlay" onClick={() => setShowClearConfirm(false)}>
          <div
            className="linear-calendar__confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Clear calendar confirmation"
            onClick={e => e.stopPropagation()}
          >
            <h2>Clear calendar?</h2>
            <p>
              This will permanently delete{' '}
              <strong>{events.length} event{events.length !== 1 ? 's' : ''}</strong> and{' '}
              <strong>{tags.length} tag{tags.length !== 1 ? 's' : ''}</strong>.
              This cannot be undone.
            </p>
            <p className="linear-calendar__confirm-export-hint">
              💡 We recommend exporting your data before clearing.
            </p>
            <div className="linear-calendar__confirm-actions">
              <button className="linear-calendar__action-btn" onClick={handleExport}>
                ↓ Export first
              </button>
              <div className="linear-calendar__confirm-actions-right">
                <button className="linear-calendar__action-btn" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </button>
                <button
                  className="linear-calendar__action-btn linear-calendar__action-btn--danger"
                  onClick={handleClearAll}
                >
                  Clear everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Event modal ─────────────────────────────────────────────────────── */}
      {modalState && (
        <EventModal
          event={modalState.mode === 'edit' ? modalState.event : null}
          initialDate={modalState.mode === 'create' ? modalState.initialDate : null}
          tags={tags}
          onAddTag={addTag}
          onSave={(data) => {
            if (modalState.mode === 'edit') updateEvent(modalState.event.id, data)
            else addEvent(data)
            setModalState(null)
          }}
          onDelete={modalState.mode === 'edit'
            ? () => { deleteEvent(modalState.event.id); setModalState(null) }
            : undefined
          }
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}
