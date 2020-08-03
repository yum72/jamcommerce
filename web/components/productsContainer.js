import SingleProduct from './singleProduct'

export default function ProductsContainer({ products }) {
    return (
        <div>
            <div className="productsContainer">
                {products.map(product => (
                    <SingleProduct key={product.slug.current} product={product} />
                ))}
            </div>

            <style jsx>{`
                .productsContainer {
                    display: flex;
                    flex-wrap:  wrap;
                }
            `}</style>
        </div>
    )
}