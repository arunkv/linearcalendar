import { useState, useCallback } from 'react'
import { buildCalendarEventsUrl, googleEventToLocal } from '../utils/googleCalendarUtils.js'

/**
 * Fetches events from the user's primary Google Calendar for a given year.
 * Returns them in the app's internal event format, with source: 'google'.
 *
 * Usage:
 *   const { fetchGoogleEvents, isFetching, fetchError } = useGoogleCalendar(accessToken)
 *   const googleEvents = await fetchGoogleEvents(year)
 */
export function useGoogleCalendar(accessToken) {
  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const fetchGoogleEvents = useCallback(
    async year => {
      if (!accessToken) return []
      setIsFetching(true)
      setFetchError(null)

      try {
        const url = buildCalendarEventsUrl(year)
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error('Google session expired — please sign in again')
          throw new Error(`Failed to fetch calendar events (${res.status})`)
        }

        const data = await res.json()
        const items = data.items ?? []
        return items.map(googleEventToLocal).filter(Boolean)
      } catch (err) {
        setFetchError(err.message)
        return []
      } finally {
        setIsFetching(false)
      }
    },
    [accessToken]
  )

  return { fetchGoogleEvents, isFetching, fetchError }
}
