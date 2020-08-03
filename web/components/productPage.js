// import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'
import BlockContent from '@sanity/block-content-to-react'

function urlFor(source) {
    return imageUrlBuilder(sanityClient).image(source)
}

const serializers = {
    types: {
        code: props => (
            <pre data-language={props.node.language}>
                <code>{props.node.code}</code>
            </pre>
        )
    }
}

export default function ProductPage({ product }) {
    const { _createdAt, blurb, body = [], defaultProductVariant, tags, title, vendor, categories } = product

    let {
        price,
        images
    } = defaultProductVariant
    return (
        <div>
            <div className="card">
                {defaultProductVariant.images && (
                    <div>
                        <img
                            src={urlFor(images[0])
                                .width(300)
                                .url()}
                        />
                    </div>
                )}
                <div>
                    {title}
                </div>
                <div>
                    Category: {categories.map(category => (
                    <>{category.title}, </>
                ))}
                </div>
                <div>
                    {_createdAt}
                </div>
                <div>
                    Price: {price}$
                </div>
                <div>
                    {blurb.en}
                </div>
                <BlockContent
                    blocks={body.en}
                    imageOptions={{ w: 320, h: 240, fit: 'max' }}
                    serializers={serializers}
                />
                {/* <div>
                    {toPlainText(body.en)}
                </div> */}
                <div>
                    Vendor: {vendor.title}
                </div>
                <div>
                    Tag: {tags}
                </div>
            </div>
            <style jsx>{`
                .card {
                    width: 300px;
                    height: 400px;
                    text-align:center;
                    padding 20px;
                }
                img {
                    object-fit: cover;
                    width: 100%;
                    height: 300px;
                    max-width: 300px;
                    background: beige;
                    background: linear-gradient(top, rgba(0, 0, 0, 0) 100px, #fa8072 100px);
                }
            `}</style>
        </div>
    )
}

