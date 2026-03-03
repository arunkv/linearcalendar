import { useState, useEffect } from 'react'
import YearPicker from './components/YearPicker.jsx'
import AnnualCalendar from './components/AnnualCalendar.jsx'

export default function App() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(null)
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

  function toggleTheme() {
    setTheme(t => (t === 'light' ? 'dark' : 'light'))
  }

  if (selectedYear === null) {
    return (
      <YearPicker
        defaultYear={currentYear}
        onYearSelect={setSelectedYear}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  return (
    <AnnualCalendar
      year={selectedYear}
      onChangeYear={() => setSelectedYear(null)}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  )
}
