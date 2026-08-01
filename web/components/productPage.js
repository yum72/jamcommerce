import { useDispatch } from 'react-redux'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'
import { PortableText } from '@portabletext/react'
import ImageGallery from 'react-image-gallery'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { addToCart } from '../redux/cartSlice'
import { toast } from 'react-toastify'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

// @sanity/block-content-to-react was deprecated in favour of @portabletext/react.
// "serializers" became "components", and each renderer receives { value }
// instead of { node }.
const portableTextComponents = {
  types: {
    code: ({ value }) => (
      <pre data-language={value.language}>
        <code>{value.code}</code>
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

  // Only the fields the cart actually renders. Storing the whole product
  // document would put a page's worth of Portable Text into localStorage.
  const cartItem = {
    _id,
    slug,
    _createdAt,
    title,
    defaultProductVariant
  }

  const [count, setCount] = useState(1)
  const [sitePath, setsitePath] = useState('')

  const sliderImages = defaultProductVariant.images.map(image => {
    let original = urlFor(image)
      .width(1200)
      .url()
    let thumbnail = urlFor(image)
      .width(300)
      .url()
    return {
      original,
      thumbnail,
      // react-image-gallery renders its own img tags, so alt text has to be
      // handed to it here rather than set in the markup.
      originalAlt: title,
      thumbnailAlt: title
    }
  })

  let { price } = defaultProductVariant

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let path = location.protocol + '//' + location.host
      setsitePath(path)
    }
  }, [])

  const handleDecrease = () => {
    if (count > 1) setCount(count - 1)
  }

  const handleIncrease = () => setCount(count + 1)

  const handleAddToCart = () => {
    dispatch(addToCart({ ...cartItem, count }))
    toast.success('Added to cart')
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row'>
        <div className='py-5 flex-1 w-auto sm:px-4'>
          {defaultProductVariant.images && (
            <ImageGallery
              items={sliderImages}
              showPlayButton={false}
              // additionalClassNameclassName={'h-24'}
            />
          )}
        </div>
        <div className='py-2 flex-1 '>
          <h1 className='text-4xl text-gray-800'>{title}</h1>
          <div className='text-3xl font-semibold text-gray-700'>${price}</div>
          <div className='pt-4 text-2xl text-gray-700'>{blurb.en}</div>
          <div className='pt-2 pt-4text-base text-gray-600'>
            <PortableText
              value={body.en ?? []}
              components={portableTextComponents}
            />
          </div>
          {/* <div>Vendor: {vendor.title}</div>
          <div>Tag: {tags}</div> */}
          <div className='text-lg pt-4 text-gray-700 font-semibold'>
            {categories.length > 1 ? 'Categories: ' : 'Category: '}
            {categories.map((category, i) => (
              <Link
                key={category.title}
                href='/categories/[category]'
                as={`/categories/${category.slug.current}`}
              >
                {categories.length > i + 1 ? (
                  <a className='text-red-500'>{category.title}, </a>
                ) : (
                  <a className='text-red-500'>{category.title}</a>
                )}
              </Link>
            ))}
          </div>
          <div className='flex mt-10'>
            <div className='my-auto py-1 px-2 mr-2 w-32 border border-gray-700 rounded flex'>
              <button
                aria-label='Decrease quantity'
                className='my-auto mx-2 w-4 text-xl leading-6 font-bold text-gray-800 focus:outline-none transition duration-150 ease-in-out'
                onClick={handleDecrease}
              >
                -
              </button>
              <input
                aria-label='Quantity'
                value={count}
                readOnly
                className='w-10 text-center h-10 bg-gray-100 my-auto tracking-wider focus:outline-none'
              />
              <button
                aria-label='Increase quantity'
                className='my-auto mx-2 w-4 text-lg leading-6 font-bold text-gray-800 focus:outline-none transition duration-150 ease-in-out'
                onClick={handleIncrease}
              >
                +
              </button>
            </div>
            {/* The data-item-* attributes are Snipcart's. They are harmless
                without a key configured, and let the same button drive a
                Snipcart checkout for anyone who sets one up. The click handler
                is what fills the built-in cart, so the store works with no
                third-party account. */}
            <button
              data-item-id={_id}
              data-item-price={price}
              data-item-url={sitePath + '/item/' + slug.current}
              data-item-description={blurb.en}
              data-item-image={sliderImages[0].thumbnail}
              data-item-name={title}
              className='w-full flex items-center justify-center sm:px-8 py-4 border border-transparent text-sm sm:text-base leading-6 font-medium rounded text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition duration-150 ease-in-out md:text-lg md:px-10 shadow-lg'
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
