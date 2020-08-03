import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'

function urlFor(source) {
    return imageUrlBuilder(sanityClient).image(source)
}

export default function SingleProduct({ product }) {
    const {
        slug,
        _createdAt,
        title,
        defaultProductVariant
    } = product

    let {
        price
    } = defaultProductVariant
    return (
        <div>
            <div className="card">
                {defaultProductVariant.images && (
                    <div>
                        <Link href="/item/[slug]" as={`/item/${slug.current}`}>
                            <img
                                src={urlFor(defaultProductVariant.images[0])
                                    .width(300)
                                    .url()}
                            />
                        </Link>
                    </div>
                )}
                <div>
                    <Link href="/item/[slug]" as={`/item/${slug.current}`}>
                        <a>{title}</a>
                    </Link>
                </div>
                {/* <div>
                    {_createdAt}
                </div> */}
                <div>
                    {price}$
                </div>
            </div>
            <style jsx>{`
                .card {
                    width: 300px;
                    height: 400px;
                    text-align:center;
                    padding 10px;
                    margin 10px;
                    outline: solid 1px;
                }
                img {
                    object-fit: cover;
                    width: 100%;
                    height: 300px;
                    max-width: 300px;
                    background: beige;
                    background: linear-gradient(top, rgba(0, 0, 0, 0) 100px, #fa8072 100px);
                    cursor: pointer;
                }
            `}</style>
        </div>
    )
}

