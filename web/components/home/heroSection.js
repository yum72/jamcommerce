import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import sanityClient from '../../lib/sanity'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

const portableTextComponents = {
  types: {
    code: ({ value }) => (
      <pre data-language={value.language}>
        <code>{value.code}</code>
      </pre>
    )
  }
}

/**
 * Home page hero.
 *
 * Rebuilt as a single stacking context: the image fills the section, a gradient
 * scrim sits over it, and the copy sits on top in normal flow. The previous
 * version positioned the image at `inset-y-20` and floated a fixed-width panel
 * over it absolutely, so the two drifted apart at most widths and the panel
 * covered the subject of the photo.
 *
 * The scrim matters beyond looks: hero images come from the CMS and can be any
 * colour, so dark text over a raw photo is a coin flip. White on a gradient is
 * legible whatever gets uploaded.
 */
export default function HeroSection ({ heroSection }) {
  const {
    buttonText,
    description = [],
    heroButtonCategory,
    heroImage,
    title
  } = heroSection

  return (
    <section className='relative isolate overflow-hidden rounded-3xl shadow-xl'>
      {heroImage && (
        <img
          className='absolute inset-0 -z-10 h-full w-full object-cover object-center'
          src={urlFor(heroImage).width(1800).url()}
          alt={title || 'Featured promotion'}
          /* The hero is the largest above-the-fold image, so it is the Largest
             Contentful Paint element. Eager and high priority, not lazy. */
          loading='eager'
          fetchPriority='high'
          width='1800'
          height='700'
        />
      )}

      {/* Strong on the left where the copy sits, clearing towards the right so
          the photograph is still the photograph. */}
      <div className='absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/85 via-gray-950/60 to-gray-950/10' />

      <div className='flex min-h-[26rem] items-center px-6 py-16 sm:px-10 md:min-h-[34rem] md:px-16'>
        <div className='max-w-xl'>
          <span className='inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase ring-1 ring-white/25 ring-inset backdrop-blur-sm'>
            Featured
          </span>

          <h1 className='mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl'>
            {title}
          </h1>

          <div className='mt-5 text-lg leading-relaxed text-gray-200 md:text-xl'>
            <PortableText
              value={description ?? []}
              components={portableTextComponents}
            />
          </div>

          {heroButtonCategory?.slug?.current && (
            <Link
              href={`/categories/${heroButtonCategory.slug.current}`}
              className='group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 md:text-lg'
            >
              {buttonText || 'Shop now'}
              <span
                aria-hidden='true'
                className='transition-transform group-hover:translate-x-1'
              >
                &rarr;
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
