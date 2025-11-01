import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  // Nextra v2 configuration options
  staticImage: true,
  flexsearch: {
    codeblocks: false
  }
})

export default withNextra({
  // Next.js configuration
  reactStrictMode: true
})
