import './LanguageSwitcher.css'

/**
 * Language switcher dropdown component.
 *
 * @param {object} props
 * @param {string} props.currentLocale - Current locale code (e.g., 'en', 'zh')
 * @param {Function} props.onChange - Callback when language is changed
 * @param {object} props.availableLocales - Map of locale codes to display names
 */
export default function LanguageSwitcher({ currentLocale, onChange, availableLocales }) {
  return (
    <select
      className="language-switcher"
      value={currentLocale}
      onChange={e => onChange(e.target.value)}
      aria-label="Select language"
      title="Language"
    >
      {Object.entries(availableLocales).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  )
}
