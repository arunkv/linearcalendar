import { useEffect } from 'react'
import './HelpModal.css'

export default function HelpModal({ onClose }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="help-modal__overlay" onClick={onClose}>
      <div
        className="help-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Help"
      >
        <div className="help-modal__header">
          <h2 className="help-modal__title">Welcome to Linear Calendar</h2>
          <button className="help-modal__close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="help-modal__body">
          <p className="help-modal__intro">
            A year-at-a-glance calendar where every month is a single horizontal row.
          </p>

          <section className="help-modal__section">
            <h3>Getting started</h3>
            <ul>
              <li><strong>Add an event</strong> — click any day cell on the calendar.</li>
              <li><strong>Edit or delete an event</strong> — click the coloured event bar.</li>
              <li><strong>Change year</strong> — use the year switcher in the header, or bookmark <code>?year=2025</code>.</li>
            </ul>
          </section>

          <section className="help-modal__section">
            <h3>Tags</h3>
            <ul>
              <li>Assign a <strong>tag</strong> (with a colour) to any event for easy grouping.</li>
              <li>Create tags inline while adding or editing an event.</li>
              <li>Toggle tag visibility from the filter bar below the header.</li>
            </ul>
          </section>

          <section className="help-modal__section">
            <h3>Import &amp; Export</h3>
            <ul>
              <li><strong>Export</strong> — downloads all events as a standard <code>.ics</code> file.</li>
              <li><strong>Import</strong> — loads events from any <code>.ics</code> file (replaces current data).</li>
            </ul>
          </section>

          <section className="help-modal__section">
            <h3>Keyboard shortcuts</h3>
            <ul>
              <li><kbd>?</kbd> — open help.</li>
              <li><kbd>N</kbd> — create a new event.</li>
              <li><kbd>X</kbd> — export events as <code>.ics</code>.</li>
              <li><kbd>I</kbd> — import from a <code>.ics</code> file.</li>
              <li><kbd>Esc</kbd> — close the current dialog.</li>
            </ul>
          </section>

          <section className="help-modal__section">
            <h3>Other</h3>
            <ul>
              <li>Toggle <strong>dark / light mode</strong> with the moon/sun icon.</li>
              <li><strong>Print</strong> renders a clean, landscape-optimised view.</li>
              <li>All data is stored locally in your browser — nothing is sent to a server.</li>
            </ul>
          </section>
        </div>

        <div className="help-modal__footer">
          <button className="help-modal__btn" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  )
}
