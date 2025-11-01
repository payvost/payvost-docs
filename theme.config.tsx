import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import InkeepSearch from './components/InkeepSearch'

const config: DocsThemeConfig = {
  logo: <span><strong>Payvost</strong></span>,
  project: {
    link: 'https://github.com/payvost/payvost-docs',
  },
  chat: {
    link: 'https://discord.gg/payvost',
  },
  docsRepositoryBase: 'https://github.com/payvost/payvost-docs/tree/main',
  footer: {
    content: <span>© {new Date().getFullYear()} Payvost. All rights reserved.</span>,
  },
  head: () => (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Payvost Documentation" />
      <meta property="og:description" content="Developer documentation for Payvost payment platform" />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
  search: {
    component: <InkeepSearch />,
  },
}

export default config
