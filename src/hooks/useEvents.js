import { useState } from 'react'

const STORAGE_KEY = 'linearcalendar-events'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function parseEvent(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const { id, title, startDate, endDate, tagId } = raw
  if (typeof id !== 'string' || !id) return null
  if (typeof title !== 'string') return null
  if (typeof startDate !== 'string') return null
  if (typeof endDate !== 'string') return null
  return { id, title, startDate, endDate, tagId: typeof tagId === 'string' ? tagId : null }
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  }

  function addEvent({ title, startDate, endDate, tagId }) {
    const ev = { id: genId(), title, startDate, endDate, tagId }
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

  return { events, addEvent, updateEvent, deleteEvent, replaceAll }
}
