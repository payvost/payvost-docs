import type { AppProps } from 'next/app'
import ChatGPTSearch from '../components/ChatGPTSearch'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ChatGPTSearch />
    </>
  )
}
