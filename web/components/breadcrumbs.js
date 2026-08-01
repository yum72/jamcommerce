import Link from 'next/link'

/**
 * The trail above a product.
 *
 * Given as an ordered list because that is what it is, with the last item
 * marked aria-current rather than rendered as a dead link. The separators are
 * hidden from assistive tech so the trail is not read as "Home slash Cameras
 * slash Camera".
 */
export default function Breadcrumbs ({ items = [] }) {
  if (items.length === 0) return null

  return (
    <nav aria-label='Breadcrumb'>
      <ol className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted'>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className='flex items-center gap-2'>
              {index > 0 && <span aria-hidden='true'>/</span>}
              {last || !item.href ? (
                <span
                  className={last ? 'font-semibold text-ink' : undefined}
                  aria-current={last ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className='underline-offset-4 transition hover:text-forest-900 hover:underline'
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
