import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'
import { useDispatch } from 'react-redux'
import { addToCart, removeOneFromCart, removeAllFromCart } from '../redux/cartSlice'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source)
}

export default function CartItem ({ product }) {
  const dispatch = useDispatch()
  const { slug, title, defaultProductVariant, count } = product
  const oneProduct = { ...product, count: 1 }

  const handleChangeEvent = e => {
    console.log(e.target.value)
  }

  let { price } = defaultProductVariant
  return (
    <div>
      <div className='flex flex-wrap flex-row'>
        <div className='flex-initial w-48 p-4'>
          {defaultProductVariant.images && (
            <div className='relative pb-40'>
              <Link href='/item/[slug]' as={`/item/${slug.current}`}>
                <img
                  className='absolute h-full w-full object-cover cursor-pointer'
                  src={urlFor(defaultProductVariant.images[0])
                    .width(300)
                    .url()}
                  alt={title}
                  loading='lazy'
                  width='300'
                  height='300'
                />
              </Link>
            </div>
          )}
        </div>

        <div className='py-4 flex flex-col'>
          <div className='mr-2 mx-2 w-auto text-2xl text-gray-700 font-semibold truncate'>
            <Link href='/item/[slug]' as={`/item/${slug.current}`}>
              <a className=''>{title}</a>
            </Link>
          </div>
          <div className='my-auto mx-2 w-32 border border-gray-700 rounded flex'>
            <button
              className='my-auto mx-2 w-8 text-xl leading-6 font-bold text-gray-800 focus:outline-none transition duration-150 ease-in-out'
              onClick={() => dispatch(removeOneFromCart(oneProduct))}
            >
              -
            </button>
            <input
              value={count}
              readOnly={true}
              className='w-10 text-center h-10 bg-gray-100 my-auto tracking-wider focus:outline-none'
            ></input>
            <button
              className='my-auto mx-2 w-8 text-lg leading-6 font-bold text-gray-800 focus:outline-none transition duration-150 ease-in-out'
              onClick={() => dispatch(addToCart(oneProduct))}
            >
              +
            </button>
          </div>
          <button
            className='my-2 sm:my-auto  w-32 mx-2 text-lg border-red-500 border-solid border font-semibold p-3 leading-4 rounded text-red-500 hover:bg-red-500 hover:text-white focus:outline-none transition duration-150 ease-in-out'
            onClick={() => dispatch(removeAllFromCart(product))}
          >
            Remove
          </button>
        </div>

        {/* <div className='my-auto'>Quantity: {count}</div> */}
        <div className='text-right w-48 my-auto ml-auto font-semibold text-lg text-gray-600'>
          <div className='mx-auto'>
            {price}$ x {count} :{' '}
            <span className='text-xl text-gray-800'>
              ${(price * count).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
