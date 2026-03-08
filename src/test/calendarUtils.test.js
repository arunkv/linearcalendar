import { describe, it, expect } from 'vitest'
import {
  DAY_NAMES,
  DAY_ABBRS,
  _DEFAULT_EVENT_COLOR,
  GRID_COLS,
  getDaysInMonth,
  getMonthStartDay,
  isToday,
  isWeekendColumn,
  getMonthName,
  toDateKey,
  buildMonthRow,
  eventsToIcs,
  icsToEvents,
  getEventsForMonth,
} from '../utils/calendarUtils.js'

describe('calendarUtils', () => {
  describe('constants', () => {
    it('should have correct day names', () => {
      expect(DAY_NAMES).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S'])
    })

    it('should have correct day abbreviations', () => {
      expect(DAY_ABBRS).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
    })

    it('should have correct grid columns constant', () => {
      expect(GRID_COLS).toBe(37)
    })
  })

  describe('getDaysInMonth', () => {
    it('should return 31 days for January', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31)
    })

    it('should return 28 days for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28)
    })

    it('should return 29 days for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29)
    })

    it('should return 30 days for April', () => {
      expect(getDaysInMonth(2024, 3)).toBe(30)
    })

    it('should return 31 days for December', () => {
      expect(getDaysInMonth(2024, 11)).toBe(31)
    })
  })

  describe('getMonthStartDay', () => {
    it('should return correct start day for January 2024 (Monday)', () => {
      expect(getMonthStartDay(2024, 0)).toBe(1) // Monday
    })

    it('should return correct start day for February 2024 (Thursday)', () => {
      expect(getMonthStartDay(2024, 1)).toBe(4) // Thursday
    })

    it('should return correct start day for March 2024 (Friday)', () => {
      expect(getMonthStartDay(2024, 2)).toBe(5) // Friday
    })
  })

  describe('isToday', () => {
    it('should return true for today', () => {
      const now = new Date()
      expect(isToday(now.getFullYear(), now.getMonth(), now.getDate())).toBe(true)
    })

    it('should return false for a known past date', () => {
      expect(isToday(2000, 0, 1)).toBe(false)
    })
  })

  describe('isWeekendColumn', () => {
    it('should return true for Sunday (column 0)', () => {
      expect(isWeekendColumn(0)).toBe(true)
    })

    it('should return true for Saturday (column 6)', () => {
      expect(isWeekendColumn(6)).toBe(true)
    })

    it('should return false for Monday (column 1)', () => {
      expect(isWeekendColumn(1)).toBe(false)
    })

    it('should return false for Friday (column 5)', () => {
      expect(isWeekendColumn(5)).toBe(false)
    })

    it('should correctly identify weekend in second week', () => {
      expect(isWeekendColumn(7)).toBe(true) // Sunday of second week
      expect(isWeekendColumn(13)).toBe(true) // Saturday of second week
    })
  })

  describe('getMonthName', () => {
    it.each([
      [0, 'January'],
      [1, 'February'],
      [2, 'March'],
      [3, 'April'],
      [4, 'May'],
      [5, 'June'],
      [6, 'July'],
      [7, 'August'],
      [8, 'September'],
      [9, 'October'],
      [10, 'November'],
      [11, 'December'],
    ])('getMonthName(%i) → %s', (month, name) => {
      expect(getMonthName(month)).toBe(name)
    })
  })

  describe('toDateKey', () => {
    it('should format date correctly for single digit month and day', () => {
      expect(toDateKey(2024, 0, 5)).toBe('2024-01-05')
    })

    it('should format date correctly for double digit month and day', () => {
      expect(toDateKey(2024, 11, 25)).toBe('2024-12-25')
    })

    it('should format date correctly for mixed digits', () => {
      expect(toDateKey(2024, 9, 3)).toBe('2024-10-03')
    })
  })

  describe('buildMonthRow', () => {
    it('should return array of correct length', () => {
      const row = buildMonthRow(2024, 0)
      expect(row).toHaveLength(GRID_COLS)
    })

    it('should place January 1, 2024 in correct column (Monday = col 1)', () => {
      const row = buildMonthRow(2024, 0)
      expect(row[1]).toBe(1)
      expect(row[2]).toBe(2)
      expect(row[31]).toBe(31)
    })

    it('should have null for empty cells before month starts', () => {
      const row = buildMonthRow(2024, 0)
      expect(row[0]).toBeNull() // Sunday before Jan 1
    })

    it('should have null for empty cells after month ends', () => {
      const row = buildMonthRow(2024, 0)
      expect(row[32]).toBeNull()
      expect(row[36]).toBeNull()
    })

    it('should correctly place February 2024 (starts Thursday)', () => {
      const row = buildMonthRow(2024, 1)
      expect(row[0]).toBeNull() // Sun
      expect(row[1]).toBeNull() // Mon
      expect(row[2]).toBeNull() // Tue
      expect(row[3]).toBeNull() // Wed
      expect(row[4]).toBe(1) // Thu - Feb 1
      expect(row[5]).toBe(2) // Fri
    })

    it('should correctly handle leap year February with 29 days', () => {
      const row = buildMonthRow(2024, 1)
      expect(row[4 + 28]).toBe(29) // Feb 29
    })
  })

  describe('eventsToIcs', () => {
    it('should generate valid ICS format with header', () => {
      const events = []
      const ics = eventsToIcs(events)
      expect(ics).toContain('BEGIN:VCALENDAR')
      expect(ics).toContain('VERSION:2.0')
      expect(ics).toContain('PRODID:-//Linear Calendar//EN')
      expect(ics).toContain('END:VCALENDAR')
    })

    it('should include event data correctly', () => {
      const events = [
        {
          id: 'test-123',
          title: 'Test Event',
          startDate: '2024-03-15',
          endDate: '2024-03-15',
          tagId: 'tag-1',
        },
      ]
      const tagsById = { 'tag-1': { id: 'tag-1', name: 'Work', color: '#ff0000' } }
      const ics = eventsToIcs(events, tagsById)
      expect(ics).toContain('BEGIN:VEVENT')
      expect(ics).toContain('UID:test-123@linearcalendar')
      expect(ics).toContain('SUMMARY:Test Event')
      expect(ics).toContain('DTSTART;VALUE=DATE:20240315')
      expect(ics).toContain('DTEND;VALUE=DATE:20240316') // Exclusive end date
      expect(ics).toContain('X-APPLE-CALENDAR-COLOR:#ff0000')
      expect(ics).toContain('X-LC-TAG-ID:tag-1')
      expect(ics).toContain('X-LC-TAG-NAME:Work')
      expect(ics).toContain('X-LC-TAG-COLOR:#ff0000')
      expect(ics).toContain('END:VEVENT')
    })

    it('should handle multi-day events with correct end date', () => {
      const events = [
        {
          id: 'multi-day',
          title: 'Conference',
          startDate: '2024-03-15',
          endDate: '2024-03-17',
          color: '#3b82f6',
        },
      ]
      const ics = eventsToIcs(events)
      expect(ics).toContain('DTSTART;VALUE=DATE:20240315')
      expect(ics).toContain('DTEND;VALUE=DATE:20240318') // Day after end date
    })

    it('should handle multiple events', () => {
      const events = [
        {
          id: '1',
          title: 'Event 1',
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          color: '#ff0000',
        },
        {
          id: '2',
          title: 'Event 2',
          startDate: '2024-01-02',
          endDate: '2024-01-02',
          color: '#00ff00',
        },
      ]
      const ics = eventsToIcs(events)
      expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2)
      expect(ics.match(/END:VEVENT/g)).toHaveLength(2)
    })
  })

  describe('icsToEvents', () => {
    it('should parse single event from ICS', () => {
      const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:test-123@linearcalendar
SUMMARY:Test Event
DTSTART;VALUE=DATE:20240315
DTEND;VALUE=DATE:20240316
X-LC-TAG-ID:tag-1
X-LC-TAG-NAME:Work
X-LC-TAG-COLOR:#ff0000
END:VEVENT
END:VCALENDAR`

      const { events, tags } = icsToEvents(ics)
      expect(events).toHaveLength(1)
      expect(events[0]).toMatchObject({
        title: 'Test Event',
        startDate: '2024-03-15',
        endDate: '2024-03-15',
        tagId: 'tag-1',
      })
      expect(tags).toHaveLength(1)
      expect(tags[0]).toEqual({ id: 'tag-1', name: 'Work', color: '#ff0000' })
    })

    it('should parse multi-day event with exclusive end date', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:multi@linearcalendar
SUMMARY:Conference
DTSTART;VALUE=DATE:20240315
DTEND;VALUE=DATE:20240318
END:VEVENT
END:VCALENDAR`

      const { events } = icsToEvents(ics)
      expect(events[0].startDate).toBe('2024-03-15')
      expect(events[0].endDate).toBe('2024-03-17') // Converted to inclusive
    })

    it('should parse multiple events', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:1@linearcalendar
SUMMARY:Event 1
DTSTART;VALUE=DATE:20240101
DTEND;VALUE=DATE:20240102
END:VEVENT
BEGIN:VEVENT
UID:2@linearcalendar
SUMMARY:Event 2
DTSTART;VALUE=DATE:20240102
DTEND;VALUE=DATE:20240103
END:VEVENT
END:VCALENDAR`

      const { events } = icsToEvents(ics)
      expect(events).toHaveLength(2)
      expect(events[0].title).toBe('Event 1')
      expect(events[1].title).toBe('Event 2')
    })

    it('should set tagId to null when no tag properties present', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:test@linearcalendar
SUMMARY:No Tag Event
DTSTART;VALUE=DATE:20240101
DTEND;VALUE=DATE:20240102
END:VEVENT
END:VCALENDAR`

      const { events, tags } = icsToEvents(ics)
      expect(events[0].tagId).toBeNull()
      expect(tags).toHaveLength(0)
    })

    it('should deduplicate tags shared across multiple events', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:1@linearcalendar
SUMMARY:Event 1
DTSTART;VALUE=DATE:20240101
DTEND;VALUE=DATE:20240102
X-LC-TAG-ID:tag-1
X-LC-TAG-NAME:Work
X-LC-TAG-COLOR:#ff0000
END:VEVENT
BEGIN:VEVENT
UID:2@linearcalendar
SUMMARY:Event 2
DTSTART;VALUE=DATE:20240103
DTEND;VALUE=DATE:20240104
X-LC-TAG-ID:tag-1
X-LC-TAG-NAME:Work
X-LC-TAG-COLOR:#ff0000
END:VEVENT
END:VCALENDAR`

      const { events, tags } = icsToEvents(ics)
      expect(events).toHaveLength(2)
      expect(tags).toHaveLength(1)
    })

    it('should generate id if UID is not present', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:No UID Event
DTSTART;VALUE=DATE:20240101
DTEND;VALUE=DATE:20240102
END:VEVENT
END:VCALENDAR`

      const { events } = icsToEvents(ics)
      expect(events[0].id).toBeDefined()
      expect(typeof events[0].id).toBe('string')
    })

    it('should skip events without required fields', () => {
      const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:test@linearcalendar
SUMMARY:Missing Dates
END:VEVENT
END:VCALENDAR`

      const { events } = icsToEvents(ics)
      expect(events).toHaveLength(0)
    })
  })

  describe('getEventsForMonth', () => {
    it('should return empty array when no events', () => {
      const result = getEventsForMonth([], 2024, 0)
      expect(result).toEqual([])
    })

    it('should include event that falls within month', () => {
      const events = [
        {
          id: '1',
          title: 'January Event',
          startDate: '2024-01-15',
          endDate: '2024-01-15',
        },
      ]
      const result = getEventsForMonth(events, 2024, 0)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('January Event')
    })

    it('should include event that spans multiple months', () => {
      const events = [
        {
          id: '1',
          title: 'Multi-month',
          startDate: '2023-12-15',
          endDate: '2024-02-15',
        },
      ]
      const result = getEventsForMonth(events, 2024, 0) // January
      expect(result).toHaveLength(1)
    })

    it('should exclude event outside month', () => {
      const events = [
        {
          id: '1',
          title: 'February Event',
          startDate: '2024-02-15',
          endDate: '2024-02-15',
        },
      ]
      const result = getEventsForMonth(events, 2024, 0) // January
      expect(result).toHaveLength(0)
    })

    it('should calculate correct column positions', () => {
      // January 2024 starts on Monday (col 1)
      const events = [
        {
          id: '1',
          title: 'Jan 5th',
          startDate: '2024-01-05',
          endDate: '2024-01-05',
        },
      ]
      const result = getEventsForMonth(events, 2024, 0)
      expect(result[0].startCol).toBe(5) // Mon=1 + 5th - 1 = 5
      expect(result[0].endCol).toBe(5)
      expect(result[0].row).toBe(1)
    })

    it('should clamp events that extend beyond month boundaries', () => {
      const events = [
        {
          id: '1',
          title: 'Spillover',
          startDate: '2023-12-28',
          endDate: '2024-01-05',
        },
      ]
      const result = getEventsForMonth(events, 2024, 0)
      // Should clamp to Jan 1-5, 2024
      expect(result[0].startCol).toBe(1) // Jan 1st
      expect(result[0].endCol).toBe(5) // Jan 5th
    })

    it('should place event on the 1st at the month start column (UTC-safe)', () => {
      // new Date('2024-01-01') is parsed as UTC midnight; in UTC- timezones
      // .getDate() would return 31 (Dec), shifting the event out of January.
      // parseDateLocal ensures the date string is always read as local midnight.
      const events = [
        { id: '1', title: 'New Year', startDate: '2024-01-01', endDate: '2024-01-01' },
      ]
      const result = getEventsForMonth(events, 2024, 0)
      expect(result).toHaveLength(1)
      expect(result[0].startCol).toBe(1) // Jan 1, 2024 = Monday = col 1
      expect(result[0].endCol).toBe(1)
    })

    it('should place event on the last day of month at correct column (UTC-safe)', () => {
      // new Date('2024-01-31') in UTC is Jan 31; in UTC- zones getDate() could
      // return 30, placing the event one column too early.
      const events = [
        { id: '1', title: 'Last Day', startDate: '2024-01-31', endDate: '2024-01-31' },
      ]
      const result = getEventsForMonth(events, 2024, 0)
      expect(result).toHaveLength(1)
      expect(result[0].startCol).toBe(31) // col 1 (Mon) + 31 - 1 = 31
      expect(result[0].endCol).toBe(31)
    })

    it('should assign rows without overlap', () => {
      const events = [
        { id: '1', title: 'Event 1', startDate: '2024-01-01', endDate: '2024-01-05' },
        { id: '2', title: 'Event 2', startDate: '2024-01-03', endDate: '2024-01-07' },
        { id: '3', title: 'Event 3', startDate: '2024-01-10', endDate: '2024-01-12' },
      ]
      const result = getEventsForMonth(events, 2024, 0)
      expect(result).toHaveLength(3)
      // Events 1 and 2 overlap, should be in different rows
      expect(result[0].row).toBe(1)
      expect(result[1].row).toBe(2) // Overlaps with event 1
      expect(result[2].row).toBe(1) // No overlap with event 1 or 2
    })
  })
})
