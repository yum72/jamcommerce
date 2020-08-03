// import Head from 'next/head'
import ProductsContainer from '../components/productsContainer'
import sanityClient from '../lib/sanity'

export default function Home({ allProductsData }) {
    return (
        <div>
            <ProductsContainer products={allProductsData} />
        </div>
    )
}

export const getStaticProps = async () => {
    let query = `*[_type == 'product']{ slug, _createdAt, title, defaultProductVariant}`
    const allProductsData = await sanityClient.fetch(query)
    return {
        props: { allProductsData } // will be passed to the page component as props
    }
}