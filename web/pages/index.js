// import Head from 'next/head'
import ProductsContainer from '../components/productsContainer'
import sanityClient from '../lib/sanity'
import Layout from '../components/layout/layout'
import HeroSection from '../components/home/heroSection'
import CategoriesSection from '../components/home/categoriesSection'

export default function Home ({
  allProductsData,
  navCategories,
  heroSection,
  categoriesSectionData,
  subCategories
}) {
  return (
    <div>
      <Layout
        title={null}
        description={heroSection?.title
          ? `${heroSection.title}. Shop cameras, phones and more, with photos, prices and details for every product.`
          : 'Shop cameras, phones and more, with photos, prices and details for every product.'}
        path='/'
        navCategories={navCategories}
        subCategories={subCategories}
      >
        <HeroSection heroSection={heroSection} />
        <CategoriesSection categoriesSectionData={categoriesSectionData} />
        <ProductsContainer
          products={allProductsData}
          title={'Latest Products'}
        />
      </Layout>
      <style jsx>{`
        .snipcart-cart-button--highlight {
          background: none;
          background-color: black;
        }
      `}</style>
    </div>
  )
}

export const getStaticProps = async () => {
  let query = `*[_type == 'product']{ slug, _createdAt, title, defaultProductVariant}[0...10]`
  const allProductsData = await sanityClient.fetch(query)

  let catQuery = `*[_type == "category" && isOnNav == true]{slug, title}`
  const navCategories = await sanityClient.fetch(catQuery)

  let heroSectionQuery = `*[_type == "heroSection" && isActive == true]{title, buttonText, description, heroImage, heroButtonCategory[0]->{title, slug}}[0]`
  const heroSection = await sanityClient.fetch(heroSectionQuery)

  let categoriesSectionDataQuery = `*[_type == "category" && isOnNav == true]{
    "products": *[_type == "product" && references(^._id)]
    {slug, _createdAt, title, defaultProductVariant}[0...5],
    "category": {slug{current}, title}
  }`
  const categoriesSectionData = await sanityClient.fetch(
    categoriesSectionDataQuery
  )

  let subCategoriesQuery = `*[_type == "category" && defined(parents)]{title, slug}`
  const subCategories = await sanityClient.fetch(subCategoriesQuery)

  return {
    props: {
      allProductsData,
      navCategories,
      heroSection,
      categoriesSectionData,
      subCategories
    } // will be passed to the page component as props
  }
}
