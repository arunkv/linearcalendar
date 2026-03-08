import { useState, useEffect, useCallback } from 'react'
import {
  locales,
  localeNames,
  getActiveLocale,
  setActiveLocale as persistLocale,
} from '../locales/index.js'

/**
 * Hook for managing application locale.
 * Provides the current translation strings and a function to switch languages.
 *
 * @returns {{ t: object, locale: string, setLocale: Function, availableLocales: object }}
 */
export function useLocale() {
  const [locale, setLocaleState] = useState(getActiveLocale())

  // Get current translation strings
  const t = locales[locale] || locales.en

  // Set locale with persistence
  const setLocale = useCallback(newLocale => {
    if (locales[newLocale]) {
      persistLocale(newLocale)
      setLocaleState(newLocale)
      return true
    }
    return false
  }, [])

  // Listen for storage changes (for multi-tab support)
  useEffect(() => {
    const handleStorage = e => {
      if (e.key === 'linearcalendar-locale' && e.newValue && locales[e.newValue]) {
        setLocaleState(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return {
    t,
    locale,
    setLocale,
    availableLocales: localeNames,
  }
}

export { locales, localeNames }
