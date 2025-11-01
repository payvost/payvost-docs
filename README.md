# Payvost Documentation

Official developer documentation for [Payvost](https://payvost.com) payment platform.

This documentation site is built with [Nextra](https://nextra.site), a Next.js-based documentation framework, and features AI-powered search using [Inkeep](https://inkeep.com).

## Features

- 📚 **Developer Documentation** - Comprehensive guides and API references
- 🔍 **AI-Powered Search** - Intelligent search powered by Inkeep AI
- 🎨 **Modern UI** - Built with Nextra theme for optimal reading experience
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🌙 **Dark Mode** - Built-in dark mode support

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/payvost/payvost-docs.git
cd payvost-docs
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. (Optional) Set up Inkeep AI search:

   - Copy `.env.example` to `.env.local`
   - Add your Inkeep credentials from [Inkeep Portal](https://portal.inkeep.com/)

4. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the documentation.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
payvost-docs/
├── components/       # React components
│   ├── InkeepSearch.tsx  # Inkeep AI search integration
│   └── ...
├── pages/           # Documentation pages (MDX)
│   ├── _app.tsx    # Custom Next.js App
│   ├── _meta.ts    # Navigation structure
│   ├── index.mdx   # Homepage
│   └── ...
├── theme.config.tsx # Nextra theme configuration
├── next.config.mjs  # Next.js configuration
└── package.json
```

## Inkeep AI Integration

This documentation uses Inkeep for AI-powered search, similar to leading payment platforms like Stripe and PayPal. The integration provides:

- Natural language search
- Contextual answers
- Quick question suggestions
- Real-time documentation indexing

### Configuration

To enable Inkeep search:

1. Sign up at [Inkeep Portal](https://portal.inkeep.com/)
2. Create a new project and get your credentials
3. Add them to `.env.local`:

```env
NEXT_PUBLIC_INKEEP_API_KEY=your_api_key
NEXT_PUBLIC_INKEEP_INTEGRATION_ID=your_integration_id
NEXT_PUBLIC_INKEEP_ORGANIZATION_ID=your_organization_id
```

## Content Management

This repository is connected to [payvost-cms](https://github.com/payvostinc/payvost-cms), a Sanity-based CMS for managing:

- Developer documentation
- Blog posts
- API references
- Guides and tutorials

## Deployment

This site is deployed on Vercel. Any push to the `main` branch triggers an automatic deployment.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/payvost/payvost-docs)

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [payvost-cms](https://github.com/payvostinc/payvost-cms) - Content management system
- [payvost-web](https://github.com/payvostinc/payvost-web) - Official website

## Support

- 📧 Email: support@payvost.com
- 💬 Discord: [Join our community](https://discord.gg/payvost)
- 🐦 Twitter: [@payvost](https://twitter.com/payvost)
- 📖 Documentation: [docs.payvost.com](https://docs.payvost.com)

---

© 2025 Payvost. All rights reserved.

