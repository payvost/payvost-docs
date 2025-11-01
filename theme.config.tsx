import React from 'react'

const config = {
  // Allowed by nextra-theme-docs v4 LayoutProps
  docsRepositoryBase: 'https://github.com/payvost/payvost-docs/tree/main',
  navbar: (
    <div className="nx-flex nx-items-center nx-justify-between nx-gap-4">
      <span className="nx-font-semibold">Payvost</span>
      <div className="nx-flex nx-gap-4">
        <a
          className="nx-text-sm nx-text-current hover:nx-underline"
          href="https://github.com/payvost/payvost-docs"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          className="nx-text-sm nx-text-current hover:nx-underline"
          href="https://discord.gg/payvost"
          target="_blank"
          rel="noreferrer"
        >
          Chat
        </a>
      </div>
    </div>
  ),
  footer: <span>© {new Date().getFullYear()} Payvost. All rights reserved.</span>,
}

export default config
