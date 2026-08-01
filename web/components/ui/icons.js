/**
 * The icon set, inline.
 *
 * Every icon on the site is one of these. They are hand-written 24px stroke
 * paths rather than an icon package because the site uses nine of them: a
 * dependency would ship a few hundred and a font would be another origin for
 * the browser to fetch before it can paint.
 *
 * All of them are decorative — each one sits next to a text label or inside a
 * button with an aria-label — so they are hidden from assistive tech here and
 * nowhere else has to remember to do it.
 */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true'
}

function Icon ({ children, className = 'h-5 w-5', ...rest }) {
  return (
    <svg {...base} {...rest} className={className}>
      {children}
    </svg>
  )
}

export const SearchIcon = props => (
  <Icon {...props}>
    <circle cx='11' cy='11' r='7' />
    <path d='m20 20-3.5-3.5' />
  </Icon>
)

export const CartIcon = props => (
  <Icon {...props}>
    <path d='M2.5 3h2.2l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L20 7H6' />
    <circle cx='9.5' cy='19.5' r='1.4' />
    <circle cx='17' cy='19.5' r='1.4' />
  </Icon>
)

export const HeartIcon = ({ filled = false, ...props }) => (
  <Icon {...props} fill={filled ? 'currentColor' : 'none'}>
    <path d='M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13Z' />
  </Icon>
)

export const ChevronDownIcon = props => (
  <Icon {...props}>
    <path d='m6 9 6 6 6-6' />
  </Icon>
)

export const ArrowRightIcon = props => (
  <Icon {...props}>
    <path d='M4 12h16' />
    <path d='m14 6 6 6-6 6' />
  </Icon>
)

export const MinusIcon = props => (
  <Icon {...props}>
    <path d='M5 12h14' />
  </Icon>
)

export const PlusIcon = props => (
  <Icon {...props}>
    <path d='M12 5v14M5 12h14' />
  </Icon>
)

export const TruckIcon = props => (
  <Icon {...props}>
    <path d='M2.5 6.5h10v9h-10z' />
    <path d='M12.5 9.5h4l3 3v3h-7z' />
    <circle cx='6' cy='17.5' r='1.6' />
    <circle cx='16.5' cy='17.5' r='1.6' />
  </Icon>
)

export const ReturnIcon = props => (
  <Icon {...props}>
    <path d='M3.5 10.5a8.5 8.5 0 1 1 1.6 6' />
    <path d='M3 5v5.5h5.5' />
  </Icon>
)

export const CloseIcon = props => (
  <Icon {...props}>
    <path d='m6 6 12 12M18 6 6 18' />
  </Icon>
)
