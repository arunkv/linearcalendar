import { useEffect } from 'react'
import './HelpModal.css'
import t from '../locales/index.js'

export default function HelpModal({ onClose }) {
  const h = t.helpModal

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
        aria-label={h.ariaLabel}
      >
        <div className="help-modal__header">
          <h2 className="help-modal__title">{h.title}</h2>
          <button className="help-modal__close-btn" onClick={onClose} aria-label={h.close}>✕</button>
        </div>

        <div className="help-modal__body">
          <p className="help-modal__intro">
            {h.intro}
          </p>

          <section className="help-modal__section">
            <h3>{h.gettingStarted.heading}</h3>
            <ul>
              <li><strong>{h.gettingStarted.addEvent}</strong> {h.gettingStarted.addEventText}</li>
              <li><strong>{h.gettingStarted.editEvent}</strong> {h.gettingStarted.editEventText}</li>
              <li>
                <strong>{h.gettingStarted.changeYear}</strong>{' '}
                {h.gettingStarted.changeYearText}{' '}
                <code>{h.gettingStarted.changeYearCode}</code>{h.gettingStarted.changeYearSuffix}
              </li>
            </ul>
          </section>

          <section className="help-modal__section">
            <h3>{h.tags.heading}</h3>
            <ul>
              <li>
                {h.tags.assignPrefix} <strong>{h.tags.assignTag}</strong> {h.tags.assignSuffix}
              </li>
              <li>{h.tags.createInline}</li>
              <li>{h.tags.toggleVisibility}</li>
            </ul>
          </section>

          <section className="help-modal__section">
            <h3>{h.importExport.heading}</h3>
            <ul>
              <li>
                <strong>{h.importExport.exportLabel}</strong>{' '}
                {h.importExport.exportText} <code>{h.importExport.exportCode}</code> {h.importExport.exportSuffix}
              </li>
              <li>
                <strong>{h.importExport.importLabel}</strong>{' '}
                {h.importExport.importText} <code>{h.importExport.importCode}</code> {h.importExport.importSuffix}
              </li>
            </ul>
          </section>

          <section className="help-modal__section">
            <h3>{h.shortcuts.heading}</h3>
            <ul>
              <li><kbd>{h.shortcuts.helpKbd}</kbd> {h.shortcuts.helpText}</li>
              <li><kbd>{h.shortcuts.newEventKbd}</kbd> {h.shortcuts.newEventText}</li>
              <li>
                <kbd>{h.shortcuts.exportKbd}</kbd>{' '}
                {h.shortcuts.exportText} <code>{h.shortcuts.exportCode}</code>{h.shortcuts.exportSuffix}
              </li>
              <li>
                <kbd>{h.shortcuts.importKbd}</kbd>{' '}
                {h.shortcuts.importText} <code>{h.shortcuts.importCode}</code> {h.shortcuts.importSuffix}
              </li>
              <li><kbd>{h.shortcuts.escKbd}</kbd> {h.shortcuts.escText}</li>
            </ul>
          </section>

          <section className="help-modal__section">
            <h3>{h.other.heading}</h3>
            <ul>
              <li>
                {h.other.togglePrefix} <strong>{h.other.toggleLabel}</strong> {h.other.toggleSuffix}
              </li>
              <li><strong>{h.other.printLabel}</strong> {h.other.printText}</li>
              <li>{h.other.localStorage}</li>
            </ul>
          </section>
        </div>

        <div className="help-modal__footer">
          <button className="help-modal__btn" onClick={onClose}>{h.gotIt}</button>
        </div>
      </div>
    </div>
  )
}
