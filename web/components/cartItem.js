import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { useDispatch } from 'react-redux'
import sanityClient from '../lib/sanity'
import Price from './ui/price'
import { MinusIcon, PlusIcon, CloseIcon } from './ui/icons'
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
  const { slug, title, category, defaultProductVariant, count } = product
  const oneProduct = { ...product, count: 1 }
  const { price, images } = defaultProductVariant

  return (
    <div className='flex flex-wrap items-center gap-4 py-5 sm:flex-nowrap sm:gap-6'>
      {images?.[0] && (
        <Link
          href={`/item/${slug.current}`}
          tabIndex={-1}
          aria-hidden='true'
          className='shrink-0 overflow-hidden rounded-2xl bg-tile'
        >
          <img
            className='h-24 w-24 object-cover sm:h-28 sm:w-28'
            src={urlFor(images[0]).width(300).url()}
            alt=''
            loading='lazy'
            width='300'
            height='300'
          />
        </Link>
      )}

      <div className='min-w-0 flex-1'>
        <Link
          href={`/item/${slug.current}`}
          className='block truncate font-display font-bold transition hover:text-forest-900'
        >
          {title}
        </Link>
        <p className='mt-0.5 flex items-center gap-1 text-sm text-ink-muted'>
          {category && <span>{category} ·</span>}
          <Price value={price} className='text-sm' /> each
        </p>

        <div className='mt-3 flex items-center gap-3'>
          <div className='inline-flex items-center rounded-full bg-tile'>
            <button
              type='button'
              aria-label={`Remove one ${title}`}
              className='grid h-9 w-9 place-items-center rounded-full transition hover:bg-line'
              onClick={() => dispatch(removeOneFromCart(oneProduct))}
            >
              <MinusIcon className='h-4 w-4' />
            </button>
            <span
              aria-label={`Quantity: ${count}`}
              className='w-8 text-center font-display text-sm font-bold tabular-nums'
            >
              {count}
            </span>
            <button
              type='button'
              aria-label={`Add one ${title}`}
              className='grid h-9 w-9 place-items-center rounded-full transition hover:bg-line'
              onClick={() => dispatch(addToCart(oneProduct))}
            >
              <PlusIcon className='h-4 w-4' />
            </button>
          </div>

          <button
            type='button'
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-forest-900'
            onClick={() => dispatch(removeAllFromCart(product))}
          >
            <CloseIcon className='h-4 w-4' />
            Remove
          </button>
        </div>
      </div>

      <div className='ml-auto text-right'>
        <Price value={price * count} className='text-xl' />
      </div>
    </div>
  )
}
