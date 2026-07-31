import SingleProduct from './singleProduct'

export default function ProductsContainer ({ title = '', products }) {
  return (
    <div>
      <div className='text-4xl tracking-tight leading-10 font-bold text-gray-800 flex justify-center'>
        {title != '' ? <div className='pt-16'>{title}</div> : null}
      </div>
      <hr className='my-3 w-1/3 mx-auto' />
      <div className='flex justify-center flex-wrap'>
        {products.map(product => (
          <SingleProduct key={product.slug.current} product={product} />
        ))}
      </div>
    </div>
  )
}
