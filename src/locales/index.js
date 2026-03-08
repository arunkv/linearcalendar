/**
 * Linear Calendar locales
 *
 * Available languages:
 *   - en: English (default)
 *   - zh: Mandarin Chinese (简体中文)
 *   - es: Spanish (Español)
 *   - hi: Hindi (हिन्दी)
 *   - fr: French (Français)
 *
 * To switch language, either:
 *   1. Import the desired locale directly: `import t from './zh.js'`
 *   2. Use the locale switcher utility below
 */

import en from './en.js'
import zh from './zh.js'
import es from './es.js'
import hi from './hi.js'
import fr from './fr.js'

export const locales = {
  en,
  zh,
  es,
  hi,
  fr,
}

export const localeNames = {
  en: 'English',
  zh: '简体中文',
  es: 'Español',
  hi: 'हिन्दी',
  fr: 'Français',
}

/**
 * Get the active locale based on browser language or localStorage preference.
 * Falls back to English if the detected language is not supported.
 */
export function getActiveLocale() {
  // Check localStorage first
  const stored = localStorage.getItem('linearcalendar-locale')
  if (stored && locales[stored]) {
    return stored
  }

  // Check browser language
  const browserLang = navigator.language?.slice(0, 2)
  if (browserLang && locales[browserLang]) {
    return browserLang
  }

  return 'en'
}

/**
 * Set the active locale and persist to localStorage.
 */
export function setActiveLocale(locale) {
  if (locales[locale]) {
    localStorage.setItem('linearcalendar-locale', locale)
    return true
  }
  return false
}

// Default export for backward compatibility (English)
export default en

// Re-export individual locales for direct imports
export { default as en } from './en.js'
export { default as zh } from './zh.js'
export { default as es } from './es.js'
export { default as hi } from './hi.js'
export { default as fr } from './fr.js'
