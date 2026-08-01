/**
 * A price, set the way the reference design sets it: the currency sign and the
 * cents small and raised, the dollars full size. It is the one piece of
 * typography that appears on every card, every row of the cart and the product
 * page, so it is what makes those surfaces read as one system.
 *
 * The parts are hidden from assistive tech and an ordinary "$549.00" is exposed
 * instead, because the split markup would otherwise be announced as four
 * separate fragments.
 */
export default function Price ({ value, className = '' }) {
  const amount = Number(value) || 0
  const dollars = Math.trunc(amount)
  const cents = Math.round((amount - dollars) * 100)
    .toString()
    .padStart(2, '0')

  return (
    <span
      className={`font-display font-extrabold tracking-tight tabular-nums ${className}`}
      aria-label={`$${dollars}.${cents}`}
    >
      <span aria-hidden='true'>
        <span className='align-super text-[0.62em]'>$</span>
        {dollars.toLocaleString('en-US')}
        <span className='align-super text-[0.62em]'>.{cents}</span>
      </span>
    </span>
  )
}
