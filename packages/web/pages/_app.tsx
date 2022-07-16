import '../styles/globals.css'
import type { AppProps } from 'next/app'
import App from '../components/App'
import "@rainbow-me/rainbowkit/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <App>
      <Component {...pageProps} />
    </App>
  )
}

export default MyApp
