// ─── Constants ────────────────────────────────────────────────────────────────

export const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Two-letter day abbreviations, index 0 = Sunday … 6 = Saturday */
export const DAY_ABBRS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
]

export const DEFAULT_EVENT_COLOR = '#3b82f6'

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
/**
 * Serialises an events array to iCalendar (.ics) format string.
 * All events are treated as all-day events (VALUE=DATE).
 * DTEND is exclusive per RFC 5545 (endDate + 1 day).
 * @param {Array} events - array of { id, title, startDate, endDate, color }
 * @returns {string}
 */
// Format a local Date as "YYYYMMDD" without timezone conversion
function fmtIcsDate(d) {
  return (
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0')
  )
}

// Format a local Date as "YYYY-MM-DD" without timezone conversion
function fmtIsoDate(d) {
  return (
    d.getFullYear() +
    '-' + String(d.getMonth() + 1).padStart(2, '0') +
    '-' + String(d.getDate()).padStart(2, '0')
  )
}

export function eventsToIcs(events, tagsById = {}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Linear Calendar//EN',
    'CALSCALE:GREGORIAN',
  ]
  for (const ev of events) {
    const dtStartStr = ev.startDate.replace(/-/g, '')
    // DTEND is exclusive: endDate + 1 day (use local date arithmetic, not UTC)
    const dtEnd = new Date(ev.endDate + 'T00:00:00')
    dtEnd.setDate(dtEnd.getDate() + 1)
    const tag = ev.tagId ? tagsById[ev.tagId] : null
    const color = tag ? tag.color : DEFAULT_EVENT_COLOR
    lines.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}@linearcalendar`,
      `SUMMARY:${ev.title}`,
      `DTSTART;VALUE=DATE:${dtStartStr}`,
      `DTEND;VALUE=DATE:${fmtIcsDate(dtEnd)}`,
      `X-APPLE-CALENDAR-COLOR:${color}`,
    )
    if (tag) {
      lines.push(
        `X-LC-TAG-ID:${tag.id}`,
        `X-LC-TAG-NAME:${tag.name}`,
        `X-LC-TAG-COLOR:${tag.color}`,
      )
    }
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

/**
 * Parses an iCalendar (.ics) text string into events and tags.
 * Handles all-day events (VALUE=DATE). DTEND is exclusive per RFC 5545.
 * @param {string} text - raw .ics file content
 * @returns {{ events: Array, tags: Array }} events with tagId refs and reconstructed tags
 */
// Strip control characters (newlines, carriage returns, etc.) to prevent ICS injection on re-export
const sanitizeText = (s) => s.replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500)
// Validate hex color; reject anything else to prevent CSS/ICS injection
const sanitizeColor = (s) => /^#[0-9a-fA-F]{6}$/.test(s) ? s : '#6b7280'

export function icsToEvents(text) {
  const events = []
  const tagsMap = {} // keyed by tag id to deduplicate
  const blocks = text.split('BEGIN:VEVENT')
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i]
    const get = (key) => {
      const m = block.match(new RegExp(`^${key}[^:]*:(.+)`, 'm'))
      return m ? m[1].trim() : ''
    }
    const title = sanitizeText(get('SUMMARY'))
    const dtStart = get('DTSTART')
    const dtEnd = get('DTEND')
    if (!title || !dtStart || !dtEnd) continue

    // Parse YYYYMMDD → YYYY-MM-DD string
    const parseDate = (s) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
    const startDate = parseDate(dtStart)

    // DTEND is exclusive → subtract 1 day for inclusive endDate (local arithmetic)
    const endRaw = new Date(parseDate(dtEnd) + 'T00:00:00')
    endRaw.setDate(endRaw.getDate() - 1)
    const endDate = fmtIsoDate(endRaw)

    const uid = get('UID').replace('@linearcalendar', '')
    const id = uid || (Date.now().toString(36) + Math.random().toString(36).slice(2))

    const tagId = get('X-LC-TAG-ID')
    const tagName = sanitizeText(get('X-LC-TAG-NAME'))
    const tagColor = sanitizeColor(get('X-LC-TAG-COLOR'))
    if (tagId && tagName && !tagsMap[tagId]) {
      tagsMap[tagId] = { id: tagId, name: tagName, color: tagColor }
    }

    events.push({ id, title, startDate, endDate, tagId: tagId || null })
  }
  return { events, tags: Object.values(tagsMap) }
}

export function getEventsForMonth(events, year, monthIndex) {
  const monthStart = new Date(year, monthIndex, 1)
  const monthEnd = new Date(year, monthIndex + 1, 0)
  const startCol = getMonthStartDay(year, monthIndex)

  const positioned = events
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

  // Greedy row packing: assign each event the lowest row with no column overlap.
  // rowSlots[r] = array of [startCol, endCol] ranges already placed in row r.
  const rowSlots = []
  return positioned
    .sort((a, b) => a.startCol - b.startCol)
    .map(ev => {
      let row = 0
      while (true) {
        if (!rowSlots[row]) rowSlots[row] = []
        const overlaps = rowSlots[row].some(
          ([s, e]) => ev.startCol <= e && ev.endCol >= s
        )
        if (!overlaps) {
          rowSlots[row].push([ev.startCol, ev.endCol])
          return { ...ev, row: row + 1 } // 1-based for CSS grid-row
        }
        row++
      }
    })
}
