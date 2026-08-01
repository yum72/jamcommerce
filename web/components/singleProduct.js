import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import sanityClient from '../lib/sanity'
import { addToCart } from '../redux/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../redux/wishlistSlice'
import Price from './ui/price'
import { HeartIcon } from './ui/icons'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

/**
 * A product card.
 *
 * Every image fills a square tile edge to edge. The reference this is drawn
 * from uses products cut out on grey, where padding the image inside a tile
 * looks right; this catalogue is lifestyle photography with its own
 * backgrounds, so padding produced a photo floating in a grey frame. The
 * uniform square is what makes twelve unrelated photographs read as one grid,
 * and every source image is close enough to square that cropping to it costs
 * nothing.
 *
 * The card is not one big link. It holds three targets — the product, save, and
 * add to cart — so the link wraps only the image and the title, and the two
 * buttons sit outside it. A button nested inside an anchor is invalid HTML and
 * swallows the click before the button ever sees it.
 */
export default function SingleProduct ({ product }) {
  const dispatch = useDispatch()
  const { _id, slug, title, category, defaultProductVariant } = product
  const { price, images } = defaultProductVariant
  const saved = useSelector(selectIsWishlisted(_id))

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, count: 1 }))
    toast.success(`${title} added to cart`)
  }

  const handleToggleSave = () => {
    dispatch(toggleWishlist(product))
    toast.info(saved ? `${title} removed from saved` : `${title} saved`)
  }

  return (
    <article className='group flex w-full flex-col'>
      <div className='relative'>
        {/* Hidden from the accessibility tree because the title below links to
            the same place: one product, one stop in the tab order. */}
        <Link
          href={`/item/${slug.current}`}
          tabIndex={-1}
          aria-hidden='true'
          className='block overflow-hidden rounded-2xl bg-tile'
        >
          {images?.[0] && (
            <img
              className='aspect-square w-full object-cover transition duration-300 group-hover:scale-105'
              src={urlFor(images[0]).width(600).url()}
              alt=''
              loading='lazy'
              width='600'
              height='600'
            />
          )}
        </Link>

        <button
          type='button'
          onClick={handleToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
          className='absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:scale-110 hover:text-forest-900'
        >
          <HeartIcon
            filled={saved}
            className={`h-4.5 w-4.5 ${saved ? 'text-forest-900' : ''}`}
          />
        </button>
      </div>

      <div className='mt-4 flex items-start justify-between gap-3'>
        <h3 className='font-display text-base leading-tight font-bold'>
          <Link
            href={`/item/${slug.current}`}
            className='transition hover:text-forest-900'
          >
            {title}
          </Link>
        </h3>
        <Price value={price} className='shrink-0 text-base' />
      </div>

      {category && (
        <p className='mt-1 truncate text-sm text-ink-muted'>{category}</p>
      )}

      <button
        type='button'
        onClick={handleAddToCart}
        className='btn btn-outline mt-4 self-start px-5 py-2 text-sm'
      >
        Add to cart
      </button>
    </article>
  )
}
