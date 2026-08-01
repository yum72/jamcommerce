import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../../lib/sanity'
import Price from '../ui/price'
import { SearchIcon } from '../ui/icons'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

const MAX_RESULTS = 6

/**
 * Header search.
 *
 * Every product is already in the page payload, so this filters an array in
 * memory instead of calling an API: results appear on the keystroke, offline,
 * with no loading state to design. That is only affordable because the site is
 * statically generated — the index was built at deploy time along with the
 * pages.
 *
 * Implemented as a listbox rather than a plain input so the arrow keys work:
 * a search field that only responds to the mouse is a search field half the
 * people who use it cannot reach.
 */
export default function SearchBox ({ products = [], className = '' }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const containerRef = useRef(null)

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []

    return products
      .filter(product => {
        const haystack = `${product.title} ${product.category ?? ''}`.toLowerCase()
        return haystack.includes(needle)
      })
      .slice(0, MAX_RESULTS)
  }, [products, query])

  // Reset the highlight whenever the result set changes, so Enter never fires
  // the item that happened to be highlighted for the previous query.
  useEffect(() => setActive(0), [results.length, query])

  useEffect(() => {
    const onPointerDown = event => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const go = product => {
    setOpen(false)
    setQuery('')
    router.push(`/item/${product.slug}`)
  }

  const onKeyDown = event => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!results.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive(i => (i + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive(i => (i - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      go(results[active])
    }
  }

  const showPanel = open && query.trim().length > 0

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <SearchIcon className='pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-muted' />

      <input
        type='search'
        value={query}
        onChange={event => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder='Search products'
        aria-label='Search products'
        role='combobox'
        aria-expanded={showPanel}
        aria-controls='search-results'
        aria-autocomplete='list'
        className='h-11 w-full rounded-full bg-tile pr-4 pl-11 text-sm text-ink placeholder:text-ink-muted focus:bg-white focus:ring-1 focus:ring-forest-900 focus:outline-none'
      />

      {showPanel && (
        <div
          id='search-results'
          role='listbox'
          className='absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-xl'
        >
          {results.length === 0 ? (
            <p className='px-4 py-6 text-center text-sm text-ink-muted'>
              Nothing matches “{query.trim()}”.
            </p>
          ) : (
            <ul>
              {results.map((product, index) => (
                <li key={product.id}>
                  <Link
                    href={`/item/${product.slug}`}
                    role='option'
                    aria-selected={index === active}
                    onClick={() => {
                      setOpen(false)
                      setQuery('')
                    }}
                    onMouseEnter={() => setActive(index)}
                    className={`flex items-center gap-3 px-3 py-2.5 ${
                      index === active ? 'bg-forest-50' : ''
                    }`}
                  >
                    {product.image && (
                      <img
                        src={urlFor(product.image).width(96).height(96).url()}
                        alt=''
                        width='48'
                        height='48'
                        className='h-12 w-12 shrink-0 rounded-lg bg-tile object-cover'
                      />
                    )}
                    <span className='min-w-0 flex-1'>
                      <span className='block truncate text-sm font-semibold'>
                        {product.title}
                      </span>
                      {product.category && (
                        <span className='block truncate text-xs text-ink-muted'>
                          {product.category}
                        </span>
                      )}
                    </span>
                    <Price value={product.price} className='text-sm' />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
