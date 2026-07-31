import Head from 'next/head'
import NavigationHeader from './navigationHeader'
import Footer from './footer'

export default function Layout (props) {
  return (
    <div className='bg-gray-100 antialiased text-gray-900'>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>Store</title>
      </Head>
      <div className='max-w-ultra-wide mx-auto min-h-screen'>
        <NavigationHeader
          navCategories={props.navCategories}
          subCategories={props.subCategories}
        />
        <div id='main' className='px-10 py-6'>
          {props.children}
        </div>
        <Footer />
      </div>
    </div>
  )
}
