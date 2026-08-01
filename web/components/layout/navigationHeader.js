import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectCartCount } from '../../redux/cartSlice'

export default function NavigationHeader ({ navCategories, subCategories = [] }) {
  const cartCount = useSelector(selectCartCount)

  return (
    // Sticky with a translucent blur, so the nav stays reachable on long
    // category pages instead of scrolling away at the top.
    <header className='sticky top-0 z-50 border-b border-gray-200/70 bg-gray-100/80 backdrop-blur-md'>
      <nav className='mx-auto flex items-center gap-8 px-6 py-3 sm:px-10'>
        {/* No inner <a>. Next 13 onwards renders the anchor itself, so the old
            <Link><a> pattern was emitting anchors nested inside anchors:
            invalid HTML, and ambiguous for screen readers and crawlers. */}
        <Link href='/' className='shrink-0'>
          <img className='h-12 w-auto' src='/logo.png' alt='JAMcommerce' />
        </Link>

        <div className='flex flex-1 flex-wrap items-center gap-6 text-sm font-semibold text-gray-700'>
          {navCategories?.map(category => (
            <Link
              key={category.slug.current}
              href={`/categories/${category.slug.current}`}
              className='transition hover:text-gray-950'
            >
              {category.title}
            </Link>
          ))}

          {subCategories.length > 0 && (
            <div className='dropdown relative inline-block'>
              <button
                type='button'
                className='inline-flex cursor-pointer items-center gap-1 font-semibold text-gray-700 transition hover:text-gray-950'
                aria-haspopup='true'
              >
                Categories
                <svg
                  className='h-4 w-4 fill-current'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  aria-hidden='true'
                >
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </button>
              <ul className='dropdown-menu absolute left-0 z-50 hidden min-w-44 overflow-hidden rounded-xl bg-white pt-0 shadow-xl ring-1 ring-gray-900/5'>
                {subCategories.map(subCat => (
                  <li key={subCat.slug.current}>
                    <Link
                      href={`/categories/${subCat.slug.current}`}
                      className='block whitespace-nowrap px-4 py-2.5 transition hover:bg-gray-100'
                    >
                      {subCat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Link
          href='/cart'
          className='inline-flex shrink-0 items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800'
        >
          Cart
          {cartCount > 0 && (
            <span className='inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-gray-900'>
              {cartCount}
            </span>
          )}
        </Link>
      </nav>

      <style jsx>{`
        /* A small padding bridge so the pointer can cross the gap between the
           trigger and the menu without the menu closing underneath it. */
        .dropdown:hover .dropdown-menu,
        .dropdown:focus-within .dropdown-menu {
          display: block;
        }
        .dropdown-menu {
          top: 100%;
          margin-top: 0.5rem;
        }
      `}</style>
    </header>
  )
}
