/**
 * robots.txt, generated per request so the sitemap URL matches whatever origin
 * the site is being served from. A hardcoded file would point preview
 * deployments and any future custom domain at the wrong host.
 *
 * Preview deployments are disallowed outright: Vercel gives every branch a
 * public URL, and letting those be indexed is how duplicate content ends up
 * competing with the real site.
 */
export async function getServerSideProps ({ res, req }) {
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers.host || ''
  const origin = `${proto}://${host}`

  const isPreview =
    process.env.VERCEL_ENV === 'preview' || /-git-|^localhost/.test(host)

  const body = isPreview
    ? ['User-agent: *', 'Disallow: /'].join('\n')
    : [
        'User-agent: *',
        'Allow: /',
        // Nothing to rank, and per-visitor.
        'Disallow: /cart',
        'Disallow: /wishlist',
        '',
        `Sitemap: ${origin}/sitemap.xml`
      ].join('\n')

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate')
  res.write(body)
  res.end()

  return { props: {} }
}

export default function Robots () {
  return null
}
