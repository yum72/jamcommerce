import { useState } from 'react'
import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { toast } from 'react-toastify'
import sanityClient from '../lib/sanity'
import CartItem from '../components/cartItem'
import Layout from '../components/layout/layout'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCart,
  selectCartSum,
  selectCartCount,
  clearCart
} from '../redux/cartSlice'

const SNIPCART_ENABLED = Boolean(process.env.NEXT_PUBLIC_SNIPCART_API_KEY)

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

export default function Cart ({ navCategories, subCategories }) {
  const dispatch = useDispatch()
  const cartItemsObj = useSelector(selectCart)
  const cartSum = useSelector(selectCartSum)
  const cartCount = useSelector(selectCartCount)
  const cartItemsList = Object.values(cartItemsObj)

  const [checkingOut, setCheckingOut] = useState(false)

  const isEmpty = cartItemsList.length === 0

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
      navCategories={navCategories}
      subCategories={subCategories}
    >
      <div className='mx-auto max-w-5xl'>
        <h1 className='pt-4 pb-8 text-4xl font-extrabold tracking-tight text-gray-900'>
          Your cart
          {!isEmpty && (
            <span className='ml-3 text-lg font-medium text-gray-500'>
              {cartCount} item{cartCount === 1 ? '' : 's'}
            </span>
          )}
        </h1>

        {isEmpty ? (
          <div className='rounded-2xl border border-dashed border-gray-300 bg-white/60 px-8 py-16 text-center'>
            <p className='text-lg text-gray-600'>Your cart is empty.</p>
            <Link
              href='/'
              className='mt-6 inline-flex items-center rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800'
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className='divide-y divide-gray-200 rounded-2xl bg-white shadow-sm'>
              {cartItemsList.map(product => (
                <CartItem key={product.slug.current} product={product} />
              ))}
            </div>

            <div className='mt-8 rounded-2xl bg-white p-6 shadow-sm'>
              <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='text-2xl font-bold text-gray-900'>
                  ${cartSum.toFixed(2)}
                </span>
              </div>

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
                  className='mt-6 flex w-full items-center justify-center rounded-lg bg-gray-900 px-8 py-4 text-lg font-medium text-white shadow-lg transition hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-gray-600'
                >
                  {checkingOut ? 'Opening checkout…' : 'Checkout'}
                </button>
              ) : (
                <>
                  <button
                    type='button'
                    disabled
                    title='No payment provider is connected'
                    className='mt-6 flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-gray-300 px-8 py-4 text-lg font-medium text-gray-600'
                  >
                    Checkout
                  </button>
                  <p className='mt-3 text-center text-sm text-gray-500'>
                    Checkout is disabled because no payment provider is
                    connected. Set{' '}
                    <code className='rounded bg-gray-100 px-1'>
                      NEXT_PUBLIC_SNIPCART_API_KEY
                    </code>{' '}
                    to enable it.
                  </p>
                </>
              )}

              <div className='mt-4 flex items-center justify-between'>
                <Link
                  href='/'
                  className='text-sm font-medium text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline'
                >
                  Continue shopping
                </Link>
                <button
                  type='button'
                  onClick={() => dispatch(clearCart())}
                  className='text-sm font-medium text-red-600 underline-offset-2 hover:text-red-700 hover:underline'
                >
                  Clear cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps () {
  let catQuery = `*[_type == "category" && isOnNav == true]{slug, title}`
  const navCategories = await sanityClient.fetch(catQuery)

  let subCategoriesQuery = `*[_type == "category" && defined(parents)]{title, slug}`
  const subCategories = await sanityClient.fetch(subCategoriesQuery)

  return {
    props: {
      navCategories,
      subCategories
    }
  }
}
