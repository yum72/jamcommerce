import sanityClient from '../lib/sanity'
import CartItem from '../components/cartItem'
import Layout from '../components/layout/layout'
import { useSelector } from 'react-redux'
import { selectCart, selectCartSum } from '../redux/cartSlice'

export default function Cart ({ navCategories, subCategories }) {
  // const dispatch = useDispatch()
  const cartItemsObj = useSelector(selectCart)
  const cartSum = useSelector(selectCartSum)
  const cartItemsList = Object.values(cartItemsObj)

  return (
    <Layout
      title='Your cart'
      description='Review the items in your cart before checking out.'
      path='/cart'
      noindex
      navCategories={navCategories}
      subCategories={subCategories}
    >
      <div className=' max-w-6xl mx-auto'>
        <h1 className='py-2 text-4xl tracking-tight leading-10 font-bold text-gray-800 flex justify-center'>
          Your Cart
        </h1>
        <div className='flex justify-center flex-col'>
          {cartItemsList.map(product => (
            <div key={product.slug.current}>
              <CartItem product={product} />
              <hr />
            </div>
          ))}
        </div>
        {/* <button onClick={() => dispatch(actions.clearCart())}>
          Clear Cart
        </button> */}
        <div className='text-right my-auto ml-auto font-semibold text-base text-gray-700'>
          Total{' '}
          <span className='pl-2 text-xl text-gray-800'>
            ${cartSum.toFixed(2)}
          </span>
        </div>
        <button className='w-full flex items-center justify-center px-8 mt-10 py-3 border border-transparent text-base leading-6 font-medium rounded text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10 shadow-lg'>
          Checkout
        </button>
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
