import Link from 'next/link'
import SingleProduct from './singleProduct'

/**
 * A titled row of product cards.
 *
 * The grid is a fixed four columns at the top breakpoint rather than auto-fill,
 * because auto-fill let a category with five products lay out as five narrow
 * columns on one screen and three-plus-two on another. Four, two, one is the
 * same shape everywhere.
 */
export default function ProductsContainer ({
  title = '',
  products = [],
  viewAllHref,
  emptyMessage = 'Nothing here yet.'
}) {
  return (
    <section className='py-8'>
      {title !== '' && (
        <div className='mb-7 flex items-end justify-between gap-4'>
          <h2 className='font-display text-2xl font-extrabold tracking-tight sm:text-3xl'>
            {title}
          </h2>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className='shrink-0 text-sm font-semibold text-ink-muted underline-offset-4 transition hover:text-forest-900 hover:underline'
            >
              View all
            </Link>
          )}
        </div>
      )}

      {products.length === 0 ? (
        <p className='rounded-2xl bg-tile px-6 py-12 text-center text-ink-muted'>
          {emptyMessage}
        </p>
      ) : (
        <div className='grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-4'>
          {products.map(product => (
            <SingleProduct key={product.slug.current} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
