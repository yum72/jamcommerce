import Head from 'next/head'
import NavigationHeader from './navigationHeader'

export default function Layout (props) {
  return (
    <div>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>Store</title>
      </Head>
      <NavigationHeader navCategories={props.navCategories} />
      <div id='main'>{props.children}</div>
    </div>
  )
}
