import sanityClient from '../lib/sanity'

/**
 * Sitemap, generated per request rather than at build time.
 *
 * The pages themselves are static, but the catalogue lives in Sanity and can
 * change without a rebuild. A sitemap baked at build time would go stale the
 * first time a product is added, which is the one job a sitemap has.
 *
 * The origin is read from the request rather than an env var so it stays
 * correct on preview deployments and after a custom domain is added.
 */
const buildSitemap = (origin, products, categories) => {
  const url = (path, lastmod, priority) =>
    [
      '  <url>',
      `    <loc>${origin}${path}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
      `    <priority>${priority}</priority>`,
      '  </url>'
    ]
      .filter(Boolean)
      .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">'.replace(
      'www.sitemap.org',
      'www.sitemaps.org'
    ),
    url('/', null, '1.0'),
    ...categories.map((c) => url(`/categories/${c.slug.current}`, null, '0.8')),
    ...products.map((p) =>
      url(`/item/${p.slug.current}`, p._updatedAt?.slice(0, 10), '0.7')
    ),
    '</urlset>'
  ].join('\n')
}

export async function getServerSideProps ({ res, req }) {
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${proto}://${req.headers.host}`

  const [products, categories] = await Promise.all([
    sanityClient.fetch(`*[_type == 'product' && defined(slug.current)]{slug, _updatedAt}`),
    sanityClient.fetch(`*[_type == 'category' && defined(slug.current)]{slug}`)
  ])

  res.setHeader('Content-Type', 'text/xml')
  // Cached at the edge for an hour, so crawlers are cheap to serve while new
  // products still appear the same day.
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate')
  res.write(buildSitemap(origin, products, categories))
  res.end()

  return { props: {} }
}

// Never rendered; getServerSideProps writes the response directly.
export default function Sitemap () {
  return null
}
