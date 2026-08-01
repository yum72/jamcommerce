import ProductsContainer from '../components/productsContainer'
import sanityClient from '../lib/sanity'
import { getLayoutProps } from '../lib/layoutData'
import Layout from '../components/layout/layout'
import HeroSection from '../components/home/heroSection'
import CategoryRail from '../components/home/categoryRail'
import CategoriesSection from '../components/home/categoriesSection'

export default function Home ({
  allProductsData,
  heroSection,
  categoriesSectionData,
  popularCategories,
  ...layout
}) {
  return (
    <Layout
      title={null}
      description={
        heroSection?.title
          ? `${heroSection.title}. Shop cameras, phones and more, with photos, prices and details for every product.`
          : 'Shop cameras, phones and more, with photos, prices and details for every product.'
      }
      path='/'
      flush
      {...layout}
    >
      <div className='pt-6'>
        <HeroSection heroSection={heroSection} />
      </div>
      <CategoryRail categories={popularCategories} />
      <ProductsContainer products={allProductsData} title='New in' />
      <CategoriesSection categoriesSectionData={categoriesSectionData} />
    </Layout>
  )
}

export const getStaticProps = async () => {
  // "category" as a plain string is all a card renders, so the whole array of
  // resolved category documents does not need to travel with every product.
  const productFields = `_id, slug, _createdAt, title, defaultProductVariant, "category": categories[0]->title`

  const [
    allProductsData,
    heroSection,
    categoriesSectionData,
    popularCategories,
    layout
  ] = await Promise.all([
    sanityClient.fetch(
      `*[_type == 'product'] | order(_createdAt desc){${productFields}}[0...8]`
    ),
    sanityClient.fetch(
      `*[_type == "heroSection" && isActive == true]{title, buttonText, description, heroImage, heroButtonCategory[0]->{title, slug}}[0]`
    ),
    sanityClient.fetch(
      `*[_type == "category" && isOnNav == true]{
        "products": *[_type == "product" && references(^._id)]{${productFields}}[0...4],
        "category": {slug{current}, title}
      }`
    ),
    // Only categories that actually have something in them, biggest first, each
    // with a real product photo and a real count. The old flat list linked to
    // several categories that led to an empty page.
    sanityClient.fetch(
      `*[_type == "category" && count(*[_type == "product" && references(^._id)]) > 0]{
        title,
        "slug": slug.current,
        "count": count(*[_type == "product" && references(^._id)]),
        "image": *[_type == "product" && references(^._id)][0].defaultProductVariant.images[0]
      } | order(count desc)[0...6]`
    ),
    getLayoutProps()
  ])

  return {
    props: {
      allProductsData,
      heroSection: heroSection ?? null,
      categoriesSectionData,
      popularCategories,
      ...layout
    }
  }
}
