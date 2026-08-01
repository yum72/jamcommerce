import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { getLayoutProps } from '../lib/layoutData'
import Layout from '../components/layout/layout'
import SingleProduct from '../components/singleProduct'
import { ArrowRightIcon } from '../components/ui/icons'
import { selectWishlist, clearWishlist } from '../redux/wishlistSlice'

export default function Wishlist ({ ...layout }) {
  const dispatch = useDispatch()
  const items = Object.values(useSelector(selectWishlist))

  // The saved list comes out of localStorage a tick after mount, so the
  // prerendered HTML has nothing in it. Rendering the empty state during that
  // tick would flash "nothing saved" at someone who has saved things, so hold
  // the message back until rehydration has actually happened.
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  return (
    <Layout
      title='Saved items'
      description='Products you have saved to come back to.'
      path='/wishlist'
      noindex
      {...layout}
    >
      <h1 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
        Saved items
        {items.length > 0 && (
          <span className='ml-3 align-middle text-base font-medium text-ink-muted'>
            {items.length} item{items.length === 1 ? '' : 's'}
          </span>
        )}
      </h1>

      <p className='mt-2 text-sm text-ink-muted'>
        Saved on this device. There are no accounts here, so nothing is synced
        anywhere.
      </p>

      {items.length > 0 ? (
        <>
          <div className='mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-4'>
            {items.map(product => (
              <SingleProduct key={product._id} product={product} />
            ))}
          </div>

          <button
            type='button'
            onClick={() => dispatch(clearWishlist())}
            className='mt-10 text-sm font-semibold text-ink-muted underline-offset-4 transition hover:text-forest-900 hover:underline'
          >
            Clear saved items
          </button>
        </>
      ) : (
        hydrated && (
          <div className='mt-8 rounded-3xl bg-tile px-8 py-20 text-center'>
            <p className='font-display text-xl font-bold'>Nothing saved yet</p>
            <p className='mt-2 text-ink-muted'>
              Tap the heart on any product to keep it here.
            </p>
            <Link href='/' className='btn btn-primary mt-8 px-8 py-4'>
              Browse products
              <ArrowRightIcon className='h-5 w-5' />
            </Link>
          </div>
        )
      )}
    </Layout>
  )
}

export async function getStaticProps () {
  return { props: await getLayoutProps() }
}
