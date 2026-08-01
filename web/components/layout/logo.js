/**
 * The wordmark. Type only.
 *
 * The previous logo was a raster PNG in navy and coral, a palette this design
 * does not contain, so it read as another company's logo pasted onto the page.
 * This is the same name set in the display face and inheriting its colour, so
 * it works on white in the header and on green in the footer without a second
 * asset. Two weights carry the whole idea: the JAM heavy, the commerce quiet.
 */
export default function Logo ({ className = '' }) {
  return (
    <span
      className={`font-display leading-none tracking-tight whitespace-nowrap ${className}`}
    >
      <span className='font-extrabold'>JAM</span>
      <span className='font-medium opacity-60'>commerce</span>
    </span>
  )
}
