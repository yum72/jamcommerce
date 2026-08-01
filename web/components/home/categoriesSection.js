import ProductsContainer from '../productsContainer'
import Link from 'next/link'

export default function CategoriesSection ({ categoriesSectionData = [] }) {
  return (
    <div>
      {categoriesSectionData
        .filter(section => section.products?.length)
        .map(section => (
          <section key={section.category.title} className='pt-8'>
            <div className='mb-8 flex items-baseline gap-4'>
              <h2 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
                {section.category.title}
              </h2>
              <div className='h-px flex-1 self-center bg-gray-300' />
              <Link
                href={`/categories/${section.category.slug.current}`}
                className='shrink-0 text-sm font-semibold text-gray-600 transition hover:text-gray-900'
              >
                View all &rarr;
              </Link>
            </div>
            <ProductsContainer products={section.products} />
          </section>
        ))}
    </div>
  )
}
