const STORAGE_KEY = 'jamcommerce.state'
const PERSISTED_SLICES = ['cart', 'wishlist']
const WRITE_DELAY_MS = 150

export const HYDRATE = 'persist/hydrate'

/** Replaces the persisted slices wholesale. Dispatched once, after mount. */
export const hydrate = state => ({ type: HYDRATE, payload: state })

/**
 * Reads the saved cart and saved-items list.
 *
 * Returns null rather than throwing on anything unexpected: localStorage can be
 * unavailable (Safari private browsing, blocked third-party contexts) and the
 * stored value can be from an older shape of the app. Losing a cart is
 * annoying; a storefront that will not render because of one is worse.
 */
export function loadPersisted () {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const state = {}
    for (const slice of PERSISTED_SLICES) {
      if (parsed[slice] && typeof parsed[slice] === 'object') {
        state[slice] = parsed[slice]
      }
    }

    return Object.keys(state).length > 0 ? state : null
  } catch {
    return null
  }
}

/**
 * Writes those slices back on every change, and returns the unsubscribe.
 *
 * Debounced, because holding the + button on a cart row dispatches once per
 * click and each write is a synchronous JSON.stringify on the main thread.
 */
export function startPersisting (store) {
  if (typeof window === 'undefined') return () => {}

  let timer = null

  const write = () => {
    timer = null
    try {
      const state = store.getState()
      const slice = {}
      for (const name of PERSISTED_SLICES) slice[name] = state[name]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slice))
    } catch {
      // Quota exceeded, or storage disabled. The cart still works for this
      // session; it just will not survive a refresh.
    }
  }

  const unsubscribe = store.subscribe(() => {
    if (timer) return
    timer = window.setTimeout(write, WRITE_DELAY_MS)
  })

  return () => {
    unsubscribe()
    if (timer) {
      window.clearTimeout(timer)
      write()
    }
  }
}
