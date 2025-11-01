import type { AppProps, AppContext } from 'next/app'
import 'nextra-theme-docs/style.css'
import { Layout } from 'nextra-theme-docs'
import themeConfig from '../theme.config'
import { getPageMap } from 'nextra/page-map'
import ChatGPTSearch from '../components/ChatGPTSearch'

function MyApp({ Component, pageProps, pageMap }: AppProps & { pageMap: any }) {
  return (
    <Layout
      {...({ ...themeConfig, footer: (themeConfig as any)?.footer?.content ?? (themeConfig as any)?.footer } as any)}
      pageMap={pageMap ?? []}
    >
      <Component {...pageProps} />
      <ChatGPTSearch />
    </Layout>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  // Use the current route if available so the page map can be generated correctly
  const route = (appContext.router as any)?.asPath || appContext.ctx.asPath || appContext.ctx.pathname || '/'
  const pageMap = await getPageMap(route)
  return { pageMap }
}

export default MyApp
