import { useState, useEffect } from 'react'
import YearPicker from './components/YearPicker.jsx'
import AnnualCalendar from './components/AnnualCalendar.jsx'

/** Read ?year=YYYY from the current URL. Returns the integer or null. */
function getYearFromUrl() {
  const y = parseInt(new URLSearchParams(window.location.search).get('year'), 10)
  return y >= 1 && y <= 9999 ? y : null
}

export default function App() {
  const currentYear = new Date().getFullYear()
  // Initialise from URL so a bookmarked ?year=YYYY loads directly
  const [selectedYear, setSelectedYear] = useState(getYearFromUrl)
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  )

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  // Keep the browser tab title in sync with the selected year
  useEffect(() => {
    document.title = selectedYear
      ? `${selectedYear} — Annual Calendar`
      : 'Annual Calendar'
  }, [selectedYear])

  // Keep URL in sync with year state and handle browser back/forward
  function selectYear(year) {
    const url = year == null
      ? window.location.pathname
      : `${window.location.pathname}?year=${year}`
    window.history.pushState({ year }, '', url)
    setSelectedYear(year)
  }

  useEffect(() => {
    function onPop() { setSelectedYear(getYearFromUrl()) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function toggleTheme() {
    setTheme(t => (t === 'light' ? 'dark' : 'light'))
  }

  if (selectedYear === null) {
    return (
      <YearPicker
        defaultYear={currentYear}
        onYearSelect={selectYear}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  return (
    <AnnualCalendar
      year={selectedYear}
      onChangeYear={() => selectYear(null)}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  )
}
