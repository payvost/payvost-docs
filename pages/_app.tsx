import type { AppProps } from 'next/app'
import 'nextra-theme-docs/style.css'
import ChatGPTSearch from '../components/ChatGPTSearch'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ChatGPTSearch />
    </>
  )
}

export default MyApp
