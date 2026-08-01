import ProductsContainer from '../productsContainer'

/**
 * One product row per featured category.
 *
 * The section header and "View all" link now come from ProductsContainer rather
 * than being rebuilt here, so a heading on the home page and a heading on a
 * category page are the same heading.
 */
export default function CategoriesSection ({ categoriesSectionData = [] }) {
  return (
    <>
      {categoriesSectionData
        .filter(section => section.products?.length)
        .map(section => (
          <ProductsContainer
            key={section.category.title}
            title={section.category.title}
            products={section.products}
            viewAllHref={`/categories/${section.category.slug.current}`}
          />
        ))}
    </>
  )
}
