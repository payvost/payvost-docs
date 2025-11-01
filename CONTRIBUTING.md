# Contributing to Payvost Documentation

Thank you for your interest in contributing to Payvost documentation! This guide will help you get started.

## How to Contribute

There are many ways to contribute to the Payvost documentation:

- **Fix typos or grammar**: Help us improve the quality of our documentation
- **Add examples**: Provide code examples and use cases
- **Improve clarity**: Make explanations clearer and more concise
- **Add new content**: Document new features or missing topics
- **Update outdated content**: Keep information current and accurate

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/payvost-docs.git
   cd payvost-docs
   ```

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 to see your changes in real-time

## Making Changes

### Documentation Structure

Documentation files are located in the `pages/` directory and written in MDX (Markdown with JSX).

```
pages/
├── _app.tsx          # Custom Next.js App
├── _meta.ts          # Navigation configuration
├── index.mdx         # Homepage
├── about.mdx         # About page
└── advanced/         # Nested documentation
    └── satori.mdx
```

### Writing Documentation

1. **Use clear headings**: Organize content with H2 and H3 headings
2. **Add code examples**: Include practical, working code examples
3. **Use MDX features**: Take advantage of React components when needed
4. **Keep it concise**: Write clear, concise explanations
5. **Link related content**: Cross-reference related documentation

### MDX Example

```mdx
# Page Title

Introduction paragraph with **bold** and *italic* text.

## Section Heading

Content goes here.

### Subsection

More detailed content.

\`\`\`javascript
// Code example
const example = 'Hello, World!';
console.log(example);
\`\`\`

## Next Steps

Continue to [related page](/related-page) for more information.
```

### Adding New Pages

1. Create a new `.mdx` file in the `pages/` directory
2. Add the page to `pages/_meta.ts`:

```typescript
export default {
  "index": "Introduction",
  "your-new-page": "Your New Page Title",
  // ... other pages
}
```

3. Write your content using MDX
4. Test locally to ensure it displays correctly

### Navigation Configuration

The navigation structure is defined in `pages/_meta.ts`:

```typescript
export default {
  "index": "Introduction",
  "api-reference": "API Reference",
  "guides": "Guides",
  "about": {
    "title": "About",
    "type": "page"
  }
}
```

## Code Style

- Use **2 spaces** for indentation in MDX files
- Use **meaningful names** for files (lowercase with hyphens)
- Follow the existing **code style** in examples
- Add **comments** to complex code examples

## Testing Your Changes

Before submitting a pull request:

1. **Build the site**:
   ```bash
   npm run build
   ```

2. **Test the production build**:
   ```bash
   npm start
   ```

3. **Check for errors**: Ensure there are no build errors or warnings

4. **Test navigation**: Verify all links work correctly

5. **Check responsiveness**: Test on different screen sizes

## Submitting Changes

1. Commit your changes with a clear message:
   ```bash
   git add .
   git commit -m "docs: add example for payment integration"
   ```

2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request on GitHub with:
   - **Clear title**: Describe what your PR does
   - **Description**: Explain the changes and why they're needed
   - **Screenshots**: If you made visual changes, include screenshots

### Commit Message Guidelines

Use conventional commit format:

- `docs: add payment integration guide`
- `fix: correct typo in authentication page`
- `feat: add new API endpoint documentation`
- `chore: update dependencies`

## Review Process

1. A maintainer will review your pull request
2. You may be asked to make changes
3. Once approved, your changes will be merged
4. Your contribution will be deployed automatically

## Content Guidelines

### Writing Style

- **Be clear and concise**: Get to the point quickly
- **Use active voice**: "Click the button" vs "The button should be clicked"
- **Write for developers**: Assume technical knowledge but explain concepts
- **Be inclusive**: Use gender-neutral language
- **Avoid jargon**: Explain technical terms when first used

### Code Examples

- **Keep examples simple**: Show the essential code
- **Make them runnable**: Examples should work as-is
- **Add context**: Explain what the code does
- **Use comments**: Annotate complex logic
- **Show best practices**: Demonstrate proper usage

### Links

- **Use relative links** for internal pages: `/api-reference`
- **Use absolute URLs** for external links: `https://example.com`
- **Add descriptive text**: "See the [API Reference](/api-reference)" not "click here"

## Questions?

If you have questions about contributing:

- Open an issue on GitHub
- Ask in our Discord community
- Email us at support@payvost.com

## License

By contributing to Payvost documentation, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Every contribution, no matter how small, helps make Payvost better for everyone. We appreciate your time and effort! 🎉
