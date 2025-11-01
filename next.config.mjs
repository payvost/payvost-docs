import nextra from 'nextra'

const withNextra = nextra({
  // Nextra v4 configuration options
  staticImage: true,
  search: {
    codeblocks: false
  }
})

export default withNextra({
  // Next.js configuration
  reactStrictMode: true
})
