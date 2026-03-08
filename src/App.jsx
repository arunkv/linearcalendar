import { useState, useEffect } from 'react'
import LinearCalendar from './components/LinearCalendar.jsx'
import { useLocale } from './hooks/useLocale.js'

/** Read ?year=YYYY from the current URL. Returns the integer or null. */
function getYearFromUrl() {
  const y = parseInt(new URLSearchParams(window.location.search).get('year'), 10)
  return y >= 1 && y <= 9999 ? y : null
}

export default function App() {
  const currentYear = new Date().getFullYear()
  // Initialise from URL (bookmarked ?year=YYYY), falling back to the current year
  const [selectedYear, setSelectedYear] = useState(() => getYearFromUrl() ?? currentYear)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  // Locale management
  const { t, locale, setLocale, availableLocales } = useLocale()

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  // Keep the browser tab title in sync with the selected year
  useEffect(() => {
    document.title = t.pageTitle(selectedYear)
  }, [selectedYear, t])

  // Keep URL in sync with year state and handle browser back/forward
  function selectYear(year) {
    const url = `${window.location.pathname}?year=${year}`
    window.history.pushState({ year }, '', url)
    setSelectedYear(year)
  }

  useEffect(() => {
    function onPop() {
      setSelectedYear(getYearFromUrl() ?? currentYear)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [currentYear])

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <LinearCalendar
      year={selectedYear}
      onChangeYear={selectYear}
      theme={theme}
      onToggleTheme={toggleTheme}
      t={t}
      locale={locale}
      onChangeLocale={setLocale}
      availableLocales={availableLocales}
    />
  )
}
