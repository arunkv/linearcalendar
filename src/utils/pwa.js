function normalizeBaseUrl(baseUrl = '/') {
  const withLeadingSlash = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

export function buildServiceWorkerUrl(baseUrl = '/', version = '') {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const search = version ? `?v=${encodeURIComponent(version)}` : ''
  return `${normalizedBaseUrl}sw.js${search}`
}

function dispatchPwaEvent(win, name, detail) {
  win.dispatchEvent(new CustomEvent(name, { detail }))
}

export function observeServiceWorker(registration, { win = window, nav = navigator } = {}) {
  if (!registration || !win) return registration

  if (registration.waiting) {
    dispatchPwaEvent(win, 'linearcalendar:pwa-update-available', registration)
  }

  registration.addEventListener('updatefound', () => {
    const worker = registration.installing
    if (!worker) return

    worker.addEventListener('statechange', () => {
      if (worker.state !== 'installed') return
      if (nav?.serviceWorker?.controller) {
        dispatchPwaEvent(win, 'linearcalendar:pwa-update-available', registration)
      } else {
        dispatchPwaEvent(win, 'linearcalendar:pwa-offline-ready', registration)
      }
    })
  })

  return registration
}

export async function registerServiceWorker({
  nav = typeof navigator !== 'undefined' ? navigator : undefined,
  win = typeof window !== 'undefined' ? window : undefined,
  baseUrl = import.meta.env.BASE_URL,
  version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev',
} = {}) {
  if (!nav?.serviceWorker || !win) return null

  const register = async () => {
    const registration = await nav.serviceWorker.register(buildServiceWorkerUrl(baseUrl, version), {
      scope: normalizeBaseUrl(baseUrl),
    })
    return observeServiceWorker(registration, { win, nav })
  }

  if (typeof document === 'undefined' || document.readyState === 'complete') {
    return register()
  }

  win.addEventListener(
    'load',
    () => {
      register().catch(error => {
        console.error('Service worker registration failed', error)
      })
    },
    { once: true }
  )

  return null
}
