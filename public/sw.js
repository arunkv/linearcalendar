const STATIC_CACHE = 'linearcalendar-static-v1'
const RUNTIME_CACHE = 'linearcalendar-runtime-v1'
const SAME_ORIGIN_DESTINATIONS = new Set(['document', 'script', 'style', 'image', 'font', 'manifest'])

function getScopePath() {
  return new URL(self.registration.scope).pathname
}

function withScope(path = '') {
  const scope = getScopePath()
  const normalizedPath = path.replace(/^\/+/, '')
  return normalizedPath ? new URL(normalizedPath, self.registration.scope).pathname : scope
}

const APP_SHELL = withScope('')
const PRECACHE_URLS = [
  APP_SHELL,
  withScope('index.html'),
  withScope('manifest.webmanifest'),
  withScope('favicon.svg'),
  withScope('icon.svg'),
  withScope('icon-maskable.svg'),
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames
        .filter((name) => ![STATIC_CACHE, RUNTIME_CACHE].includes(name))
        .map((name) => caches.delete(name))
    )
    await self.clients.claim()
  })())
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

function isCacheableRequest(request) {
  return request.method === 'GET' && request.url.startsWith(self.location.origin)
}

async function handleNavigationRequest(request) {
  const cache = await caches.open(STATIC_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(APP_SHELL, response.clone())
    }
    return response
  } catch {
    return (await cache.match(APP_SHELL)) || (await cache.match(withScope('index.html')))
  }
}

async function handleAssetRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  const cachedResponse = await cache.match(request)
  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => null)

  if (cachedResponse) {
    return cachedResponse
  }

  const networkResponse = await networkResponsePromise
  if (networkResponse) return networkResponse

  return caches.match(request)
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (!isCacheableRequest(request)) return

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }

  if (SAME_ORIGIN_DESTINATIONS.has(request.destination)) {
    event.respondWith(handleAssetRequest(request))
  }
})
