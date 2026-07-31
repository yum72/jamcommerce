import ProductsContainer from '../productsContainer'
import Link from 'next/link'

export default function CategoriesSection ({ categoriesSectionData }) {
  return (
    <div>
      <div>
        {categoriesSectionData.map(section => (
          <div key={section.category.title}>
            <Link
              href='/categories/[category]'
              as={`/categories/${section.category.slug.current}`}
            >
              <a className='pt-16 text-4xl tracking-tight leading-10 font-bold text-gray-800 hover:text-blue-600 flex justify-center'>
                {section.category.title}
              </a>
            </Link>
            <ProductsContainer products={section.products} />
          </div>
        ))}
      </div>
    </div>
  )
}
