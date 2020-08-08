// import Head from 'next/head'
import sanityClient from '../../lib/sanity'
import ProductsContainer from '../../components/productsContainer'

export default function Post({ productsData }) {
    return (
        <div>
            <ProductsContainer products={productsData} />
        </div>
    )
}

export async function getStaticPaths() {
    let query = `*[_type == 'category']{title}`
    const categories = await sanityClient.fetch(query)
    const paths = categories.map(item => (
        {
            params: {
                category: item.title
            }
        }
    ))
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    let query = `*[_type == "category" && title == '${params.category}']{
        _id,
        "products": *[_type == "product" && references(^._id)]
        {slug, _createdAt, title, defaultProductVariant}
      }[0]`

    const result = await sanityClient.fetch(query)

    return {
        props: {
            productsData: result.products
        }
    }
}