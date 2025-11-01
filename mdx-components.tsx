import type { MDXComponents } from 'nextra/mdx-components'

// Customize or extend MDX components used in .mdx pages
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Add/override components here, e.g.
    // h1: (props) => <h1 {...props} className="nx-text-3xl nx-font-bold" />,
    ...components
  }
}
