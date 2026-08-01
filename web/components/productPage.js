import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { toast } from 'react-toastify'

import sanityClient from '../lib/sanity'
import { addToCart } from '../redux/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../redux/wishlistSlice'
import ProductGallery from './productGallery'
import Breadcrumbs from './breadcrumbs'
import Price from './ui/price'
import {
  MinusIcon,
  PlusIcon,
  HeartIcon,
  TruckIcon,
  ReturnIcon
} from './ui/icons'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

// @sanity/block-content-to-react was deprecated in favour of @portabletext/react.
// "serializers" became "components", and each renderer receives { value }
// instead of { node }.
const portableTextComponents = {
  types: {
    code: ({ value }) => (
      <pre data-language={value.language}>
        <code>{value.code}</code>
      </pre>
    )
  }
}

export default function ProductPage ({ product }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const {
    _id,
    _createdAt,
    blurb,
    body = {},
    defaultProductVariant,
    title,
    categories = [],
    slug
  } = product

  const { price, images = [] } = defaultProductVariant
  const saved = useSelector(selectIsWishlisted(_id))

  // Only the fields the cart and the card render. Storing the whole product
  // document would put a page's worth of Portable Text into localStorage.
  const cartItem = {
    _id,
    slug,
    _createdAt,
    title,
    category: categories[0]?.title,
    defaultProductVariant
  }

  const [count, setCount] = useState(1)
  // Falls back to reading the origin on the client for local development,
  // where NEXT_PUBLIC_SITE_URL is usually unset.
  const [sitePath, setSitePath] = useState(SITE_URL)

  useEffect(() => {
    if (!SITE_URL && typeof window !== 'undefined') {
      setSitePath(window.location.origin)
    }
  }, [])

  const handleAddToCart = () => {
    dispatch(addToCart({ ...cartItem, count }))
    toast.success(`${title} added to cart`)
  }

  // Same action, then straight to the cart. A "Buy now" that only fills the
  // cart and leaves you on the product page is the same button twice.
  const handleBuyNow = () => {
    dispatch(addToCart({ ...cartItem, count }))
    router.push('/cart')
  }

  return (
    <div className='pb-4'>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          ...(categories[0]
            ? [
                {
                  label: categories[0].title,
                  href: `/categories/${categories[0].slug.current}`
                }
              ]
            : []),
          { label: title }
        ]}
      />

      <div className='mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14'>
        <ProductGallery images={images} title={title} />

        <div className='lg:py-2'>
          <h1 className='font-display text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl'>
            {title}
          </h1>

          {blurb?.en && (
            <p className='mt-3 max-w-prose leading-relaxed text-ink-muted'>
              {blurb.en}
            </p>
          )}

          <hr className='my-5 border-line' />

          <Price value={price} className='text-4xl' />

          {categories.length > 0 && (
            <div className='mt-5'>
              <h2 className='font-display text-sm font-bold'>
                {categories.length > 1 ? 'Categories' : 'Category'}
              </h2>
              <div className='mt-3 flex flex-wrap gap-2'>
                {categories.map(category => (
                  <Link
                    key={category.title}
                    href={`/categories/${category.slug.current}`}
                    className='rounded-full border border-line px-4 py-1.5 text-sm font-medium transition hover:border-forest-900 hover:text-forest-900'
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <hr className='my-5 border-line' />

          <div className='flex flex-wrap items-center gap-4'>
            <div className='inline-flex items-center rounded-full bg-tile'>
              <button
                type='button'
                aria-label='Decrease quantity'
                onClick={() => setCount(c => Math.max(1, c - 1))}
                disabled={count === 1}
                className='grid h-11 w-11 place-items-center rounded-full transition hover:bg-line disabled:opacity-40 disabled:hover:bg-transparent'
              >
                <MinusIcon className='h-4 w-4' />
              </button>
              <span
                aria-live='polite'
                aria-label={`Quantity: ${count}`}
                className='w-10 text-center font-display font-bold tabular-nums'
              >
                {count}
              </span>
              <button
                type='button'
                aria-label='Increase quantity'
                onClick={() => setCount(c => c + 1)}
                className='grid h-11 w-11 place-items-center rounded-full transition hover:bg-line'
              >
                <PlusIcon className='h-4 w-4' />
              </button>
            </div>

            <button
              type='button'
              onClick={() => {
                dispatch(toggleWishlist(cartItem))
                toast.info(saved ? 'Removed from saved' : 'Saved for later')
              }}
              aria-pressed={saved}
              className='inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold transition hover:border-forest-900 hover:text-forest-900'
            >
              <HeartIcon
                filled={saved}
                className={`h-4.5 w-4.5 ${saved ? 'text-forest-900' : ''}`}
              />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>

          <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
            {/* The data-item-* attributes are Snipcart's. They are harmless
                without a key configured, and they are what Snipcart validates
                the cart against at checkout: it fetches this URL and compares
                the price it finds here with the one submitted, so a tampered
                price is rejected. */}
            <button
              type='button'
              data-item-id={_id}
              data-item-price={price}
              data-item-url={`${sitePath}/item/${slug.current}`}
              data-item-description={blurb?.en}
              data-item-image={images[0] ? urlFor(images[0]).width(300).url() : undefined}
              data-item-name={title}
              onClick={handleBuyNow}
              className='btn btn-primary flex-1 px-8 py-4'
            >
              Buy now
            </button>

            <button
              type='button'
              onClick={handleAddToCart}
              className='btn btn-outline flex-1 px-8 py-4'
            >
              Add to cart
            </button>
          </div>

          <dl className='mt-6 divide-y divide-line rounded-2xl border border-line'>
            <div className='flex gap-3 p-4'>
              <TruckIcon className='mt-0.5 h-5 w-5 shrink-0 text-forest-900' />
              <div>
                <dt className='font-display text-sm font-bold'>Free delivery</dt>
                <dd className='text-sm text-ink-muted'>
                  On every order over $500, arriving in 2–4 working days.
                </dd>
              </div>
            </div>
            <div className='flex gap-3 p-4'>
              <ReturnIcon className='mt-0.5 h-5 w-5 shrink-0 text-forest-900' />
              <div>
                <dt className='font-display text-sm font-bold'>Free returns</dt>
                <dd className='text-sm text-ink-muted'>
                  Send anything back within 30 days at no cost.
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {body?.en?.length > 0 && (
        <section className='mt-16 max-w-3xl'>
          <h2 className='font-display text-2xl font-extrabold tracking-tight'>
            Details
          </h2>
          <div className='mt-4 space-y-4 leading-relaxed text-ink-muted'>
            <PortableText
              value={body.en}
              components={portableTextComponents}
            />
          </div>
        </section>
      )}
    </div>
  )
}
