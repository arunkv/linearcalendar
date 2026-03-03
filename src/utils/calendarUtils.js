// ─── Constants ────────────────────────────────────────────────────────────────

export const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
]

// Total date-columns in the grid.
// Max offset (6) + max days in a month (31) = 37.
// A month starting on Saturday (col 6) with 31 days fills columns 6–36 (index 36).
export const GRID_COLS = 37

// ─── Pure utility functions ───────────────────────────────────────────────────

/**
 * Returns the number of days in the given month.
 * Correctly handles leap years via the JavaScript Date "day 0" trick.
 * @param {number} year
 * @param {number} monthIndex - 0 = January … 11 = December
 */
export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

/**
 * Returns the day-of-week (0=Sun … 6=Sat) that the 1st of the month falls on.
 * This is directly the starting column index in the 37-column date grid.
 * @param {number} year
 * @param {number} monthIndex
 */
export function getMonthStartDay(year, monthIndex) {
  return new Date(year, monthIndex, 1).getDay()
}

/**
 * Returns true if the given date is today's date.
 * @param {number} year
 * @param {number} monthIndex
 * @param {number} day - 1-based day of month
 */
export function isToday(year, monthIndex, day) {
  const now = new Date()
  return (
    now.getFullYear() === year &&
    now.getMonth() === monthIndex &&
    now.getDate() === day
  )
}

/**
 * Returns true if the column index corresponds to a weekend (Sun or Sat).
 * The pattern S M T W T F S repeats every 7 columns starting at index 0.
 * @param {number} colIndex - 0-based index among the 37 date columns
 */
export function isWeekendColumn(colIndex) {
  const dow = colIndex % 7
  return dow === 0 || dow === 6
}

/**
 * Returns the full English name for a month index.
 * @param {number} monthIndex - 0 = January … 11 = December
 */
export function getMonthName(monthIndex) {
  return MONTH_NAMES[monthIndex]
}

/**
 * Builds the row data for one month.
 * Returns an array of exactly GRID_COLS (37) entries:
 *   - null  → empty cell (before the 1st or after the last day)
 *   - number → the day of the month (1-based)
 *
 * Mathematical guarantee: startCol + daysInMonth - 1 ≤ 6 + 31 - 1 = 36,
 * which is always within the 37-element array.
 *
 * @param {number} year
 * @param {number} monthIndex
 * @returns {(number|null)[]}
 */
/**
 * Returns a date key string in "YYYY-MM-DD" format for use as a localStorage key.
 * @param {number} year
 * @param {number} monthIndex - 0 = January … 11 = December
 * @param {number} day - 1-based day of month
 */
export function toDateKey(year, monthIndex, day) {
  const m = String(monthIndex + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export function buildMonthRow(year, monthIndex) {
  const startCol = getMonthStartDay(year, monthIndex)
  const daysInMonth = getDaysInMonth(year, monthIndex)
  const cells = new Array(GRID_COLS).fill(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells[startCol + day - 1] = day
  }
  return cells
}

/**
 * Returns events that overlap with the given month, with column indices
 * clamped to the month's date range.
 * @param {Array} events - array of { id, title, startDate, endDate, color }
 * @param {number} year
 * @param {number} monthIndex - 0 = January … 11 = December
 */
export function getEventsForMonth(events, year, monthIndex) {
  const monthStart = new Date(year, monthIndex, 1)
  const monthEnd = new Date(year, monthIndex + 1, 0)
  const startCol = getMonthStartDay(year, monthIndex)

  return events
    .filter(ev => {
      const s = new Date(ev.startDate)
      const e = new Date(ev.endDate)
      return s <= monthEnd && e >= monthStart
    })
    .map(ev => {
      const s = new Date(ev.startDate)
      const e = new Date(ev.endDate)
      const clampedStart = s < monthStart ? monthStart : s
      const clampedEnd   = e > monthEnd   ? monthEnd   : e
      return {
        ...ev,
        startCol: startCol + clampedStart.getDate() - 1,
        endCol:   startCol + clampedEnd.getDate() - 1,
      }
    })
}
