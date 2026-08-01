import Head from 'next/head'
import NavigationHeader from './navigationHeader'
import AnnouncementBar from './announcementBar'
import Footer from './footer'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'JAMcommerce'
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')

/**
 * Page shell, and the single place page metadata is set.
 *
 * Every page used to render a hardcoded <title>Store</title> with no
 * description, so all 26 pages were identical in search results and shared as
 * the same meaningless link. Each page now passes its own.
 *
 * @param {Object} props
 * @param {string} [props.title] - Page title, without the site name suffix.
 * @param {string} [props.description] - Meta description, around 155 characters.
 * @param {string} [props.image] - Absolute URL for the social preview image.
 * @param {string} [props.path] - Path of this page, for canonical and og:url.
 * @param {boolean} [props.noindex] - Keep this page out of search results.
 */
export default function Layout ({
  title,
  description,
  image,
  path = '',
  noindex = false,
  navCategories,
  subCategories,
  searchIndex,
  promo,
  /* Pages that open on a full-bleed panel — the home hero — turn off the
     shell's top padding so the panel starts flush under the header. */
  flush = false,
  children
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const url = SITE_URL ? `${SITE_URL}${path}` : undefined

  return (
    <div className='flex min-h-screen flex-col'>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <title>{pageTitle}</title>
        {description && <meta name='description' content={description} />}

        {/* Canonical and og:url need absolute URLs, so they are only emitted
            when NEXT_PUBLIC_SITE_URL is set. A canonical pointing at the wrong
            origin is worse than no canonical at all. */}
        {url && <link rel='canonical' href={url} />}

        {noindex && <meta name='robots' content='noindex,follow' />}

        <meta property='og:type' content='website' />
        <meta property='og:site_name' content={SITE_NAME} />
        <meta property='og:title' content={pageTitle} />
        {description && <meta property='og:description' content={description} />}
        {url && <meta property='og:url' content={url} />}
        {image && <meta property='og:image' content={image} />}

        <meta
          name='twitter:card'
          content={image ? 'summary_large_image' : 'summary'}
        />
        <meta name='twitter:title' content={pageTitle} />
        {description && <meta name='twitter:description' content={description} />}
        {image && <meta name='twitter:image' content={image} />}
      </Head>

      {/* The bars run the full width of the viewport and only their contents
          are held to the shell width. Boxing the whole page inside a centred
          card, which is what the previous max-width wrapper did, left a grey
          margin down both sides on a wide screen. */}
      <AnnouncementBar promo={promo} />

      <NavigationHeader
        navCategories={navCategories}
        subCategories={subCategories}
        searchIndex={searchIndex}
      />

      <main
        id='main'
        className={`mx-auto w-full max-w-shell flex-1 px-4 sm:px-6 lg:px-10 ${
          flush ? '' : 'pt-8'
        }`}
      >
        {children}
      </main>

      <Footer navCategories={navCategories} subCategories={subCategories} />
    </div>
  )
}
