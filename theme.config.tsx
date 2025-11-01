import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span className="nx-font-semibold">Payvost</span>,
  project: {
    link: 'https://github.com/payvost/payvost-docs'
  },
  chat: {
    link: 'https://discord.gg/payvost'
  },
  docsRepositoryBase: 'https://github.com/payvost/payvost-docs/tree/main',
  footer: {
    text: <span>© {new Date().getFullYear()} Payvost. All rights reserved.</span>
  }
}

export default config
