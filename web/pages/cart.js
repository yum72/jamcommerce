import sanityClient from '../lib/sanity'
import ProductsContainer from '../components/productsContainer'
import Layout from '../components/layout/layout'
import { useSelector, useDispatch } from 'react-redux'
import { actions } from '../redux/cart'

export default function Cart ({ navCategories }) {
  const dispatch = useDispatch()
  const cartItemsObj = useSelector(state => state.cart.cart)
  const cartSum = useSelector(state => state.cart.sum)
  const cartItemsList = Object.values(cartItemsObj)
  return (
    <Layout navCategories={navCategories}>
      <ProductsContainer products={cartItemsList} />
      <button onClick={() => dispatch(actions.clearCart())}>Clear Cart</button>
      <div>Total: {cartSum.toFixed(2)}</div>
    </Layout>
  )
}

export async function getStaticProps () {
  let catQuery = `*[_type == "category" && isOnNav == true]{title}`
  const navCategories = await sanityClient.fetch(catQuery)

  return {
    props: {
      navCategories
    }
  }
}
