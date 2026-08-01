import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

export default function SingleProduct ({ product }) {
  const { slug, title, defaultProductVariant } = product
  const { price } = defaultProductVariant

  return (
    // One link wrapping the whole card rather than separate links on the image
    // and the title. Two links to the same place is one large target split into
    // two small ones, and it was part of what produced the nested anchors.
    <Link
      href={`/item/${slug.current}`}
      className='group block w-64 flex-none overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900'
    >
      {defaultProductVariant.images && (
        <div className='relative aspect-square overflow-hidden bg-gray-100'>
          <img
            className='h-full w-full object-cover transition duration-300 group-hover:scale-105'
            src={urlFor(defaultProductVariant.images[0]).width(400).url()}
            alt={title}
            loading='lazy'
            width='400'
            height='400'
          />
        </div>
      )}

      <div className='px-4 py-3'>
        <h3 className='truncate font-semibold text-gray-900 group-hover:text-gray-700'>
          {title}
        </h3>
        <p className='mt-1 text-lg font-bold tracking-tight text-gray-900'>
          ${price}
        </p>
      </div>
    </Link>
  )
}
