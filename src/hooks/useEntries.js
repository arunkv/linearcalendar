import { useState } from 'react'

const STORAGE_KEY = 'annualcalendar-entries'

export function useEntries() {
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  })

  function setEntry(dateKey, text) {
    setEntries(prev => {
      const updated = { ...prev }
      if (text.trim()) {
        updated[dateKey] = text
      } else {
        delete updated[dateKey]
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function replaceAll(newEntries) {
    setEntries(newEntries)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries))
  }

  return { entries, setEntry, replaceAll }
}
