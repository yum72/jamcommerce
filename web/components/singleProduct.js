import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

export default function SingleProduct ({ product }) {
  const { slug, title, defaultProductVariant } = product

  let { price } = defaultProductVariant
  return (
    <div>
      <div className='bg-white rounded-md overflow-hidden shadow hover:shadow-lg w-64 m-2 flex-1'>
        {defaultProductVariant.images && (
          <div className='relative pb-64'>
            <Link href='/item/[slug]' as={`/item/${slug.current}`}>
              <img
                className='absolute h-full w-full object-cover cursor-pointer'
                src={urlFor(defaultProductVariant.images[0])
                  .width(300)
                  .url()}
                alt={title}
                loading='lazy'
                width='300'
                height='300'
              />
            </Link>
          </div>
        )}
        <div className='py-2 px-4'>
          <div>
            <Link href='/item/[slug]' as={`/item/${slug.current}`}>
              <a className='font-semibold text-lg truncate'>{title}</a>
            </Link>
          </div>
          <div className='text-md text-gray-600'>${price}</div>
        </div>
      </div>
    </div>
  )
}
