import { useState } from 'react'

const STORAGE_KEY = 'annualcalendar-events'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useEvents() {
  const [events, setEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
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
    setEvents(prev =>
      _persist(prev.map(ev => (ev.id === id ? { ...ev, ...changes } : ev)))
    )
  }

  function deleteEvent(id) {
    setEvents(prev => _persist(prev.filter(ev => ev.id !== id)))
  }

  function replaceAll(newEvents) {
    setEvents(_persist(newEvents))
  }

  return { events, addEvent, updateEvent, deleteEvent, replaceAll }
}
