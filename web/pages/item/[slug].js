import Head from 'next/head'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../../lib/sanity'
import { getLayoutProps } from '../../lib/layoutData'
import ProductPage from '../../components/productPage'
import ProductsContainer from '../../components/productsContainer'
import Layout from '../../components/layout/layout'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')

export default function Post ({ productData, similarProducts = [], ...layout }) {
  const { title, blurb, slug, defaultProductVariant, categories } = productData

  const description = blurb?.en
    ? blurb.en.slice(0, 155)
    : `${title} for $${defaultProductVariant.price}. In stock now.`

  const image = defaultProductVariant.images?.[0]
    ? imageUrlBuilder(sanityClient)
        .image(defaultProductVariant.images[0])
        .width(1200)
        .height(630)
        .url()
    : undefined

  // Product structured data. This is what gets a listing the price and
  // availability shown directly in search results rather than a plain link.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    ...(image ? { image: [image] } : {}),
    ...(defaultProductVariant.sku ? { sku: defaultProductVariant.sku } : {}),
    ...(categories?.[0] ? { category: categories[0].title } : {}),
    offers: {
      '@type': 'Offer',
      price: defaultProductVariant.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      ...(SITE_URL ? { url: `${SITE_URL}/item/${slug.current}` } : {})
    }
  }

  return (
    <Layout
      title={title}
      description={description}
      image={image}
      path={`/item/${slug.current}`}
      {...layout}
    >
      <Head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <ProductPage product={productData} />

      {similarProducts.length > 0 && (
        <ProductsContainer
          title='More like this'
          products={similarProducts}
          viewAllHref={
            categories?.[0]
              ? `/categories/${categories[0].slug.current}`
              : undefined
          }
        />
      )}
    </Layout>
  )
}

export async function getStaticPaths () {
  const slugs = await sanityClient.fetch(`*[_type == 'product']{ slug }`)
  return {
    paths: slugs.map(item => ({ params: { slug: item.slug.current } })),
    fallback: false
  }
}

export async function getStaticProps ({ params }) {
  // Parameterised rather than interpolated into the query string. A slug with a
  // quote in it used to produce a syntax error at build time.
  const productData = await sanityClient.fetch(
    `*[_type == 'product' && slug.current == $slug][0]{
      _id, slug, _createdAt, blurb, body, defaultProductVariant, tags, title,
      vendor->{title},
      categories[]->{title, slug},
      "categoryIds": categories[]._ref
    }`,
    { slug: params.slug }
  )

  const [similarProducts, layout] = await Promise.all([
    // Other products sharing at least one category, so the row is genuinely
    // related rather than whatever happened to be indexed next.
    sanityClient.fetch(
      `*[_type == 'product' && _id != $id && count((categories[]._ref)[@ in $categoryIds]) > 0]{
        _id, slug, _createdAt, title, defaultProductVariant,
        "category": categories[0]->title
      }[0...4]`,
      { id: productData._id, categoryIds: productData.categoryIds ?? [] }
    ),
    getLayoutProps()
  ])

  return {
    props: {
      productData,
      similarProducts,
      ...layout
    }
  }
}
