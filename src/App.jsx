import { useState, useEffect } from 'react'
import LinearCalendar from './components/LinearCalendar.jsx'
import { useLocale } from './hooks/useLocale.js'
import { useGoogleAuth } from './hooks/useGoogleAuth.js'

/** Read ?year=YYYY from the current URL. Returns the integer or null. */
function getYearFromUrl() {
  const y = parseInt(new URLSearchParams(window.location.search).get('year'), 10)
  return y >= 1 && y <= 9999 ? y : null
}

/** Read ?code= from the URL (Google OAuth callback). Returns the string or null. */
function getCodeFromUrl() {
  return new URLSearchParams(window.location.search).get('code')
}

export default function App() {
  const currentYear = new Date().getFullYear()
  // Initialise from URL (bookmarked ?year=YYYY), falling back to the current year
  const [selectedYear, setSelectedYear] = useState(() => getYearFromUrl() ?? currentYear)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  // Locale management
  const { t, locale, setLocale, availableLocales } = useLocale()

  // Google Auth
  const { isSignedIn, isLoading: authLoading, error: authError, userInfo, accessToken, signIn, signOut, handleCallback } = useGoogleAuth()

  // Handle OAuth callback: if ?code= is in the URL, exchange it for tokens
  useEffect(() => {
    const code = getCodeFromUrl()
    if (!code) return

    handleCallback(code).then(() => {
      // Remove ?code= from the URL without a page reload
      const clean = window.location.pathname
      window.history.replaceState({}, '', clean)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      googleAuth={{
        isSignedIn,
        isLoading: authLoading,
        error: authError,
        userInfo,
        accessToken,
        onSignIn: signIn,
        onSignOut: signOut,
      }}
    />
  )
}
