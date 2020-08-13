import { useDispatch } from 'react-redux'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'
import BlockContent from '@sanity/block-content-to-react'
import Link from 'next/link'
import { actions } from '../redux/cart'

function urlFor (source) {
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

export default function ProductPage ({ product }) {
  const dispatch = useDispatch()
  const {
    _id,
    _createdAt,
    blurb,
    body = [],
    defaultProductVariant,
    tags,
    title,
    vendor,
    categories,
    slug
  } = product

  const cartItem = {
    _id,
    slug,
    _createdAt,
    title,
    defaultProductVariant,
    count: 1
  }

  let { price, images } = defaultProductVariant
  return (
    <div>
      <div className='card'>
        {defaultProductVariant.images && (
          <div>
            <img
              src={urlFor(images[0])
                .width(300)
                .url()}
            />
          </div>
        )}
        <div>{title}</div>
        <div>
          Category:{' '}
          {categories.map(category => (
            <Link
              key={category.title}
              href='/categories/[category]'
              as={`/categories/${category.title}`}
            >
              <a>{category.title}, </a>
            </Link>
          ))}
        </div>
        <div>{_createdAt}</div>
        <div>Price: {price}$</div>
        <div>{blurb.en}</div>
        <BlockContent
          blocks={body.en}
          imageOptions={{ w: 320, h: 240, fit: 'max' }}
          serializers={serializers}
        />
        <div>Vendor: {vendor.title}</div>
        <div>Tag: {tags}</div>
        <button onClick={() => dispatch(actions.addToCart(cartItem))}>
          Add to cart
        </button>
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
