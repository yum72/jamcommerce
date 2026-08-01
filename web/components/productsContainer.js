import SingleProduct from './singleProduct'

export default function ProductsContainer ({ title = '', products = [] }) {
  return (
    <section className='py-8'>
      {title !== '' && (
        <div className='mb-8 flex items-center gap-4'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
            {title}
          </h2>
          {/* A rule that fills the remaining space, rather than the old
              centred 1/3-width <hr> that floated unattached to anything. */}
          <div className='h-px flex-1 bg-gray-300' />
        </div>
      )}

      {/* Grid rather than flex-wrap with centre justification. Wrapped rows
          were centring their leftovers, so the last row of an eight-product
          category sat in the middle of the page under a left-aligned grid. */}
      <div className='grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] justify-items-center gap-6'>
        {products.map(product => (
          <SingleProduct key={product.slug.current} product={product} />
        ))}
      </div>
    </section>
  )
}
