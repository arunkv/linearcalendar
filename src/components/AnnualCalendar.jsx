import { useMemo } from 'react'
import {
  buildMonthRow,
  getMonthName,
  DAY_NAMES,
  GRID_COLS,
  isToday,
  isWeekendColumn,
} from '../utils/calendarUtils.js'
import './AnnualCalendar.css'

// Stable module-level arrays — built once, not on every render
const MONTH_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const COL_INDICES = Array.from({ length: GRID_COLS }, (_, i) => i)

export default function AnnualCalendar({ year, onChangeYear }) {
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
        {/* Spacer balances the flex layout so the year title is centred */}
        <div className="annual-calendar__header-spacer" aria-hidden="true" />
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

                const cellClass = [
                  'annual-calendar__cell',
                  empty   ? 'annual-calendar__cell--empty'   : '',
                  weekend ? 'annual-calendar__cell--weekend' : '',
                  today   ? 'annual-calendar__cell--today'   : '',
                ].filter(Boolean).join(' ')

                return (
                  <div key={colIndex} className={cellClass}>
                    {today
                      ? <span className="annual-calendar__today-dot">{day}</span>
                      : (!empty ? day : null)
                    }
                  </div>
                )
              })}
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
