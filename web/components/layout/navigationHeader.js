import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectCartCount } from '../../redux/cartSlice'

export default function NavigationHeader ({ navCategories, subCategories }) {
  const cartCount = useSelector(selectCartCount)

  return (
    <div>
      <nav className='px-10 pt-1 text-gray-700 font-semibold flex items-end flex-wrap'>
        <Link href='/'>
          <a>
            <img className='h-16 pr-16 pt-5 pb-1' src='/logo.png' alt='logo' />
          </a>
        </Link>
        <div className='flex-grow flex items-center w-auto flex-wrap'>
          <div className='flex flex-grow flex-wrap justify-start my-auto py-2 pr-4'>
            {navCategories
              ? navCategories.map(category => (
                  <Link
                    key={category.slug.current}
                    href='/categories/[category]'
                    as={`/categories/${category.slug.current}`}
                  >
                    <a className='pr-10 py-1'>{category.title}</a>
                  </Link>
                ))
              : null}

            <div className='dropdown inline-block relative py-1'>
              <div className='text-gray-700 cursor-pointer font-semibold rounded inline-flex items-center'>
                <span className='mr-1'>Categories</span>
                <svg
                  className='fill-current h-4 w-4'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />{' '}
                </svg>
              </div>
              <ul className='dropdown-menu z-50 absolute hidden text-gray-700 pt-1'>
                {subCategories.map(subCat => (
                  <li key={subCat.slug.current}>
                    <Link
                      href='/categories/[category]'
                      as={`/categories/${subCat.slug.current}`}
                    >
                      <a className='rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap'>
                        {subCat.title}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link href='/cart'>
            <span className='cursor-pointer'>
              Checkout Cart
              {cartCount > 0 && (
                <span className='text-red-500 pl-1'>({cartCount})</span>
              )}
            </span>
          </Link>
        </div>
      </nav>
      <style jsx>{`
        .dropdown:hover .dropdown-menu {
          display: block;
        }
      `}</style>
    </div>
  )
}
