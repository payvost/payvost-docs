# Payvost Documentation

Official developer documentation for [Payvost](https://payvost.com) payment platform.

This documentation site is built with [Nextra](https://nextra.site), a Next.js-based documentation framework, and features AI-powered search using [OpenAI ChatGPT](https://openai.com).

## Features

- 📚 **Developer Documentation** - Comprehensive guides and API references
- 🔍 **AI-Powered Search** - Intelligent search powered by ChatGPT AI
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

3. (Optional) Set up ChatGPT AI search:

   - Copy `.env.example` to `.env.local`
   - Add your ChatGPT credentials from [ChatGPT Portal](https://platform.openai.com/)

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
│   ├── ChatGPTSearch.tsx  # ChatGPT AI search integration
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

## ChatGPT AI Integration

This documentation uses OpenAI's ChatGPT (GPT-4/GPT-4-Turbo) for AI-powered search and assistance. The integration provides:

- Natural language question answering
- Conversational AI interface
- Quick question suggestions
- Keyboard shortcuts (Cmd/Ctrl + K)

### Configuration

To enable ChatGPT search:

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to `.env.local`:

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-...your_api_key_here
# Or use server-side (more secure):
# OPENAI_API_KEY=sk-...your_api_key_here
```

For detailed setup instructions, see [CHATGPT_SETUP.md](CHATGPT_SETUP.md).


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

