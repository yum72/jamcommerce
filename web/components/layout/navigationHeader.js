import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectCartCount } from '../../redux/cartSlice'
import { selectWishlistCount } from '../../redux/wishlistSlice'
import SearchBox from './searchBox'
import Logo from './logo'
import { CartIcon, HeartIcon, ChevronDownIcon } from '../ui/icons'

function CountBadge ({ count }) {
  if (!count) return null
  return (
    <span className='absolute top-0 right-0 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-forest-900 px-1 text-[11px] font-bold text-white tabular-nums'>
      {count}
    </span>
  )
}

export default function NavigationHeader ({
  navCategories = [],
  subCategories = [],
  searchIndex = []
}) {
  const cartCount = useSelector(selectCartCount)
  const wishlistCount = useSelector(selectWishlistCount)

  const navLinks = (
    <>
      {subCategories.length > 0 && (
        <div className='dropdown relative'>
          <button
            type='button'
            className='inline-flex cursor-pointer items-center gap-1 whitespace-nowrap'
            aria-haspopup='true'
          >
            Categories
            <ChevronDownIcon className='h-4 w-4' />
          </button>
          <ul className='dropdown-menu absolute left-0 z-50 hidden min-w-48 overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-xl'>
            {subCategories.map(subCat => (
              <li key={subCat.slug.current}>
                <Link
                  href={`/categories/${subCat.slug.current}`}
                  className='block px-4 py-2 text-sm font-medium whitespace-nowrap transition hover:bg-forest-50 hover:text-forest-900'
                >
                  {subCat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {navCategories.map(category => (
        <Link
          key={category.slug.current}
          href={`/categories/${category.slug.current}`}
          className='whitespace-nowrap transition hover:text-forest-900'
        >
          {category.title}
        </Link>
      ))}
    </>
  )

  return (
    // Sticky so the search field and cart stay reachable down a long category
    // page. Opaque white rather than a translucent blur: product photography
    // scrolling underneath a frosted bar made the nav labels hard to read.
    <header className='sticky top-0 z-50 border-b border-line bg-white'>
      <div className='mx-auto max-w-shell px-4 sm:px-6 lg:px-10'>
        <div className='flex h-18 items-center gap-4 lg:gap-8'>
          <Link href='/' className='shrink-0 text-xl text-forest-900'>
            <Logo />
            <span className='sr-only'>home</span>
          </Link>

          <nav
            aria-label='Categories'
            className='hidden items-center gap-7 text-sm font-semibold text-ink lg:flex'
          >
            {navLinks}
          </nav>

          <SearchBox
            products={searchIndex}
            className='ml-auto hidden w-full max-w-md md:block'
          />

          <div className='ml-auto flex shrink-0 items-center gap-1 md:ml-0'>
            <Link
              href='/wishlist'
              className='relative inline-flex items-center gap-2 rounded-full p-2.5 text-sm font-semibold transition hover:bg-tile'
            >
              <HeartIcon />
              <span className='hidden lg:inline'>Saved</span>
              <CountBadge count={wishlistCount} />
            </Link>

            <Link
              href='/cart'
              className='relative inline-flex items-center gap-2 rounded-full p-2.5 text-sm font-semibold transition hover:bg-tile'
            >
              <CartIcon />
              <span className='hidden lg:inline'>Cart</span>
              <CountBadge count={cartCount} />
            </Link>
          </div>
        </div>

        {/* Below md the search field and the category links each get their own
            row. Cramming four things into one row on a phone is what produced
            the old wrapping nav that pushed the cart button off screen. */}
        <div className='pb-3 md:hidden'>
          <SearchBox products={searchIndex} />
        </div>

        <nav
          aria-label='Categories'
          className='-mx-4 flex items-center gap-6 overflow-x-auto border-t border-line px-4 py-3 text-sm font-semibold text-ink sm:-mx-6 sm:px-6 lg:hidden'
        >
          {navLinks}
        </nav>
      </div>
    </header>
  )
}
