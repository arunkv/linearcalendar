import { useState } from 'react'
import './YearPicker.css'

export default function YearPicker({ defaultYear, onYearSelect, theme, onToggleTheme }) {
  const [inputValue, setInputValue] = useState(String(defaultYear))

  const parsedYear = parseInt(inputValue, 10)
  const isValid = !isNaN(parsedYear) && parsedYear >= 1 && parsedYear <= 9999

  function handleSubmit(e) {
    e.preventDefault()
    if (isValid) {
      onYearSelect(parsedYear)
    }
  }

  function handleChange(e) {
    setInputValue(e.target.value)
  }

  // Quick-navigate by ±1 year
  function handleStep(delta) {
    const next = (isValid ? parsedYear : defaultYear) + delta
    if (next >= 1 && next <= 9999) {
      setInputValue(String(next))
    }
  }

  return (
    <div className="year-picker">
      <button
        className="year-picker__theme-btn"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>

      <div className="year-picker__card">
        <div className="year-picker__icon" aria-hidden="true">📅</div>
        <h1 className="year-picker__title">Annual Calendar</h1>
        <p className="year-picker__subtitle">Choose a year to get started</p>

        <form className="year-picker__form" onSubmit={handleSubmit}>
          <div className="year-picker__input-row">
            <button
              type="button"
              className="year-picker__step-btn"
              onClick={() => handleStep(-1)}
              aria-label="Previous year"
            >
              ‹
            </button>
            <input
              className="year-picker__input"
              type="number"
              min="1"
              max="9999"
              value={inputValue}
              onChange={handleChange}
              autoFocus
              aria-label="Year"
            />
            <button
              type="button"
              className="year-picker__step-btn"
              onClick={() => handleStep(1)}
              aria-label="Next year"
            >
              ›
            </button>
          </div>

          <button
            className="year-picker__submit-btn"
            type="submit"
            disabled={!isValid}
          >
            View Calendar →
          </button>
        </form>
      </div>
    </div>
  )
}
