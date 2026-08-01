import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../../lib/sanity'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

/**
 * Shop by category.
 *
 * Each tile shows a real product from that category as its thumbnail and the
 * real number of items in it, both resolved at build time. A category with
 * nothing in it never reaches this component, so no tile leads to an empty
 * page — which is what the old flat category list did for half the categories
 * in the dataset.
 */
export default function CategoryRail ({ categories = [] }) {
  if (categories.length === 0) return null

  return (
    <section className='py-10'>
      <h2 className='mb-7 font-display text-2xl font-extrabold tracking-tight sm:text-3xl'>
        Shop by category
      </h2>

      <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
        {categories.map(category => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className='flex items-center gap-4 rounded-2xl border border-line bg-white p-3 transition hover:border-forest-900 hover:bg-cream-50'
          >
            {category.image && (
              <img
                src={urlFor(category.image).width(160).height(160).url()}
                alt=''
                width='80'
                height='80'
                className='h-16 w-16 shrink-0 rounded-xl bg-tile object-cover sm:h-20 sm:w-20'
              />
            )}
            <span className='min-w-0'>
              <span className='block truncate font-display font-bold'>
                {category.title}
              </span>
              <span className='block text-sm text-ink-muted'>
                {category.count} item{category.count === 1 ? '' : 's'}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
