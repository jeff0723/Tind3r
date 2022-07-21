import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Layout from 'components/Layout';
import "antd/dist/antd.css";



const AppWithoutSSR = dynamic(() => import('../components/App'), {
  ssr: false,
})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppWithoutSSR>
      <Component {...pageProps} />
    </AppWithoutSSR>
  )
}

export default MyApp
