import Link from "next/link"

export default function NavigationHeader({ navCategories }) {
    return (
        <div>
            <nav>
                <Link href="/">
                    <a>Home</a>
                </Link>
                {navCategories ? navCategories.map(category => (
                    <Link key={category.title} href="/categories/[category]" as={`/categories/${category.title}`}>
                        <a>{category.title}</a>
                    </Link>
                )) : null}
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
        </div >
    )
}