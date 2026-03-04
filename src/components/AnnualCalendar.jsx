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
import './AnnualCalendar.css'

// Stable module-level arrays — built once, not on every render
const MONTH_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const COL_INDICES = Array.from({ length: GRID_COLS }, (_, i) => i) // eslint-disable-line no-unused-vars

// ── Color resolution ──────────────────────────────────────────────────────────
// 1. Tagged event  → use tag's current color
// 2. Legacy event  → use ev.color (raw swatch pick)
// 3. Fallback      → neutral gray
function resolveEventColor(ev, tagsById) {
  if (ev.tagId && tagsById[ev.tagId]) return tagsById[ev.tagId].color
  if (ev.color) return ev.color
  return '#6b7280'
}

export default function AnnualCalendar({ year, onChangeYear, theme, onToggleTheme }) {
  const { events, addEvent, updateEvent, deleteEvent, replaceAll } = useEvents()
  const { tags, addTag, deleteTag } = useTags()

  const [modalState, setModalState] = useState(null)
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

  // ── Export events as .ics file download ───────────────────────────────────
  function handleExport() {
    const blob = new Blob([eventsToIcs(events)], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'annual-calendar-events.ics'
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
        const parsed = icsToEvents(ev.target.result)
        if (parsed.length > 0) replaceAll(parsed)
      } catch {
        // ignore invalid .ics
      }
    }
    reader.readAsText(file)
    e.target.value = '' // reset so same file can be re-imported
  }

  return (
    <div className="annual-calendar">
      {/* ── Top header bar ─────────────────────────────────────────────────── */}
      <div className="annual-calendar__header">
        {/* Brand: logo + app title */}
        <div className="annual-calendar__brand">
          <img
            src="/favicon.svg"
            className="annual-calendar__brand-logo"
            alt=""
            aria-hidden="true"
          />
          <span className="annual-calendar__brand-title">Annual Calendar</span>
        </div>

        <YearSwitcher year={year} onYearChange={onChangeYear} />

        <div className="annual-calendar__header-actions">
          <button
            className="annual-calendar__action-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          <button
            className="annual-calendar__action-btn"
            onClick={handleExport}
            title="Export events as .ics"
          >
            ↓ Export
          </button>

          <button
            className="annual-calendar__action-btn"
            onClick={() => importInputRef.current?.click()}
            title="Import events from .ics"
          >
            ↑ Import
          </button>

          <button
            className="annual-calendar__action-btn"
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
        onDelete={handleDeleteTag}
      />

      {/* ── Grid wrapper (handles fallback scroll on narrow viewports) ──────── */}
      <div className="annual-calendar__grid-wrapper">
        <div className="annual-calendar__grid">

          {/* ── One pair of rows per month ────────────────────────────────── */}
          {monthRows.map(({ monthIndex, name, cells }) => {
            const monthEvents = getEventsForMonth(visibleEvents, year, monthIndex)

            return (
              <Fragment key={monthIndex}>
                {/* Date row */}
                <div className="annual-calendar__row">
                  <div className="annual-calendar__month-label">{name}</div>

                  {cells.map((day, colIndex) => {
                    const empty = day === null
                    const weekend = isWeekendColumn(colIndex)
                    const today = !empty && isToday(year, monthIndex, day)
                    const dateKey = !empty ? toDateKey(year, monthIndex, day) : null

                    const cellClass = [
                      'annual-calendar__cell',
                      empty   ? 'annual-calendar__cell--empty'     : 'annual-calendar__cell--clickable',
                      weekend ? 'annual-calendar__cell--weekend'    : '',
                      today   ? 'annual-calendar__cell--today'      : '',
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
                              ? <span className="annual-calendar__today-dot">{day}</span>
                              : <span className="annual-calendar__cell-day">{day}</span>
                            }
                            <span className="annual-calendar__cell-dow">
                              {DAY_ABBRS[colIndex % 7]}
                            </span>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Events row */}
                <div className="annual-calendar__row">
                  <div className="annual-calendar__events-container">
                    {monthEvents.map(ev => (
                      <div
                        key={ev.id}
                        className="annual-calendar__event-bar"
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
      <footer className="annual-calendar__footer">
        <span>© {year} Arun K Viswanathan</span>
        <span className="annual-calendar__footer-sep">·</span>
        <span>Built with <a href="https://claude.ai" target="_blank" rel="noreferrer">Claude</a></span>
      </footer>

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
