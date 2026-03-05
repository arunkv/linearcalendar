import { useState } from 'react'

const STORAGE_KEY = 'linearcalendar-tags'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useTags() {
  const [tags, setTags] = useState(() => {
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

  /** Creates a new tag and returns the created tag object. */
  function addTag({ name, color }) {
    const tag = { id: genId(), name, color }
    setTags(prev => _persist([...prev, tag]))
    return tag
  }

  function updateTag(id, changes) {
    setTags(prev =>
      _persist(prev.map(t => (t.id === id ? { ...t, ...changes } : t)))
    )
  }

  function deleteTag(id) {
    setTags(prev => _persist(prev.filter(t => t.id !== id)))
  }

  function clearAll() {
    setTags(_persist([]))
  }

  return { tags, addTag, updateTag, deleteTag, clearAll }
}
