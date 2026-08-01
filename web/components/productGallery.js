import { useState } from 'react'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

/**
 * Product images: one large tile, a row of thumbnails under it.
 *
 * This replaces react-image-gallery, which was a dependency and a stylesheet
 * for what is a piece of state and a list of buttons. Its own CSS also fought
 * the theme at every turn — fixed colours, its own arrow chrome, its own
 * thumbnail borders — so matching the design meant overriding more of it than
 * was left of it.
 *
 * The thumbnails are buttons in a tablist, so the arrow keys move between them.
 *
 * On a desktop the tile is sized against the viewport rather than the column,
 * so that the photograph, the title, the price and the buttons all land above
 * the fold. A square tile in a half-width column is 660px tall on a 1440px
 * screen, which pushed the price off the bottom of a laptop display.
 */
export default function ProductGallery ({ images = [], title }) {
  const [index, setIndex] = useState(0)

  if (images.length === 0) return null

  const active = images[Math.min(index, images.length - 1)]

  return (
    <div>
      <div className='overflow-hidden rounded-3xl bg-tile'>
        <img
          src={urlFor(active).width(1200).url()}
          alt={title}
          width='1200'
          height='1200'
          /* The product photo is the largest element above the fold on this
             page, so it is the LCP element: fetched eagerly, not lazily. */
          loading='eager'
          fetchPriority='high'
          className='aspect-square w-full object-cover lg:aspect-auto lg:h-[clamp(20rem,calc(100dvh-19rem),34rem)]'
        />
      </div>

      {images.length > 1 && (
        <div
          role='tablist'
          aria-label={`${title} images`}
          className='mt-4 flex gap-3 overflow-x-auto pb-1'
        >
          {images.map((image, i) => (
            <button
              key={image._key ?? i}
              type='button'
              role='tab'
              aria-selected={i === index}
              aria-label={`${title}, image ${i + 1} of ${images.length}`}
              onClick={() => setIndex(i)}
              className={`shrink-0 overflow-hidden rounded-2xl bg-tile transition ${
                i === index
                  ? 'ring-2 ring-forest-900'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={urlFor(image).width(240).url()}
                alt=''
                width='120'
                height='120'
                loading='lazy'
                className='h-16 w-16 object-cover sm:h-20 sm:w-20'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
