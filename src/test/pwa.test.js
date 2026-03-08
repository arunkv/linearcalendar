import { describe, it, expect, vi } from 'vitest'
import { buildServiceWorkerUrl, observeServiceWorker, registerServiceWorker } from '../utils/pwa.js'

describe('pwa utilities', () => {
  it('builds the service worker URL for the root base path', () => {
    expect(buildServiceWorkerUrl('/', '1.2.3')).toBe('/sw.js?v=1.2.3')
  })

  it('builds the service worker URL for nested base paths', () => {
    expect(buildServiceWorkerUrl('/linearcalendar/', '1.2.3')).toBe('/linearcalendar/sw.js?v=1.2.3')
  })

  it('dispatches an update event when a waiting worker is present', () => {
    const dispatchEvent = vi.fn()
    const addEventListener = vi.fn()
    const registration = {
      waiting: {},
      addEventListener,
    }

    observeServiceWorker(registration, {
      win: { dispatchEvent },
      nav: { serviceWorker: { controller: {} } },
    })

    expect(dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'linearcalendar:pwa-update-available' })
    )
    expect(addEventListener).toHaveBeenCalledWith('updatefound', expect.any(Function))
  })

  it('returns null when service workers are unsupported', async () => {
    const result = await registerServiceWorker({ nav: {}, win: {} })
    expect(result).toBeNull()
  })
})
