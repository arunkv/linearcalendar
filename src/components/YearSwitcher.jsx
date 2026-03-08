import { useMemo, useState, useRef } from 'react'
import './YearSwitcher.css'
import t from '../locales/index.js'

const TODAY_YEAR = new Date().getFullYear()

function isValidYear(n) {
  return Number.isInteger(n) && n >= 1 && n <= 9999
}

export default function YearSwitcher({ year, onYearChange }) {
  const [customMode, setCustomMode] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [invalid, setInvalid] = useState(false)
  const inputRef = useRef(null)

  // Preset years: currentYear−1 through currentYear+5, plus the viewed year
  // if it falls outside that range (prepended at top).
  const presetYears = useMemo(() => {
    const base = Array.from({ length: 7 }, (_, i) => TODAY_YEAR - 1 + i)
    return base.includes(year) ? base : [year, ...base]
  }, [year])

  function step(delta) {
    const next = year + delta
    if (isValidYear(next)) onYearChange(next)
  }

  function enterCustomMode() {
    setCustomValue(String(year))
    setInvalid(false)
    setCustomMode(true)
    // Focus the input on next tick after it mounts
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function cancelCustom() {
    setCustomMode(false)
    setInvalid(false)
  }

  function commitCustom() {
    const n = parseInt(customValue, 10)
    if (isValidYear(n)) {
      onYearChange(n)
      setCustomMode(false)
      setInvalid(false)
    } else {
      setInvalid(true)
    }
  }

  function handleCustomKeyDown(e) {
    if (e.key === 'Enter') commitCustom()
    if (e.key === 'Escape') cancelCustom()
  }

  function handleSelectChange(e) {
    if (e.target.value === '__custom__') {
      enterCustomMode()
    } else {
      onYearChange(Number(e.target.value))
    }
  }

  return (
    <div className="year-switcher">
      {/* ‹ Prev year */}
      <button
        className="year-switcher__arrow"
        onClick={() => step(-1)}
        aria-label={t.yearSwitcher.prevYear}
        disabled={year <= 1}
      >
        ‹
      </button>

      {customMode ? (
        /* ── Custom year input ───────────────────────────────────── */
        <>
          <input
            ref={inputRef}
            className={[
              'year-switcher__input',
              invalid ? 'year-switcher__input--invalid' : '',
            ].filter(Boolean).join(' ')}
            type="number"
            min="1"
            max="9999"
            value={customValue}
            onChange={(e) => { setCustomValue(e.target.value); setInvalid(false) }}
            onBlur={commitCustom}
            onKeyDown={handleCustomKeyDown}
            aria-label={t.yearSwitcher.enterYear}
          />
          <button
            className="year-switcher__cancel"
            onClick={cancelCustom}
            aria-label={t.yearSwitcher.cancelYear}
            title={t.yearSwitcher.cancelTitle}
          >
            ✕
          </button>
        </>
      ) : (
        /* ── Preset select ───────────────────────────────────────── */
        <select
          className="year-switcher__select"
          value={year}
          onChange={handleSelectChange}
          aria-label={t.yearSwitcher.selectYear}
        >
          {presetYears.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
          <option disabled>─────</option>
          <option value="__custom__">{t.yearSwitcher.customOption}</option>
        </select>
      )}

      {/* › Next year */}
      <button
        className="year-switcher__arrow"
        onClick={() => step(1)}
        aria-label={t.yearSwitcher.nextYear}
        disabled={year >= 9999}
      >
        ›
      </button>
    </div>
  )
}
