/**
 * Utilities for converting between the app's internal event format
 * and the Google Calendar API event format.
 *
 * App format:  { id, title, startDate, endDate, tagId, source }
 *   - startDate/endDate: 'YYYY-MM-DD' strings, inclusive
 *
 * Google format (all-day events):
 *   - start.date: 'YYYY-MM-DD'
 *   - end.date:   'YYYY-MM-DD' (exclusive — the day after the last day)
 */

/**
 * Convert a Google Calendar API event to the app's event shape.
 * Returns null if the event is not an all-day event or is missing required fields.
 */
export function googleEventToLocal(googleEvent) {
  const startDate = googleEvent.start?.date
  const endDateExclusive = googleEvent.end?.date

  // Skip timed (non all-day) events and events missing required fields
  if (!startDate || !endDateExclusive || !googleEvent.summary) return null

  // Google's end date is exclusive; convert to inclusive by subtracting one day
  const endDate = subtractOneDay(endDateExclusive)

  return {
    id: `gcal-${googleEvent.id}`,
    title: googleEvent.summary,
    startDate,
    endDate,
    tagId: null,
    source: 'google',
  }
}

/**
 * Subtract one day from a 'YYYY-MM-DD' string.
 * Used to convert Google's exclusive end date to our inclusive end date.
 */
function subtractOneDay(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  date.setDate(date.getDate() - 1)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Build the Google Calendar API URL to fetch events for a given year.
 * Fetches from the primary calendar, filtered to the full year.
 */
export function buildCalendarEventsUrl(year) {
  const timeMin = encodeURIComponent(`${year}-01-01T00:00:00Z`)
  const timeMax = encodeURIComponent(`${year + 1}-01-01T00:00:00Z`)
  return (
    `https://www.googleapis.com/calendar/v3/calendars/primary/events` +
    `?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&maxResults=2500`
  )
}

/**
 * Build the Google OAuth 2.0 authorization URL.
 */
export function buildAuthUrl(clientId, redirectUri) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.readonly openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}
