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

export default function HeroSection ({ heroSection }) {
  const {
    buttonText,
    description = [],
    heroButtonCategory,
    heroImage,
    title
  } = heroSection

  return (
    <div className='relative h-cover'>
      <div className='z-0 absolute inset-y-20 left-0'>
        {heroImage && (
          <div>
            <img
              className='w-full h-cover object-cover object-center'
              src={urlFor(heroImage)
                .width(1800)
                .url()}
              alt={title || 'Featured promotion'}
              /* The hero is the largest above-the-fold image, so it is the
                 Largest Contentful Paint element. Eager and high priority
                 rather than lazy. */
              loading='eager'
              fetchPriority='high'
              width='1800'
              height='640'
            />
          </div>
        )}
      </div>

      <main className='absolute mx-10 mt-10 w-2/3 max-w-2xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 bg-gray-100/25 backdrop-blur-sm'>
        <div className='sm:text-center lg:text-left p-6'>
          <h1 className='text-4xl tracking-tight leading-10 font-bold text-gray-800 sm:text-5xl sm:leading-none md:text-6xl'>
            {title}
          </h1>
          <div className='mt-3 text-base pr-60 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-gray-800'>
            <PortableText
              value={description ?? []}
              components={portableTextComponents}
            />
          </div>
          <div className='mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start'>
            <div>
              <Link
                href='/categories/[category]'
                as={`/categories/${heroButtonCategory.slug.current}`}
              >
                <a className='w-full flex items-center justify-center px-2 sm:px-8 py-3 border border-transparent text-base leading-6 font-medium rounded text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10 shadow-lg'>
                  {buttonText}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
