import { useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import { store } from '../redux/store'
import { loadPersisted, startPersisting, hydrate } from '../redux/persist'
import '../styles/index.css'
import 'react-toastify/dist/ReactToastify.css'

const SNIPCART_API_KEY = process.env.NEXT_PUBLIC_SNIPCART_API_KEY

// Self-hosted through next/font rather than an @import in the stylesheet. The
// @import made every page wait on a round trip to fonts.googleapis.com before
// it could paint, and it pulled all fourteen Nunito weights for a font the old
// Tailwind config never actually applied. These ship from the site's own
// origin, preloaded, subset to latin, with only the weights in use.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap'
})

export default function MyApp ({ Component, pageProps }) {
  const router = useRouter()

  // The cart is restored after mount, never during render. Reading localStorage
  // while rendering would make the first client render disagree with the
  // prerendered HTML, which React treats as a hydration error. Loading first
  // and subscribing second matters: the other order writes the empty starting
  // state over the saved one before it has been read.
  useEffect(() => {
    const saved = loadPersisted()
    if (saved) store.dispatch(hydrate(saved))
    return startPersisting(store)
  }, [])

  // Snipcart's cart is a fixed overlay that does not know about client-side
  // navigation, so clicking a nav link behind it changed the page while the
  // overlay stayed put over the top of it. Close it whenever a route change
  // starts, so navigating away actually looks like navigating away.
  useEffect(() => {
    if (!SNIPCART_API_KEY) return

    const closeCart = () => {
      window.Snipcart?.api?.theme?.cart?.close?.()
    }

    router.events.on('routeChangeStart', closeCart)
    return () => router.events.off('routeChangeStart', closeCart)
  }, [router])

  return (
    <Provider store={store}>
      {/* Snipcart only loads when a key is configured. It was loading
          unconditionally: two preconnects, a stylesheet and a script from a
          third-party CDN on every page view, for a checkout that cannot work
          without a key. Dead weight on first paint and an extra origin for a
          crawler to wait on. The built-in cart does not depend on any of it. */}
      {SNIPCART_API_KEY && (
        <>
          <Head>
            <link rel='preconnect' href='https://app.snipcart.com' />
            <link rel='preconnect' href='https://cdn.snipcart.com' />
            <link
              rel='stylesheet'
              href='https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.css'
            />
          </Head>

          {/* next/script rather than a raw <script> inside <Head>, which Next
              has warned about since 11 and which blocked first paint. */}
          <Script
            src='https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js'
            strategy='afterInteractive'
          />

          <div hidden id='snipcart' data-api-key={SNIPCART_API_KEY} />
        </>
      )}

      {/* Deliberately no PersistGate wrapping the page. Gating render on
          rehydration makes the prerendered HTML of every product and category
          page empty, which throws away the point of static generation on a
          storefront that wants to be indexed. The cart rehydrates a tick after
          mount and the badge updates then; nothing else on a page depends on
          it. The previous version worked around the blank page by passing the
          page itself as PersistGate's loading prop, which rendered the whole
          tree twice. */}
      {/* The font variables live on a wrapper the whole app is inside, so the
          --font-inter and --font-jakarta that the Tailwind theme resolves are
          in scope for every component beneath it. */}
      <div className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <Component {...pageProps} />
      </div>

      {/* Mounted once here rather than inside a page. Per-page containers get
          unmounted mid client-side navigation while react-toastify still holds
          references to their nodes, which surfaces as React throwing
          "insertBefore ... is not a child of this node" and blanking the page. */}
      <ToastContainer position='top-center' autoClose={3000} closeOnClick />
    </Provider>
  )
}
