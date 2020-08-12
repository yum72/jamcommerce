// import Head from 'next/head'
import ProductsContainer from '../components/productsContainer'
import sanityClient from '../lib/sanity'
import Layout from '../components/layout/layout'

export default function Home ({ allProductsData, navCategories }) {
  return (
    <div>
      <Layout navCategories={navCategories}>
        <ProductsContainer products={allProductsData} />
      </Layout>
    </div>
  )
}

export const getStaticProps = async () => {
  let query = `*[_type == 'product']{ slug, _createdAt, title, defaultProductVariant}`
  const allProductsData = await sanityClient.fetch(query)

  let catQuery = `*[_type == "category" && isOnNav == true]{title}`
  const navCategories = await sanityClient.fetch(catQuery)

  return {
    props: { allProductsData, navCategories } // will be passed to the page component as props
  }
}
