import '../styles/globals.css'
import type { AppProps } from 'next/app'
import App from '../components/App'
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'

const AppWithoutSSR = dynamic(() => import('../components/App'), {
  ssr: false,
})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppWithoutSSR>
      <App>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </App>
    </AppWithoutSSR>
  )
}

export default MyApp
