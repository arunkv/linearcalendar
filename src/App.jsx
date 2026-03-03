import { useState, useEffect } from 'react'
import YearPicker from './components/YearPicker.jsx'
import AnnualCalendar from './components/AnnualCalendar.jsx'

export default function App() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(null)

  // Keep the browser tab title in sync with the selected year
  useEffect(() => {
    document.title = selectedYear
      ? `${selectedYear} — Annual Calendar`
      : 'Annual Calendar'
  }, [selectedYear])

  if (selectedYear === null) {
    return (
      <YearPicker
        defaultYear={currentYear}
        onYearSelect={setSelectedYear}
      />
    )
  }

  return (
    <AnnualCalendar
      year={selectedYear}
      onChangeYear={() => setSelectedYear(null)}
    />
  )
}
