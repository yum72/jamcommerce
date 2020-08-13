import Link from 'next/link'
import { useSelector } from 'react-redux'

export default function NavigationHeader ({ navCategories }) {
  const cartItems = useSelector(state => state.cart.count)
  return (
    <div>
      <nav>
        <Link href='/'>
          <a>Home</a>
        </Link>
        {navCategories
          ? navCategories.map(category => (
              <Link
                key={category.title}
                href='/categories/[category]'
                as={`/categories/${category.title}`}
              >
                <a>{category.title}</a>
              </Link>
            ))
          : null}
        <Link href='/cart'>
          <a>Cart({cartItems})</a>
        </Link>
      </nav>

      <style jsx>{`
        nav {
          display: flex;
          align-items: center;
          width: 100%;
          font-size: 1rem;
          height: 3.5rem;
          margin-bottom: 20px;
        }
        nav a {
          flex-grow: 1;
          text-decoration: none;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
