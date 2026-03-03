import { Fragment, useMemo, useState, useRef } from 'react'
import {
  buildMonthRow,
  getMonthName,
  DAY_NAMES,
  GRID_COLS,
  isToday,
  isWeekendColumn,
  toDateKey,
  getEventsForMonth,
  eventsToIcs,
  icsToEvents,
} from '../utils/calendarUtils.js'
import { useEvents } from '../hooks/useEvents.js'
import EventModal from './EventModal.jsx'
import './AnnualCalendar.css'

// Stable module-level arrays — built once, not on every render
const MONTH_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const COL_INDICES = Array.from({ length: GRID_COLS }, (_, i) => i)

export default function AnnualCalendar({ year, onChangeYear, theme, onToggleTheme }) {
  const { events, addEvent, updateEvent, deleteEvent, replaceAll } = useEvents()
  const [modalState, setModalState] = useState(null)
  // null = closed
  // { mode: 'create', initialDate: 'YYYY-MM-DD' }
  // { mode: 'edit', event: {...} }

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
        <button
          className="annual-calendar__back-btn"
          onClick={onChangeYear}
          aria-label="Change year"
        >
          ← Change Year
        </button>

        <h1 className="annual-calendar__year-title">{year}</h1>

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
            title="Export events as JSON"
          >
            ↓ Export
          </button>

          <button
            className="annual-calendar__action-btn"
            onClick={() => importInputRef.current?.click()}
            title="Import events from JSON"
          >
            ↑ Import
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

      {/* ── Grid wrapper (handles fallback scroll on narrow viewports) ──────── */}
      <div className="annual-calendar__grid-wrapper">
        <div className="annual-calendar__grid">

          {/* ── Column-header row: S M T W T F S repeating ─────────────────── */}
          <div className="annual-calendar__row">
            {/* Top-left corner cell (above the month label column) */}
            <div className="annual-calendar__corner-cell" />

            {COL_INDICES.map((colIndex) => (
              <div
                key={colIndex}
                className={[
                  'annual-calendar__col-header',
                  isWeekendColumn(colIndex)
                    ? 'annual-calendar__col-header--weekend'
                    : '',
                ].filter(Boolean).join(' ')}
              >
                {DAY_NAMES[colIndex % 7]}
              </div>
            ))}
          </div>

          {/* ── One pair of rows per month ────────────────────────────────── */}
          {monthRows.map(({ monthIndex, name, cells }) => {
            const monthEvents = getEventsForMonth(events, year, monthIndex)

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
                        {today
                          ? <span className="annual-calendar__today-dot">{day}</span>
                          : (!empty ? day : null)
                        }
                      </div>
                    )
                  })}
                </div>

                {/* Events row */}
                <div className="annual-calendar__row">
                  <div className="annual-calendar__events-spacer" />
                  <div className="annual-calendar__events-container">
                    {monthEvents.map(ev => (
                      <div
                        key={ev.id}
                        className="annual-calendar__event-bar"
                        style={{
                          gridColumn: `${ev.startCol + 1} / ${ev.endCol + 2}`,
                          backgroundColor: ev.color,
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

      {/* ── Event modal ─────────────────────────────────────────────────────── */}
      {modalState && (
        <EventModal
          event={modalState.mode === 'edit' ? modalState.event : null}
          initialDate={modalState.mode === 'create' ? modalState.initialDate : null}
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
