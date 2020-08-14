import SingleProduct from './singleProduct'
import CartItem from './cartItem'

export default function ProductsContainer ({ products }) {
  return (
    <div>
      <div className='productsContainer'>
        {products.map(product =>
          product._id ? (
            <CartItem key={product.slug.current} product={product} />
          ) : (
            <SingleProduct key={product.slug.current} product={product} />
          )
        )}
      </div>

      <style jsx>{`
        .productsContainer {
          display: flex;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  )
}
