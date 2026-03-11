import { useState } from 'react'

const STORAGE_KEY = 'linearcalendar-events'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function parseEvent(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const { id, title, startDate, endDate, tagId, source } = raw
  if (typeof id !== 'string' || !id) return null
  if (typeof title !== 'string') return null
  if (typeof startDate !== 'string') return null
  if (typeof endDate !== 'string') return null
  return {
    id,
    title,
    startDate,
    endDate,
    tagId: typeof tagId === 'string' ? tagId : null,
    source: source === 'google' ? 'google' : 'local',
  }
}

export function useEvents() {
  const [events, setEvents] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      return Array.isArray(parsed) ? parsed.map(parseEvent).filter(Boolean) : []
    } catch {
      return []
    }
  })

  function _persist(updated) {
    // Only persist local events — Google events are fetched fresh each session
    const localOnly = updated.filter(ev => ev.source !== 'google')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localOnly))
    return updated
  }

  function addEvent({ title, startDate, endDate, tagId }) {
    const ev = { id: genId(), title, startDate, endDate, tagId, source: 'local' }
    setEvents(prev => _persist([...prev, ev]))
  }

  function updateEvent(id, changes) {
    setEvents(prev => _persist(prev.map(ev => (ev.id === id ? { ...ev, ...changes } : ev))))
  }

  function deleteEvent(id) {
    setEvents(prev => _persist(prev.filter(ev => ev.id !== id)))
  }

  function replaceAll(newEvents) {
    setEvents(_persist(newEvents))
  }

  /**
   * Merge Google Calendar events into the event list.
   * Replaces any previously synced Google events and appends fresh ones.
   * Local events are untouched.
   */
  function syncFromGoogle(googleEvents) {
    setEvents(prev => {
      const localEvents = prev.filter(ev => ev.source !== 'google')
      return _persist([...localEvents, ...googleEvents])
    })
  }

  return { events, addEvent, updateEvent, deleteEvent, replaceAll, syncFromGoogle }
}
