// import Head from 'next/head'
import sanityClient from '../../lib/sanity'
import ProductPage from '../../components/productPage'

export default function Post({ productData }) {
    return (
        <div>
            <ProductPage product={productData} />
        </div>
    )
}

export async function getStaticPaths() {
    let query = `*[_type == 'product']{ slug }`
    const slugs = await sanityClient.fetch(query)
    const paths = slugs.map(item => (
        {
            params: {
                slug: item.slug.current
            }
        }
    ))
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    let query = `*[slug.current == '${params.slug}'] {_createdAt, blurb, body, defaultProductVariant, tags, title, vendor->{title}, categories[]->{title}}`
    const productData = await sanityClient.fetch(query)

    return {
        props: {
            productData: productData[0]
        }
    }
}