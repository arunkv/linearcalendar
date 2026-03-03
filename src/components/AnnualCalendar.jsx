import { useMemo, useState, useRef } from 'react'
import {
  buildMonthRow,
  getMonthName,
  DAY_NAMES,
  GRID_COLS,
  isToday,
  isWeekendColumn,
  toDateKey,
} from '../utils/calendarUtils.js'
import { useEntries } from '../hooks/useEntries.js'
import EntryModal from './EntryModal.jsx'
import './AnnualCalendar.css'

// Stable module-level arrays — built once, not on every render
const MONTH_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const COL_INDICES = Array.from({ length: GRID_COLS }, (_, i) => i)

export default function AnnualCalendar({ year, onChangeYear, theme, onToggleTheme }) {
  const { entries, setEntry, replaceAll } = useEntries()
  const [modalDateKey, setModalDateKey] = useState(null)
  const importInputRef = useRef(null)

  // Pre-compute all 12 month rows; recomputes only when `year` changes
  const monthRows = useMemo(
    () =>
      MONTH_INDICES.map((monthIndex) => ({
        monthIndex,
        name: getMonthName(monthIndex),
        cells: buildMonthRow(year, monthIndex),
      })),
    [year]
  )

  // ── Export entries as JSON file download ──────────────────────────────────
  function handleExport() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'annual-calendar-entries.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Import entries from a JSON file ──────────────────────────────────────
  function handleImportChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          replaceAll(parsed)
        }
      } catch {
        // ignore invalid JSON
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
            title="Export entries as JSON"
          >
            ↓ Export
          </button>

          <button
            className="annual-calendar__action-btn"
            onClick={() => importInputRef.current?.click()}
            title="Import entries from JSON"
          >
            ↑ Import
          </button>

          {/* Hidden file input for import */}
          <input
            ref={importInputRef}
            type="file"
            accept=".json"
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

          {/* ── One row per month ────────────────────────────────────────────── */}
          {monthRows.map(({ monthIndex, name, cells }) => (
            <div key={monthIndex} className="annual-calendar__row">
              {/* Month name label */}
              <div className="annual-calendar__month-label">{name}</div>

              {/* 37 date cells */}
              {cells.map((day, colIndex) => {
                const empty = day === null
                const weekend = isWeekendColumn(colIndex)
                const today = !empty && isToday(year, monthIndex, day)
                const dateKey = !empty ? toDateKey(year, monthIndex, day) : null
                const hasEntry = dateKey ? Boolean(entries[dateKey]) : false

                const cellClass = [
                  'annual-calendar__cell',
                  empty       ? 'annual-calendar__cell--empty'     : 'annual-calendar__cell--clickable',
                  weekend     ? 'annual-calendar__cell--weekend'    : '',
                  today       ? 'annual-calendar__cell--today'      : '',
                ].filter(Boolean).join(' ')

                return (
                  <div
                    key={colIndex}
                    className={cellClass}
                    onClick={empty ? undefined : () => setModalDateKey(dateKey)}
                  >
                    {today
                      ? <span className="annual-calendar__today-dot">{day}</span>
                      : (!empty ? day : null)
                    }
                    {hasEntry && <span className="annual-calendar__entry-dot" aria-hidden="true" />}
                  </div>
                )
              })}
            </div>
          ))}

        </div>
      </div>

      {/* ── Entry modal ─────────────────────────────────────────────────────── */}
      {modalDateKey && (
        <EntryModal
          dateKey={modalDateKey}
          initialText={entries[modalDateKey] || ''}
          onSave={(text) => setEntry(modalDateKey, text)}
          onClose={() => setModalDateKey(null)}
        />
      )}
    </div>
  )
}
