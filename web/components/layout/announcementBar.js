import Link from 'next/link'
import { TruckIcon, ReturnIcon } from '../ui/icons'

/**
 * The strip above the header.
 *
 * The promo in the middle is the live hero campaign from the CMS, not hardcoded
 * copy — the same document that sets the home page hero sets this, so switching
 * the campaign in the studio changes both. Nothing renders in that slot when no
 * campaign is active, rather than a placeholder.
 */
export default function AnnouncementBar ({ promo }) {
  const category = promo?.heroButtonCategory?.slug?.current

  return (
    <div className='bg-forest-900 text-white'>
      <div className='mx-auto flex max-w-shell flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2.5 text-[13px] sm:px-6 lg:justify-between lg:px-10'>
        <p className='hidden items-center gap-2 text-white/70 lg:flex'>
          <TruckIcon className='h-4 w-4' />
          Free delivery over $500
        </p>

        {promo?.text && (
          <p className='flex items-center gap-2 text-center'>
            <span className='font-semibold'>{promo.text}</span>
            {category && (
              <Link
                href={`/categories/${category}`}
                className='shrink-0 font-semibold text-cream-100 underline underline-offset-4 hover:text-white'
              >
                Shop now
              </Link>
            )}
          </p>
        )}

        <p className='hidden items-center gap-2 text-white/70 lg:flex'>
          <ReturnIcon className='h-4 w-4' />
          30-day returns
        </p>
      </div>
    </div>
  )
}
