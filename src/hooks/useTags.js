import { useState } from 'react'

const STORAGE_KEY = 'linearcalendar-tags'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function parseTag(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const { id, name, color } = raw
  if (typeof id !== 'string' || !id) return null
  if (typeof name !== 'string' || !name) return null
  if (typeof color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(color)) return null
  return { id, name, color }
}

export function useTags() {
  const [tags, setTags] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      return Array.isArray(parsed) ? parsed.map(parseTag).filter(Boolean) : []
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
    setTags(prev => _persist(prev.map(t => (t.id === id ? { ...t, ...changes } : t))))
  }

  function deleteTag(id) {
    setTags(prev => _persist(prev.filter(t => t.id !== id)))
  }

  function clearAll() {
    setTags(_persist([]))
  }

  function replaceAll(newTags) {
    setTags(_persist(newTags))
  }

  return { tags, addTag, updateTag, deleteTag, clearAll, replaceAll }
}
