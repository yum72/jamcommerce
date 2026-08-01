import Link from 'next/link'
import Logo from './logo'
import { TruckIcon, ReturnIcon } from '../ui/icons'

/**
 * The footer.
 *
 * It closes the page in the brand green so the layout reads as bookended rather
 * than trailing off, and it carries the two delivery promises the product page
 * makes, in the place a customer looks for them after they have decided.
 *
 * The category column is CMS-driven for the same reason the nav is: a category
 * added in the studio should not need a code change to be reachable.
 */
export default function Footer ({ navCategories = [], subCategories = [] }) {
  const categories = [...navCategories, ...subCategories].slice(0, 6)

  return (
    <footer className='mt-24 bg-forest-900 text-white'>
      <div className='mx-auto max-w-shell px-4 py-14 sm:px-6 lg:px-10'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]'>
          <div>
            <Link href='/' className='inline-block text-2xl'>
              <Logo />
            </Link>
            <p className='mt-4 max-w-sm text-sm leading-relaxed text-white/60'>
              A JAMstack storefront. Product pages are built ahead of time from
              a Sanity dataset and served as static files, so every one of them
              loads without a database behind it.
            </p>
          </div>

          {categories.length > 0 && (
            <nav aria-labelledby='footer-shop'>
              <h2
                id='footer-shop'
                className='font-display text-sm font-bold tracking-wider text-white uppercase'
              >
                Shop
              </h2>
              <ul className='mt-4 space-y-2.5 text-sm text-white/60'>
                {categories.map(category => (
                  <li key={category.slug.current}>
                    <Link
                      href={`/categories/${category.slug.current}`}
                      className='transition hover:text-white'
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div>
            <h2 className='font-display text-sm font-bold tracking-wider text-white uppercase'>
              Delivery
            </h2>
            <ul className='mt-4 space-y-3 text-sm text-white/60'>
              <li className='flex items-start gap-3'>
                <TruckIcon className='mt-0.5 h-5 w-5 shrink-0' />
                Free delivery on orders over $500
              </li>
              <li className='flex items-start gap-3'>
                <ReturnIcon className='mt-0.5 h-5 w-5 shrink-0' />
                Free returns within 30 days
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-sm text-white/50'>
          <p>© 2026 JAMcommerce. A demo storefront.</p>
          <p>Next.js · Sanity · Snipcart</p>
        </div>
      </div>
    </footer>
  )
}
