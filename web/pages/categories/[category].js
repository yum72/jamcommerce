import { useMemo, useState } from 'react'
import sanityClient from '../../lib/sanity'
import { getLayoutProps } from '../../lib/layoutData'
import ProductsContainer from '../../components/productsContainer'
import Breadcrumbs from '../../components/breadcrumbs'
import Layout from '../../components/layout/layout'
import { ChevronDownIcon } from '../../components/ui/icons'

const SORTS = {
  newest: {
    label: 'Newest first',
    compare: (a, b) => new Date(b._createdAt) - new Date(a._createdAt)
  },
  'price-asc': {
    label: 'Price: low to high',
    compare: (a, b) =>
      a.defaultProductVariant.price - b.defaultProductVariant.price
  },
  'price-desc': {
    label: 'Price: high to low',
    compare: (a, b) =>
      b.defaultProductVariant.price - a.defaultProductVariant.price
  },
  title: {
    label: 'Name: A to Z',
    compare: (a, b) => a.title.localeCompare(b.title)
  }
}

export default function Post ({
  productsData = [],
  category,
  categorySlug,
  ...layout
}) {
  const [sort, setSort] = useState('newest')

  // Sorted in the browser. Every product in the category is already in the page
  // payload, so re-sorting is an array operation and no rebuild or round trip —
  // which is the only reason a statically generated catalogue page can offer it
  // at all.
  const products = useMemo(
    () => [...productsData].sort(SORTS[sort].compare),
    [productsData, sort]
  )

  const count = productsData.length

  return (
    <Layout
      title={category}
      description={`Browse ${count} ${category} product${
        count === 1 ? '' : 's'
      }. Prices, photos and details for everything in the ${category} range.`}
      path={categorySlug ? `/categories/${categorySlug}` : undefined}
      {...layout}
    >
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: category }]} />

      <div className='mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6'>
        <div>
          <h1 className='font-display text-3xl font-extrabold tracking-tight sm:text-4xl'>
            {category}
          </h1>
          <p className='mt-2 text-sm text-ink-muted'>
            {count} item{count === 1 ? '' : 's'}
          </p>
        </div>

        {count > 1 && (
          <div className='relative'>
            <label htmlFor='sort' className='sr-only'>
              Sort products
            </label>
            <select
              id='sort'
              value={sort}
              onChange={event => setSort(event.target.value)}
              className='h-11 appearance-none rounded-full bg-tile pr-11 pl-5 text-sm font-semibold focus:ring-1 focus:ring-forest-900 focus:outline-none'
            >
              {Object.entries(SORTS).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className='pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2' />
          </div>
        )}
      </div>

      <ProductsContainer
        products={products}
        emptyMessage={`Nothing in ${category} yet.`}
      />
    </Layout>
  )
}

export async function getStaticPaths () {
  const categories = await sanityClient.fetch(
    `*[_type == 'category']{slug{current}}`
  )
  return {
    paths: categories.map(item => ({
      params: { category: item.slug.current }
    })),
    fallback: false
  }
}

export async function getStaticProps ({ params }) {
  // Parameterised rather than interpolated into the query string, so a slug
  // containing a quote cannot break the query at build time.
  const [result, layout] = await Promise.all([
    sanityClient.fetch(
      `*[_type == "category" && slug.current == $category][0]{
        _id,
        "products": *[_type == "product" && references(^._id)]{
          _id, slug, _createdAt, title, defaultProductVariant,
          "category": categories[0]->title
        },
        "category": {slug{current}, title}
      }`,
      { category: params.category }
    ),
    getLayoutProps()
  ])

  return {
    props: {
      productsData: result.products,
      category: result.category.title,
      categorySlug: params.category,
      ...layout
    }
  }
}
