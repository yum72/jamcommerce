// import Head from 'next/head'
import sanityClient from '../../lib/sanity'
import ProductPage from '../../components/productPage'
import Layout from '../../components/layout/layout'

export default function Post ({ productData, navCategories }) {
  return (
    <Layout navCategories={navCategories}>
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
  let query = `*[slug.current == '${params.slug}'] {_id, slug, _createdAt, blurb, body, defaultProductVariant, tags, title, vendor->{title}, categories[]->{title}}[0]`
  const productData = await sanityClient.fetch(query)

  let catQuery = `*[_type == "category" && isOnNav == true]{title}`
  const navCategories = await sanityClient.fetch(catQuery)

  return {
    props: {
      productData: productData,
      navCategories
    }
  }
}
