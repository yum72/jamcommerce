import Head from 'next/head'
import Script from 'next/script'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import { store } from '../redux/store'
import '../styles/index.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import 'react-toastify/dist/ReactToastify.css'

const SNIPCART_API_KEY = process.env.NEXT_PUBLIC_SNIPCART_API_KEY

export default function MyApp ({ Component, pageProps }) {
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
      <Component {...pageProps} />

      {/* Mounted once here rather than inside a page. Per-page containers get
          unmounted mid client-side navigation while react-toastify still holds
          references to their nodes, which surfaces as React throwing
          "insertBefore ... is not a child of this node" and blanking the page. */}
      <ToastContainer position='top-center' autoClose={3000} closeOnClick />
    </Provider>
  )
}
