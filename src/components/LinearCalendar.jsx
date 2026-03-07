import { Fragment, useMemo, useState, useRef, useEffect, useCallback } from 'react'

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const PrintIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
import {
  buildMonthRow,
  getMonthName,
  DAY_ABBRS,
  GRID_COLS,
  isToday,
  isWeekendColumn,
  toDateKey,
  getEventsForMonth,
  eventsToIcs,
  icsToEvents,
  parseDateLocal,
  colToDateKey,
  clampCol,
} from '../utils/calendarUtils.js'
import { useEvents } from '../hooks/useEvents.js'
import { useTags } from '../hooks/useTags.js'
import EventModal from './EventModal.jsx'
import YearSwitcher from './YearSwitcher.jsx'
import TagFilterBar from './TagFilterBar.jsx'
import HelpModal from './HelpModal.jsx'
import './LinearCalendar.css'

// Stable module-level arrays — built once, not on every render
const MONTH_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const COL_INDICES = Array.from({ length: GRID_COLS }, (_, i) => i) // eslint-disable-line no-unused-vars

// ── Date formatting for tooltip ───────────────────────────────────────────────
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`
}
function formatDateRange(start, end) {
  return start === end ? formatDate(start) : `${formatDate(start)} – ${formatDate(end)}`
}

function getDefaultCreateDate(year) {
  const now = new Date()
  if (now.getFullYear() === year) {
    return toDateKey(year, now.getMonth(), now.getDate())
  }
  return toDateKey(year, 0, 1)
}

function isEditableTarget(target) {
  return target instanceof HTMLElement && (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)
  )
}

// ── Color resolution ──────────────────────────────────────────────────────────
// Tagged event → use tag's current color; otherwise neutral gray
function resolveEventColor(ev, tagsById) {
  if (ev.tagId && tagsById[ev.tagId]) return tagsById[ev.tagId].color
  return '#6b7280'
}

export default function LinearCalendar({ year, onChangeYear, theme, onToggleTheme }) {
  const { events, addEvent, updateEvent, deleteEvent, replaceAll } = useEvents()
  const { tags, addTag, updateTag, deleteTag, clearAll: clearAllTags, replaceAll: replaceAllTags } = useTags()

  const [modalState, setModalState] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [deleteTagConfirm, setDeleteTagConfirm] = useState(null) // tagId pending deletion
  const [importError, setImportError] = useState(null)
  const [showHelp, setShowHelp] = useState(
    () => !localStorage.getItem('helpSeen')
  )
  const [tooltip, setTooltip] = useState(null) // { event, x, y }
  const [installPrompt, setInstallPrompt] = useState(null)
  const [updateRegistration, setUpdateRegistration] = useState(null)
  const [isInstalling, setIsInstalling] = useState(false)

  function openHelp() { setShowHelp(true) }
  function closeHelp() {
    localStorage.setItem('helpSeen', '1')
    setShowHelp(false)
  }

  async function handleInstallApp() {
    if (!installPrompt || isInstalling) return
    setIsInstalling(true)
    installPrompt.prompt()
    try {
      await installPrompt.userChoice
    } finally {
      setInstallPrompt(null)
      setIsInstalling(false)
    }
  }

  function handleReloadApp() {
    if (updateRegistration?.waiting) {
      updateRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    window.location.reload()
  }

  // null = closed
  // { mode: 'create', initialDate: 'YYYY-MM-DD' }
  // { mode: 'edit', event: {...} }

  // ephemeral — not persisted; Set of tag IDs whose events are hidden
  const [hiddenTagIds, setHiddenTagIds] = useState(() => new Set())

  const importInputRef = useRef(null)

  // ── Drag state ──────────────────────────────────────────────────────────────
  // dragRef is mutable (not state) so pointermove doesn't cause 60fps re-renders.
  // Only dragVisual (which drives rendering) is real state.
  const dragRef          = useRef(null)
  const [dragVisual, setDragVisual] = useState(null)
  const suppressClickRef = useRef(null) // holds eventId to swallow post-drag click
  const gridRootRef      = useRef(null)

  // Stable refs so useCallback([], []) closures can read the latest values
  const yearRef        = useRef(year)
  const updateEventRef = useRef(updateEvent)
  useEffect(() => { yearRef.current = year }, [year])
  useEffect(() => { updateEventRef.current = updateEvent }, [updateEvent])

  const handlePointerMove = useCallback((e) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = e.clientX - drag.startClientX
    const dy = e.clientY - drag.startClientY
    if (!drag.hasMoved) {
      if (Math.hypot(dx, dy) <= 4) return
      drag.hasMoved = true
    }
    const rawCol = Math.floor((e.clientX - drag.colStartX) / drag.colWidth)
    const col = clampCol(rawCol, yearRef.current, drag.monthIndex)
    if (drag.type === 'create') {
      if (col !== drag.currentCol) {
        drag.currentCol = col
        setDragVisual({
          type: 'create',
          monthIndex: drag.monthIndex,
          startCol: Math.min(drag.anchorCol, col),
          endCol:   Math.max(drag.anchorCol, col),
        })
      }
    } else if (drag.type === 'resize') {
      let newStart = drag.currentStartCol
      let newEnd   = drag.currentEndCol
      if (drag.edge === 'start') newStart = Math.min(col, drag.currentEndCol)
      else                       newEnd   = Math.max(col, drag.currentStartCol)
      if (newStart !== drag.currentStartCol || newEnd !== drag.currentEndCol) {
        drag.currentStartCol = newStart
        drag.currentEndCol   = newEnd
        setDragVisual({
          type: 'resize',
          eventId:    drag.event.id,
          monthIndex: drag.monthIndex,
          startCol:   newStart,
          endCol:     newEnd,
        })
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerUp = useCallback(() => {
    const drag = dragRef.current
    if (!drag) return
    // Remove drag CSS classes
    const gridEl = gridRootRef.current
    if (gridEl) {
      gridEl.classList.remove(
        'linear-calendar--dragging',
        'linear-calendar--drag-create',
        'linear-calendar--drag-resize',
      )
    }
    if (drag.type === 'create') {
      if (!drag.hasMoved) {
        // Single tap — preserve original click-to-create behaviour
        const dateKey = colToDateKey(yearRef.current, drag.monthIndex, drag.anchorCol)
        setModalState({ mode: 'create', initialDate: dateKey })
      } else {
        // Drag — open modal with pre-filled date range
        const startCol = Math.min(drag.anchorCol, drag.currentCol)
        const endCol   = Math.max(drag.anchorCol, drag.currentCol)
        setModalState({
          mode: 'create',
          initialDate:    colToDateKey(yearRef.current, drag.monthIndex, startCol),
          initialEndDate: colToDateKey(yearRef.current, drag.monthIndex, endCol),
        })
      }
    } else if (drag.type === 'resize') {
      if (drag.hasMoved) {
        const col     = drag.edge === 'start' ? drag.currentStartCol : drag.currentEndCol
        const newDate = colToDateKey(yearRef.current, drag.monthIndex, col)
        const field   = drag.edge === 'start' ? 'startDate' : 'endDate'
        // Guard: don't produce an inverted range
        const newStart = drag.edge === 'start' ? newDate : drag.event.startDate
        const newEnd   = drag.edge === 'end'   ? newDate : drag.event.endDate
        if (newStart <= newEnd) {
          updateEventRef.current(drag.event.id, { [field]: newDate })
        }
        // Suppress the synthetic click that fires after pointer-capture release
        suppressClickRef.current = drag.event.id
      }
    }
    dragRef.current = null
    setDragVisual(null)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Register document-level pointer handlers once
  useEffect(() => {
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup',     handlePointerUp)
    document.addEventListener('pointercancel', handlePointerUp)
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup',     handlePointerUp)
      document.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  useEffect(() => {
    function onBeforeInstallPrompt(e) {
      e.preventDefault()
      setInstallPrompt(e)
    }

    function onAppInstalled() {
      setInstallPrompt(null)
      setIsInstalling(false)
    }

    function onUpdateAvailable(e) {
      setUpdateRegistration(e.detail ?? null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
    window.addEventListener('linearcalendar:pwa-update-available', onUpdateAvailable)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
      window.removeEventListener('linearcalendar:pwa-update-available', onUpdateAvailable)
    }
  }, [])

  // Read column geometry once at drag-start (all 1fr columns are equal width)
  function getColGeometry() {
    const root = gridRootRef.current
    if (!root) return { colStartX: 0, colWidth: 1 }
    const firstCell = root.querySelector('[data-col="0"]')
    if (!firstCell) return { colStartX: 0, colWidth: 1 }
    const rect = firstCell.getBoundingClientRect()
    return { colStartX: rect.left, colWidth: rect.width || 1 }
  }

  function handleCellPointerDown(e, monthIndex, colIndex) {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const { colStartX, colWidth } = getColGeometry()
    dragRef.current = {
      type: 'create', monthIndex,
      anchorCol: colIndex, currentCol: colIndex,
      colStartX, colWidth,
      hasMoved: false,
      startClientX: e.clientX, startClientY: e.clientY,
    }
    const gridEl = gridRootRef.current
    if (gridEl) gridEl.classList.add('linear-calendar--dragging', 'linear-calendar--drag-create')
    setTooltip(null)
  }

  function handleResizePointerDown(e, ev, edge, monthIndex) {
    e.stopPropagation()
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const { colStartX, colWidth } = getColGeometry()
    dragRef.current = {
      type: 'resize', edge, event: ev, monthIndex,
      currentStartCol: ev.startCol, currentEndCol: ev.endCol,
      colStartX, colWidth,
      hasMoved: false,
      startClientX: e.clientX, startClientY: e.clientY,
    }
    const gridEl = gridRootRef.current
    if (gridEl) gridEl.classList.add('linear-calendar--dragging', 'linear-calendar--drag-resize')
    setTooltip(null)
  }

  // Pre-compute all 12 month rows; recomputes only when `year` changes
  const monthRows = useMemo(
    () =>
      MONTH_INDICES.map((monthIndex) => ({
        monthIndex,
        name: getMonthName(monthIndex).slice(0, 3),
        cells: buildMonthRow(year, monthIndex),
      })),
    [year]
  )

  // Fast lookup: { [tagId]: tag }
  const tagsById = useMemo(
    () => Object.fromEntries(tags.map(t => [t.id, t])),
    [tags]
  )

  // Filter before passing to getEventsForMonth so row-packing sees only visible
  // events (no ghost rows from hidden-tag events).
  const visibleEvents = useMemo(() => {
    if (hiddenTagIds.size === 0) return events
    return events.filter(ev => !ev.tagId || !hiddenTagIds.has(ev.tagId))
  }, [events, hiddenTagIds])

  // ── Tag visibility toggle ─────────────────────────────────────────────────
  function toggleTagVisibility(tagId) {
    setHiddenTagIds(prev => {
      const next = new Set(prev)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  // ── Tag deletion (with guard if events use the tag) ───────────────────────
  function handleDeleteTag(tagId) {
    const affected = events.filter(ev => ev.tagId === tagId)
    if (affected.length > 0) {
      setDeleteTagConfirm(tagId)
      return
    }
    confirmDeleteTag(tagId)
  }

  function confirmDeleteTag(tagId) {
    const affected = events.filter(ev => ev.tagId === tagId)
    // Batch-clear tagId from every affected event
    affected.forEach(ev => updateEvent(ev.id, { tagId: null }))
    // Remove from hidden set if present
    setHiddenTagIds(prev => {
      const next = new Set(prev)
      next.delete(tagId)
      return next
    })
    deleteTag(tagId)
    setDeleteTagConfirm(null)
  }

  // ── Clear all events and tags ─────────────────────────────────────────────
  function handleClearAll() {
    replaceAll([])
    clearAllTags()
    setHiddenTagIds(new Set())
    setShowClearConfirm(false)
  }

  function openCreateModal(dateKey = getDefaultCreateDate(year)) {
    setModalState({ mode: 'create', initialDate: dateKey, initialEndDate: dateKey })
  }

  function openImportPicker() {
    setImportError(null)
    importInputRef.current?.click()
  }

  // ── Export events as .ics file download ───────────────────────────────────
  function handleExport() {
    const blob = new Blob([eventsToIcs(events, tagsById)], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'linear-calendar-events.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Import events from a .ics file ────────────────────────────────────────
  function handleImportChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.ics')) {
      setImportError('Invalid file type — please select a .ics file.')
      return
    }
    setImportError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const { events: parsed, tags: parsedTags } = icsToEvents(ev.target.result)
        if (parsed.length === 0) {
          setImportError('No valid events found in the file.')
        } else {
          replaceAll(parsed)
          replaceAllTags(parsedTags)
          setHiddenTagIds(new Set())
        }
      } catch (err) {
        setImportError(err.message === 'ICS file too large' ? 'File too large (max 5 MB).' : 'Failed to parse .ics file.')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // reset so same file can be re-imported
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      if (isEditableTarget(e.target)) return

      const isHelpShortcut = e.key === '?' || (e.key === '/' && e.shiftKey)
      if (isHelpShortcut) {
        e.preventDefault()
        if (!showHelp && !modalState && !showClearConfirm && !deleteTagConfirm) {
          openHelp()
        }
        return
      }

      if (showHelp || modalState || showClearConfirm || deleteTagConfirm) return

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        openCreateModal()
        return
      }

      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault()
        handleExport()
        return
      }

      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault()
        openImportPicker()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [deleteTagConfirm, handleExport, modalState, showClearConfirm, showHelp, year])

  return (
    <div className="linear-calendar" ref={gridRootRef}>
      {/* ── Top header bar ─────────────────────────────────────────────────── */}
      <div className="linear-calendar__header">
        {/* Brand: logo + app title */}
        <div className="linear-calendar__brand">
          <img
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            className="linear-calendar__brand-logo"
            alt=""
            aria-hidden="true"
          />
          <span className="linear-calendar__brand-title">Linear Calendar</span>
        </div>

        <YearSwitcher year={year} onYearChange={onChangeYear} />

        <div className="linear-calendar__header-actions">
          <button
            className="linear-calendar__action-btn linear-calendar__action-btn--icon-only"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            className="linear-calendar__action-btn linear-calendar__action-btn--icon-only"
            onClick={openHelp}
            aria-label="Help"
            title="Help"
          >
            ?
          </button>

          {installPrompt && (
            <button
              className="linear-calendar__action-btn linear-calendar__action-btn--accent"
              onClick={handleInstallApp}
              disabled={isInstalling}
              title="Install app"
            >
              Install
            </button>
          )}

          <button
            className="linear-calendar__action-btn"
            onClick={handleExport}
            title="Export events as .ics"
          >
            <DownloadIcon /> <span className="linear-calendar__action-btn-label">Export</span>
          </button>

          <button
            className="linear-calendar__action-btn"
            onClick={openImportPicker}
            title="Import events from .ics"
          >
            <UploadIcon /> <span className="linear-calendar__action-btn-label">Import</span>
          </button>
          {importError && (
            <span className="linear-calendar__action-btn--danger" role="alert">
              {importError}
            </span>
          )}

          <button
            className="linear-calendar__action-btn linear-calendar__action-btn--danger"
            onClick={() => setShowClearConfirm(true)}
            title="Clear all events and tags"
          >
            <TrashIcon /> <span className="linear-calendar__action-btn-label">Clear</span>
          </button>

          <button
            className="linear-calendar__action-btn"
            onClick={() => window.print()}
            title="Print calendar"
          >
            <PrintIcon /> <span className="linear-calendar__action-btn-label">Print</span>
          </button>

          {/* Hidden file input for import */}
          <input
            ref={importInputRef}
            type="file"
            accept=".ics"
            style={{ display: 'none' }}
            onChange={handleImportChange}
          />
        </div>
      </div>

      {/* ── Tag filter bar (hidden when no tags exist) ──────────────────────── */}
      <TagFilterBar
        tags={tags}
        hiddenTagIds={hiddenTagIds}
        onToggle={toggleTagVisibility}
        onEditTag={updateTag}
        onDelete={handleDeleteTag}
      />

      {/* ── Grid wrapper (handles fallback scroll on narrow viewports) ──────── */}
      <div className="linear-calendar__grid-wrapper">
        <div className="linear-calendar__grid">

          {/* ── One pair of rows per month ────────────────────────────────── */}
          {monthRows.map(({ monthIndex, name, cells }) => {
            const monthEvents = getEventsForMonth(visibleEvents, year, monthIndex)

            return (
              <Fragment key={monthIndex}>
                {/* Date row */}
                <div className="linear-calendar__row">
                  <div className="linear-calendar__month-label">{name}</div>

                  {cells.map((day, colIndex) => {
                    const empty = day === null
                    const weekend = isWeekendColumn(colIndex)
                    const today = !empty && isToday(year, monthIndex, day)
                    const dateKey = !empty ? toDateKey(year, monthIndex, day) : null

                    const cellClass = [
                      'linear-calendar__cell',
                      empty   ? 'linear-calendar__cell--empty'     : 'linear-calendar__cell--clickable',
                      weekend ? 'linear-calendar__cell--weekend'    : '',
                      today   ? 'linear-calendar__cell--today'      : '',
                    ].filter(Boolean).join(' ')

                    return (
                      <div
                        key={colIndex}
                        className={cellClass}
                        data-col={colIndex}
                        data-month={monthIndex}
                        onPointerDown={empty ? undefined : (e) => handleCellPointerDown(e, monthIndex, colIndex)}
                      >
                        {!empty && (
                          <>
                            {today
                              ? <span className="linear-calendar__today-dot">{day}</span>
                              : <span className="linear-calendar__cell-day">{day}</span>
                            }
                            <span className="linear-calendar__cell-dow">
                              {DAY_ABBRS[colIndex % 7]}
                            </span>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Events row */}
                <div className="linear-calendar__row">
                  <div className="linear-calendar__events-container">
                    {/* Ghost bar for drag-to-create */}
                    {dragVisual?.type === 'create' && dragVisual.monthIndex === monthIndex && (
                      <div
                        className="linear-calendar__ghost-bar"
                        style={{
                          gridColumn: `${dragVisual.startCol + 1} / ${dragVisual.endCol + 2}`,
                          gridRow: 1,
                        }}
                        aria-hidden="true"
                      />
                    )}

                    {monthEvents.map(ev => {
                      const evStartDate = parseDateLocal(ev.startDate)
                      const evEndDate   = parseDateLocal(ev.endDate)
                      const monthStart  = new Date(year, monthIndex, 1)
                      const monthEnd    = new Date(year, monthIndex + 1, 0)
                      // Show left handle only when the event actually starts in this month
                      const showLeft  = evStartDate >= monthStart
                      // Show right handle only when the event actually ends in this month
                      const showRight = evEndDate   <= monthEnd
                      // During a resize, override the displayed columns for this bar
                      const isResizing   = dragVisual?.type === 'resize' && dragVisual.eventId === ev.id && dragVisual.monthIndex === monthIndex
                      const dispStartCol = isResizing ? dragVisual.startCol : ev.startCol
                      const dispEndCol   = isResizing ? dragVisual.endCol   : ev.endCol

                      return (
                        <div
                          key={ev.id}
                          className="linear-calendar__event-bar"
                          style={{
                            gridColumn: `${dispStartCol + 1} / ${dispEndCol + 2}`,
                            gridRow: ev.row,
                            backgroundColor: resolveEventColor(ev, tagsById),
                          }}
                          onClick={(e) => {
                            if (suppressClickRef.current === ev.id) {
                              suppressClickRef.current = null
                              return
                            }
                            e.stopPropagation()
                            setTooltip(null)
                            setModalState({ mode: 'edit', event: ev })
                          }}
                          onMouseEnter={(e) => { if (!dragRef.current) setTooltip({ event: ev, x: e.clientX, y: e.clientY }) }}
                          onMouseMove={(e)  => { if (!dragRef.current) setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null) }}
                          onMouseLeave={() => setTooltip(null)}
                        >
                          {showLeft && (
                            <div
                              className="linear-calendar__resize-handle linear-calendar__resize-handle--left"
                              onPointerDown={(e) => handleResizePointerDown(e, ev, 'start', monthIndex)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          <span className="linear-calendar__event-bar-title">{ev.title}</span>
                          {showRight && (
                            <div
                              className="linear-calendar__resize-handle linear-calendar__resize-handle--right"
                              onPointerDown={(e) => handleResizePointerDown(e, ev, 'end', monthIndex)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Fragment>
            )
          })}

        </div>
      </div>

      {updateRegistration && (
        <div
          className="linear-calendar__toast"
          role="status"
          aria-live="polite"
        >
          <span className="linear-calendar__toast-text">A new version is available.</span>
          <button
            className="linear-calendar__toast-btn"
            onClick={handleReloadApp}
          >
            Reload
          </button>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="linear-calendar__footer">
        <span>© {year} Arun K Viswanathan</span>
        <span className="linear-calendar__footer-sep">·</span>
        <span>Built with <a href="https://claude.ai" target="_blank" rel="noreferrer">Claude</a></span>
      </footer>

      {/* ── Clear confirmation dialog ────────────────────────────────────────── */}
      {showClearConfirm && (
        <div className="linear-calendar__overlay" onClick={() => setShowClearConfirm(false)}>
          <div
            className="linear-calendar__confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Clear calendar confirmation"
            onClick={e => e.stopPropagation()}
          >
            <h2>Clear calendar?</h2>
            <p>
              This will permanently delete{' '}
              <strong>{events.length} event{events.length !== 1 ? 's' : ''}</strong> and{' '}
              <strong>{tags.length} tag{tags.length !== 1 ? 's' : ''}</strong>.
              This cannot be undone.
            </p>
            <p className="linear-calendar__confirm-export-hint">
              💡 We recommend exporting your data before clearing.
            </p>
            <div className="linear-calendar__confirm-actions">
              <button className="linear-calendar__action-btn" onClick={handleExport}>
                <DownloadIcon /> Export first
              </button>
              <div className="linear-calendar__confirm-actions-right">
                <button className="linear-calendar__action-btn" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </button>
                <button
                  className="linear-calendar__action-btn linear-calendar__action-btn--danger"
                  onClick={handleClearAll}
                >
                  Clear everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete tag confirmation dialog ──────────────────────────────────── */}
      {deleteTagConfirm && (() => {
        const affected = events.filter(ev => ev.tagId === deleteTagConfirm)
        const tag = tagsById[deleteTagConfirm]
        return (
          <div className="linear-calendar__overlay" onClick={() => setDeleteTagConfirm(null)}>
            <div
              className="linear-calendar__confirm-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Delete tag confirmation"
              onClick={e => e.stopPropagation()}
            >
              <h2>Delete tag{tag ? ` "${tag.name}"` : ''}?</h2>
              <p>
                <strong>{affected.length} event{affected.length !== 1 ? 's' : ''}</strong>{' '}
                use this tag. The tag will be removed from{' '}
                {affected.length === 1 ? 'that event' : 'those events'} and deleted.
              </p>
              <div className="linear-calendar__confirm-actions">
                <div className="linear-calendar__confirm-actions-right">
                  <button className="linear-calendar__action-btn" onClick={() => setDeleteTagConfirm(null)}>
                    Cancel
                  </button>
                  <button
                    className="linear-calendar__action-btn linear-calendar__action-btn--danger"
                    onClick={() => confirmDeleteTag(deleteTagConfirm)}
                  >
                    Delete tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Event tooltip ───────────────────────────────────────────────────── */}
      {tooltip && !modalState && (
        <div
          className="linear-calendar__event-tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          <span className="linear-calendar__event-tooltip-title">{tooltip.event.title}</span>
          <span className="linear-calendar__event-tooltip-dates">
            {formatDateRange(tooltip.event.startDate, tooltip.event.endDate)}
          </span>
          {tooltip.event.tagId && tagsById[tooltip.event.tagId] && (
            <span className="linear-calendar__event-tooltip-tag">
              <span
                className="linear-calendar__event-tooltip-tag-dot"
                style={{ background: tagsById[tooltip.event.tagId].color }}
              />
              {tagsById[tooltip.event.tagId].name}
            </span>
          )}
        </div>
      )}

      {/* ── Help / welcome modal ────────────────────────────────────────────── */}
      {showHelp && <HelpModal onClose={closeHelp} />}

      {/* ── Event modal ─────────────────────────────────────────────────────── */}
      {modalState && (
        <EventModal
          event={modalState.mode === 'edit' ? modalState.event : null}
          initialDate={modalState.mode === 'create' ? modalState.initialDate : null}
          initialEndDate={modalState.mode === 'create' ? (modalState.initialEndDate ?? null) : null}
          tags={tags}
          onAddTag={addTag}
          onSave={(data) => {
            if (modalState.mode === 'edit') updateEvent(modalState.event.id, data)
            else addEvent(data)
            setModalState(null)
          }}
          onDelete={modalState.mode === 'edit'
            ? () => { deleteEvent(modalState.event.id); setModalState(null) }
            : undefined
          }
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}
