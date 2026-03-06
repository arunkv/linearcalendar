import { Fragment, useMemo, useState, useRef } from 'react'

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const PrintIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
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
import HelpModal from './HelpModal.jsx'
import './LinearCalendar.css'

// Stable module-level arrays — built once, not on every render
const MONTH_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const COL_INDICES = Array.from({ length: GRID_COLS }, (_, i) => i) // eslint-disable-line no-unused-vars

// ── Date formatting for tooltip ───────────────────────────────────────────────
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`
}
function formatDateRange(start, end) {
  return start === end ? formatDate(start) : `${formatDate(start)} – ${formatDate(end)}`
}

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
  const [deleteTagConfirm, setDeleteTagConfirm] = useState(null) // tagId pending deletion
  const [importError, setImportError] = useState(null)
  const [showHelp, setShowHelp] = useState(
    () => !localStorage.getItem('helpSeen')
  )
  const [tooltip, setTooltip] = useState(null) // { event, x, y }

  function openHelp() { setShowHelp(true) }
  function closeHelp() {
    localStorage.setItem('helpSeen', '1')
    setShowHelp(false)
  }

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
    if (affected.length > 0) {
      setDeleteTagConfirm(tagId)
      return
    }
    confirmDeleteTag(tagId)
  }

  function confirmDeleteTag(tagId) {
    const affected = events.filter(ev => ev.tagId === tagId)
    // Batch-clear tagId from every affected event
    affected.forEach(ev => updateEvent(ev.id, { tagId: null }))
    // Remove from hidden set if present
    setHiddenTagIds(prev => {
      const next = new Set(prev)
      next.delete(tagId)
      return next
    })
    deleteTag(tagId)
    setDeleteTagConfirm(null)
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
    if (!file.name.toLowerCase().endsWith('.ics')) {
      setImportError('Invalid file type — please select a .ics file.')
      return
    }
    setImportError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const { events: parsed, tags: parsedTags } = icsToEvents(ev.target.result)
        if (parsed.length === 0) {
          setImportError('No valid events found in the file.')
        } else {
          replaceAll(parsed)
          replaceAllTags(parsedTags)
          setHiddenTagIds(new Set())
        }
      } catch (err) {
        setImportError(err.message === 'ICS file too large' ? 'File too large (max 5 MB).' : 'Failed to parse .ics file.')
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
            className="linear-calendar__action-btn linear-calendar__action-btn--icon-only"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            className="linear-calendar__action-btn linear-calendar__action-btn--icon-only"
            onClick={openHelp}
            aria-label="Help"
            title="Help"
          >
            ?
          </button>

          <button
            className="linear-calendar__action-btn"
            onClick={handleExport}
            title="Export events as .ics"
          >
            <DownloadIcon /> <span className="linear-calendar__action-btn-label">Export</span>
          </button>

          <button
            className="linear-calendar__action-btn"
            onClick={() => { setImportError(null); importInputRef.current?.click() }}
            title="Import events from .ics"
          >
            <UploadIcon /> <span className="linear-calendar__action-btn-label">Import</span>
          </button>
          {importError && (
            <span className="linear-calendar__action-btn--danger" role="alert">
              {importError}
            </span>
          )}

          <button
            className="linear-calendar__action-btn linear-calendar__action-btn--danger"
            onClick={() => setShowClearConfirm(true)}
            title="Clear all events and tags"
          >
            <TrashIcon /> <span className="linear-calendar__action-btn-label">Clear</span>
          </button>

          <button
            className="linear-calendar__action-btn"
            onClick={() => window.print()}
            title="Print calendar"
          >
            <PrintIcon /> <span className="linear-calendar__action-btn-label">Print</span>
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
                          setTooltip(null)
                          setModalState({ mode: 'edit', event: ev })
                        }}
                        onMouseEnter={(e) => setTooltip({ event: ev, x: e.clientX, y: e.clientY })}
                        onMouseMove={(e) => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                        onMouseLeave={() => setTooltip(null)}
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
                <DownloadIcon /> Export first
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

      {/* ── Delete tag confirmation dialog ──────────────────────────────────── */}
      {deleteTagConfirm && (() => {
        const affected = events.filter(ev => ev.tagId === deleteTagConfirm)
        const tag = tagsById[deleteTagConfirm]
        return (
          <div className="linear-calendar__overlay" onClick={() => setDeleteTagConfirm(null)}>
            <div
              className="linear-calendar__confirm-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Delete tag confirmation"
              onClick={e => e.stopPropagation()}
            >
              <h2>Delete tag{tag ? ` "${tag.name}"` : ''}?</h2>
              <p>
                <strong>{affected.length} event{affected.length !== 1 ? 's' : ''}</strong>{' '}
                use this tag. The tag will be removed from{' '}
                {affected.length === 1 ? 'that event' : 'those events'} and deleted.
              </p>
              <div className="linear-calendar__confirm-actions">
                <div className="linear-calendar__confirm-actions-right">
                  <button className="linear-calendar__action-btn" onClick={() => setDeleteTagConfirm(null)}>
                    Cancel
                  </button>
                  <button
                    className="linear-calendar__action-btn linear-calendar__action-btn--danger"
                    onClick={() => confirmDeleteTag(deleteTagConfirm)}
                  >
                    Delete tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Event tooltip ───────────────────────────────────────────────────── */}
      {tooltip && !modalState && (
        <div
          className="linear-calendar__event-tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          <span className="linear-calendar__event-tooltip-title">{tooltip.event.title}</span>
          <span className="linear-calendar__event-tooltip-dates">
            {formatDateRange(tooltip.event.startDate, tooltip.event.endDate)}
          </span>
          {tooltip.event.tagId && tagsById[tooltip.event.tagId] && (
            <span className="linear-calendar__event-tooltip-tag">
              <span
                className="linear-calendar__event-tooltip-tag-dot"
                style={{ background: tagsById[tooltip.event.tagId].color }}
              />
              {tagsById[tooltip.event.tagId].name}
            </span>
          )}
        </div>
      )}

      {/* ── Help / welcome modal ────────────────────────────────────────────── */}
      {showHelp && <HelpModal onClose={closeHelp} />}

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
