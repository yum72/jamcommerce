import sanityClient from '../../lib/sanity'
import ProductsContainer from '../../components/productsContainer'
import Layout from '../../components/layout/layout'

export default function Post ({
  productsData,
  navCategories,
  category,
  categorySlug,
  subCategories
}) {
  const count = productsData?.length ?? 0

  return (
    <Layout
      title={category}
      description={`Browse ${count} ${category} product${count === 1 ? '' : 's'}. Prices, photos and details for everything in the ${category} range.`}
      path={categorySlug ? `/categories/${categorySlug}` : undefined}
      navCategories={navCategories}
      subCategories={subCategories}
    >
      <h1 className='py-2 text-4xl tracking-tight leading-10 font-bold text-gray-800 flex justify-center'>
        {category}
      </h1>
      <ProductsContainer products={productsData} />
    </Layout>
  )
}

export async function getStaticPaths () {
  let query = `*[_type == 'category']{slug{current}}`
  const categories = await sanityClient.fetch(query)
  const paths = categories.map(item => ({
    params: {
      category: item.slug.current
    }
  }))
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps ({ params }) {
  let query = `*[_type == "category" && slug.current == '${params.category}']{
        _id,
        "products": *[_type == "product" && references(^._id)]
        {slug, _createdAt, title, defaultProductVariant},
        "category": {slug{current}, title}
      }[0]`
  const result = await sanityClient.fetch(query)

  let catQuery = `*[_type == "category" && isOnNav == true]{slug, title}`
  const navCategories = await sanityClient.fetch(catQuery)

  let subCategoriesQuery = `*[_type == "category" && defined(parents)]{title, slug}`
  const subCategories = await sanityClient.fetch(subCategoriesQuery)

  return {
    props: {
      productsData: result.products,
      category: result.category.title,
      categorySlug: params.category,
      navCategories,
      subCategories
    }
  }
}
