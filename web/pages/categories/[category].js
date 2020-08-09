import sanityClient from '../../lib/sanity'
import ProductsContainer from '../../components/productsContainer'
import Layout from '../../components/layout/layout'

export default function Post({ productsData, navCategories }) {
    return (
        <Layout navCategories={navCategories}>
            <ProductsContainer products={productsData} />
        </Layout>
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

    let catQuery = `*[_type == "category" && isOnNav == true]{title}`
    const navCategories = await sanityClient.fetch(catQuery)

    return {
        props: {
            productsData: result.products,
            navCategories
        }
    }
}