// import Head from 'next/head'
import sanityClient from '../../lib/sanity'
import ProductPage from '../../components/productPage'
import Layout from '../../components/layout/layout'

export default function Post ({ productData, navCategories, subCategories }) {
  return (
    <Layout navCategories={navCategories} subCategories={subCategories}>
      <ProductPage product={productData} />
    </Layout>
  )
}

export async function getStaticPaths () {
  let query = `*[_type == 'product']{ slug }`
  const slugs = await sanityClient.fetch(query)
  const paths = slugs.map(item => ({
    params: {
      slug: item.slug.current
    }
  }))
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps ({ params }) {
  let query = `*[_type == 'product' && slug.current == '${params.slug}'] {_id, slug, _createdAt, blurb, body, defaultProductVariant, tags, title, vendor->{title}, categories[]->{title, slug}}[0]`
  const productData = await sanityClient.fetch(query)

  let catQuery = `*[_type == "category" && isOnNav == true]{slug, title}`
  const navCategories = await sanityClient.fetch(catQuery)

  let subCategoriesQuery = `*[_type == "category" && defined(parents)]{title, slug}`
  const subCategories = await sanityClient.fetch(subCategoriesQuery)

  return {
    props: {
      productData,
      navCategories,
      subCategories
    }
  }
}
