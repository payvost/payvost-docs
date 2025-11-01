import type { AppProps } from 'next/app'
import 'nextra-theme-docs/style.css'
import { Layout } from 'nextra-theme-docs'
import themeConfig from '../theme.config'
import { getPageMap } from 'nextra/page-map'
import ChatGPTSearch from '../components/ChatGPTSearch'

function MyApp({ Component, pageProps, pageMap }: AppProps & { pageMap: any }) {
  return (
    <Layout
      {...({ ...themeConfig, footer: (themeConfig as any)?.footer?.content ?? (themeConfig as any)?.footer } as any)}
      pageMap={pageMap}
    >
      <Component {...pageProps} />
      <ChatGPTSearch />
    </Layout>
  )
}

MyApp.getInitialProps = async () => {
  const pageMap = await getPageMap()
  return { pageMap }
}

export default MyApp
