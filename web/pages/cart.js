import { useState } from 'react'
import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { toast } from 'react-toastify'
import sanityClient from '../lib/sanity'
import { getLayoutProps } from '../lib/layoutData'
import CartItem from '../components/cartItem'
import Layout from '../components/layout/layout'
import Price from '../components/ui/price'
import { ArrowRightIcon, TruckIcon } from '../components/ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCart,
  selectCartSum,
  selectCartCount,
  clearCart
} from '../redux/cartSlice'

const SNIPCART_ENABLED = Boolean(process.env.NEXT_PUBLIC_SNIPCART_API_KEY)
const FREE_DELIVERY_OVER = 500

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

export default function Cart ({ ...layout }) {
  const dispatch = useDispatch()
  const cartItemsObj = useSelector(selectCart)
  const cartSum = useSelector(selectCartSum)
  const cartCount = useSelector(selectCartCount)
  const cartItemsList = Object.values(cartItemsObj)

  const [checkingOut, setCheckingOut] = useState(false)

  const isEmpty = cartItemsList.length === 0
  const qualifiesForFreeDelivery = cartSum >= FREE_DELIVERY_OVER

  /**
   * Hands the cart to Snipcart, then opens it.
   *
   * Snipcart keeps its own cart, entirely separate from this one. The usual
   * integration lets Snipcart own everything through snipcart-add-item
   * buttons, but then quantity changes made here would not reach it and the
   * two would drift apart. So this cart stays the single source of truth and
   * Snipcart is used only as the checkout: its cart is emptied and refilled
   * from ours at the moment of checkout.
   *
   * Emptying first matters because a customer who opens checkout, backs out,
   * changes quantities and returns would otherwise stack the old lines on top
   * of the new ones.
   */
  const handleCheckout = async () => {
    const snipcart = typeof window !== 'undefined' ? window.Snipcart : null

    if (!snipcart?.api?.cart) {
      toast.error('Checkout is still loading, try again in a moment')
      return
    }

    setCheckingOut(true)

    try {
      const existing = snipcart.store?.getState?.()?.cart?.items?.items ?? []
      for (const item of existing) {
        await snipcart.api.cart.items.remove(item.uniqueId)
      }

      for (const product of cartItemsList) {
        const image = product.defaultProductVariant.images?.[0]

        await snipcart.api.cart.items.add({
          // Must match the data-item-id and data-item-price on the product
          // page: Snipcart fetches `url` and validates the price it finds
          // there against the one sent here, so a tampered price is rejected.
          id: product._id,
          name: product.title,
          price: product.defaultProductVariant.price,
          url: `${window.location.origin}/item/${product.slug.current}`,
          quantity: product.count,
          ...(image ? { image: urlFor(image).width(300).url() } : {})
        })
      }

      await snipcart.api.theme.cart.open()
    } catch (error) {
      console.error('Snipcart checkout failed:', error)
      toast.error('Could not start checkout. Please try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <Layout
      title='Your cart'
      description='Review the items in your cart before checking out.'
      path='/cart'
      noindex
      {...layout}
    >
      <h1 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
        Your cart
        {!isEmpty && (
          <span className='ml-3 align-middle text-base font-medium text-ink-muted'>
            {cartCount} item{cartCount === 1 ? '' : 's'}
          </span>
        )}
      </h1>

      {isEmpty ? (
        <div className='mt-8 rounded-3xl bg-tile px-8 py-20 text-center'>
          <p className='font-display text-xl font-bold'>Your cart is empty</p>
          <p className='mt-2 text-ink-muted'>
            Nothing here yet. Have a look at what is in store.
          </p>
          <Link href='/' className='btn btn-primary mt-8 px-8 py-4'>
            Start shopping
            <ArrowRightIcon className='h-5 w-5' />
          </Link>
        </div>
      ) : (
        <div className='mt-8 grid items-start gap-10 lg:grid-cols-[1.6fr_1fr]'>
          <div className='divide-y divide-line border-y border-line'>
            {cartItemsList.map(product => (
              <CartItem key={product.slug.current} product={product} />
            ))}
          </div>

          {/* Sticky, so the total and the checkout button stay in view while a
              long cart is scrolled. */}
          <aside className='rounded-3xl bg-cream-50 p-6 lg:sticky lg:top-28'>
            <h2 className='font-display text-lg font-extrabold'>Order summary</h2>

            <dl className='mt-5 space-y-3 text-sm'>
              <div className='flex items-center justify-between'>
                <dt className='text-ink-muted'>Subtotal</dt>
                <dd>
                  <Price value={cartSum} className='text-base' />
                </dd>
              </div>
              <div className='flex items-center justify-between'>
                <dt className='text-ink-muted'>Delivery</dt>
                <dd className='font-semibold'>
                  {qualifiesForFreeDelivery ? 'Free' : 'Calculated at checkout'}
                </dd>
              </div>
            </dl>

            <div className='mt-5 flex items-center justify-between border-t border-line pt-5'>
              <span className='font-display font-extrabold'>Total</span>
              <Price value={cartSum} className='text-2xl' />
            </div>

            {!qualifiesForFreeDelivery && (
              <p className='mt-4 flex items-start gap-2 text-sm text-ink-muted'>
                <TruckIcon className='mt-0.5 h-4.5 w-4.5 shrink-0 text-forest-900' />
                <span>
                  <Price
                    value={FREE_DELIVERY_OVER - cartSum}
                    className='text-sm'
                  />{' '}
                  more for free delivery.
                </span>
              </p>
            )}

            {/* The checkout button previously had no click handler and no
                Snipcart class, so it did nothing at any point in the site's
                history. It is now wired to Snipcart when a key is configured,
                and honestly disabled when there is nothing to check out with
                rather than pretending to work. */}
            {SNIPCART_ENABLED ? (
              <button
                type='button'
                onClick={handleCheckout}
                disabled={checkingOut}
                className='btn btn-primary mt-6 w-full px-8 py-4 disabled:cursor-wait'
              >
                {checkingOut ? 'Opening checkout…' : 'Checkout'}
              </button>
            ) : (
              <>
                <button
                  type='button'
                  disabled
                  title='No payment provider is connected'
                  className='btn mt-6 w-full cursor-not-allowed bg-line px-8 py-4 text-ink-muted'
                >
                  Checkout
                </button>
                <p className='mt-3 text-sm text-ink-muted'>
                  Checkout is disabled because no payment provider is connected.
                  Set{' '}
                  <code className='rounded bg-white px-1 py-0.5 text-xs'>
                    NEXT_PUBLIC_SNIPCART_API_KEY
                  </code>{' '}
                  to enable it.
                </p>
              </>
            )}

            <div className='mt-5 flex items-center justify-between text-sm font-semibold'>
              <Link
                href='/'
                className='text-ink-muted underline-offset-4 transition hover:text-forest-900 hover:underline'
              >
                Continue shopping
              </Link>
              <button
                type='button'
                onClick={() => dispatch(clearCart())}
                className='text-ink-muted underline-offset-4 transition hover:text-forest-900 hover:underline'
              >
                Clear cart
              </button>
            </div>
          </aside>
        </div>
      )}
    </Layout>
  )
}

export async function getStaticProps () {
  return { props: await getLayoutProps() }
}
