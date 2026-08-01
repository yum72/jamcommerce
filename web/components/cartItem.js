import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'
import { useDispatch } from 'react-redux'
import {
  addToCart,
  removeOneFromCart,
  removeAllFromCart
} from '../redux/cartSlice'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

export default function CartItem ({ product }) {
  const dispatch = useDispatch()
  const { slug, title, defaultProductVariant, count } = product
  const oneProduct = { ...product, count: 1 }
  const { price } = defaultProductVariant

  return (
    <div className='flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap sm:gap-6 sm:p-6'>
      {defaultProductVariant.images && (
        <Link
          href={`/item/${slug.current}`}
          className='shrink-0 overflow-hidden rounded-xl bg-gray-100'
        >
          <img
            className='h-24 w-24 object-cover transition duration-300 hover:scale-105 sm:h-28 sm:w-28'
            src={urlFor(defaultProductVariant.images[0]).width(300).url()}
            alt={title}
            loading='lazy'
            width='300'
            height='300'
          />
        </Link>
      )}

      <div className='min-w-0 flex-1'>
        <Link
          href={`/item/${slug.current}`}
          className='block truncate text-lg font-semibold text-gray-900 transition hover:text-gray-600'
        >
          {title}
        </Link>
        <p className='mt-0.5 text-sm text-gray-500'>${price} each</p>

        <div className='mt-3 flex items-center gap-3'>
          <div className='inline-flex items-center rounded-lg border border-gray-300'>
            <button
              type='button'
              aria-label={`Remove one ${title}`}
              className='px-3 py-1.5 text-lg font-bold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500'
              onClick={() => dispatch(removeOneFromCart(oneProduct))}
            >
              &minus;
            </button>
            <span
              aria-label='Quantity'
              className='w-10 text-center text-sm font-semibold tabular-nums'
            >
              {count}
            </span>
            <button
              type='button'
              aria-label={`Add one ${title}`}
              className='px-3 py-1.5 text-lg font-bold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500'
              onClick={() => dispatch(addToCart(oneProduct))}
            >
              +
            </button>
          </div>

          <button
            type='button'
            className='text-sm font-medium text-red-600 underline-offset-2 transition hover:text-red-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500'
            onClick={() => dispatch(removeAllFromCart(product))}
          >
            Remove
          </button>
        </div>
      </div>

      <div className='ml-auto text-right'>
        <div className='text-xl font-bold tabular-nums text-gray-900'>
          ${(price * count).toFixed(2)}
        </div>
      </div>
    </div>
  )
}
