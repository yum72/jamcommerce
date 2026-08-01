import Head from 'next/head'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../../lib/sanity'
import ProductPage from '../../components/productPage'
import Layout from '../../components/layout/layout'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')

export default function Post ({ productData, navCategories, subCategories }) {
  const { title, blurb, slug, defaultProductVariant } = productData

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
      navCategories={navCategories}
      subCategories={subCategories}
    >
      <Head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
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
