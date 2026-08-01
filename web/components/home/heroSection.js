import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import sanityClient from '../../lib/sanity'
import { ArrowRightIcon } from '../ui/icons'

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
 * A two-column panel on warm cream: copy on the left, the campaign photograph
 * filling the right. The previous version laid the copy over the image behind a
 * dark scrim, which meant the headline's legibility depended on whatever
 * photograph someone uploaded that week, and the scrim had to be heavy enough
 * for the worst case — so it dimmed every image to protect against one.
 *
 * Splitting them removes the coupling. Dark green type sits on a colour this
 * file controls, and the photograph is shown at full strength.
 */
export default function HeroSection ({ heroSection }) {
  if (!heroSection) return null

  const {
    buttonText,
    description = [],
    heroButtonCategory,
    heroImage,
    title
  } = heroSection

  return (
    <section className='overflow-hidden rounded-3xl bg-cream-100'>
      <div className='grid items-stretch md:grid-cols-2'>
        <div className='order-2 flex flex-col justify-center px-6 py-12 sm:px-10 md:order-1 md:py-16 lg:px-14 lg:py-20'>
          <h1 className='font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-forest-900 sm:text-5xl lg:text-6xl'>
            {title}
          </h1>

          <div className='mt-5 max-w-md text-lg leading-relaxed text-forest-900/70'>
            <PortableText
              value={description ?? []}
              components={portableTextComponents}
            />
          </div>

          {heroButtonCategory?.slug?.current && (
            <Link
              href={`/categories/${heroButtonCategory.slug.current}`}
              className='btn btn-primary group mt-9 self-start px-9 py-4 text-base'
            >
              {buttonText || 'Shop now'}
              <ArrowRightIcon className='h-5 w-5 transition-transform group-hover:translate-x-1' />
            </Link>
          )}
        </div>

        {heroImage && (
          <div className='order-1 md:order-2'>
            <img
              className='h-56 w-full object-cover object-center sm:h-72 md:h-full md:min-h-[26rem]'
              src={urlFor(heroImage).width(1400).url()}
              alt={title || 'Featured promotion'}
              /* The hero is the largest above-the-fold image, so it is the
                 Largest Contentful Paint element. Eager and high priority,
                 not lazy. */
              loading='eager'
              fetchPriority='high'
              width='1400'
              height='900'
            />
          </div>
        )}
      </div>
    </section>
  )
}
