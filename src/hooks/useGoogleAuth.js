import { useState, useEffect, useCallback } from 'react'
import { buildAuthUrl } from '../utils/googleCalendarUtils.js'

const REFRESH_TOKEN_KEY = 'gcal-refresh-token'
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Redirect URI must match what's registered in Google Cloud Console
function getRedirectUri() {
  return `${window.location.origin}/auth/callback`
}

/**
 * Manages Google OAuth 2.0 authentication state.
 *
 * Flow:
 *  1. signIn() → redirects to Google consent screen
 *  2. Google redirects back to /auth/callback?code=...
 *  3. App.jsx detects ?code= in URL, calls handleCallback(code)
 *  4. handleCallback exchanges code for tokens via Netlify Function
 *  5. Refresh token stored in localStorage; access token held in memory
 *  6. On subsequent loads, access token is restored via refreshToken()
 */
export function useGoogleAuth() {
  // Access token lives in memory only (expires in 1h)
  const [accessToken, setAccessToken] = useState(null)
  const [tokenExpiresAt, setTokenExpiresAt] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const isSignedIn = !!accessToken

  // ── Token refresh ──────────────────────────────────────────────────────────
  const refreshToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!storedRefreshToken) return false

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/.netlify/functions/google-refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Token refresh failed')
      }
      const data = await res.json()
      storeAccessToken(data.access_token, data.expires_in)
      return true
    } catch (err) {
      setError(err.message)
      // Refresh token is invalid/revoked — clear it so user sees the sign-in button
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      setAccessToken(null)
      setTokenExpiresAt(null)
      setUserInfo(null)
      return false
    } finally {
      setIsLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function storeAccessToken(token, expiresIn) {
    const expiresAt = Date.now() + expiresIn * 1000
    setAccessToken(token)
    setTokenExpiresAt(expiresAt)
  }

  // ── Fetch user profile after we have an access token ──────────────────────
  async function fetchUserInfo(token) {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setUserInfo({ name: data.name, email: data.email, picture: data.picture })
    } catch {
      // Non-critical — user info is only for display
    }
  }

  // ── Restore session on mount ───────────────────────────────────────────────
  useEffect(() => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (storedRefreshToken) {
      refreshToken().then(success => {
        if (success && accessToken) fetchUserInfo(accessToken)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch user info once we have an access token
  useEffect(() => {
    if (accessToken && !userInfo) {
      fetchUserInfo(accessToken)
    }
  }, [accessToken]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Proactive token refresh (5 min before expiry) ─────────────────────────
  useEffect(() => {
    if (!tokenExpiresAt) return
    const msUntilRefresh = tokenExpiresAt - Date.now() - 5 * 60 * 1000
    if (msUntilRefresh <= 0) {
      refreshToken()
      return
    }
    const timer = setTimeout(refreshToken, msUntilRefresh)
    return () => clearTimeout(timer)
  }, [tokenExpiresAt, refreshToken])

  // ── Sign in: redirect to Google ────────────────────────────────────────────
  function signIn() {
    if (!CLIENT_ID) {
      setError('Google Client ID is not configured (VITE_GOOGLE_CLIENT_ID missing)')
      return
    }
    const url = buildAuthUrl(CLIENT_ID, getRedirectUri())
    window.location.href = url
  }

  // ── Handle OAuth callback ──────────────────────────────────────────────────
  async function handleCallback(code) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/.netlify/functions/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Authentication failed')
      }
      const data = await res.json()

      if (data.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
      }
      storeAccessToken(data.access_token, data.expires_in)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Sign out ───────────────────────────────────────────────────────────────
  function signOut() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setAccessToken(null)
    setTokenExpiresAt(null)
    setUserInfo(null)
    setError(null)
  }

  return {
    isSignedIn,
    isLoading,
    error,
    userInfo,
    accessToken,
    signIn,
    signOut,
    handleCallback,
  }
}
