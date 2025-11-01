# Inkeep AI Search Setup Guide

This guide will help you integrate Inkeep AI search into the Payvost documentation site.

## What is Inkeep?

Inkeep is an AI-powered search and chat widget that provides intelligent, contextual answers to documentation questions. It's used by leading companies like Stripe, PayPal, and many others to enhance their documentation experience.

## Features

- 🔍 **AI-Powered Search**: Natural language search across your documentation
- 💬 **Conversational AI**: Chat interface for asking questions
- ⚡ **Quick Questions**: Predefined questions for common queries
- 🎯 **Contextual Answers**: AI understands context and provides relevant answers
- ⌨️ **Keyboard Shortcuts**: Quick access with keyboard shortcuts (Cmd/Ctrl + K)
- 📊 **Analytics**: Track search queries and user engagement

## Setup Instructions

### Step 1: Create an Inkeep Account

1. Visit [Inkeep Portal](https://portal.inkeep.com/)
2. Sign up for a free account
3. Create a new project for "Payvost Documentation"

### Step 2: Configure Your Project

1. In the Inkeep portal, navigate to your project settings
2. Add your documentation source:
   - **Source Type**: GitHub Repository
   - **Repository**: `payvost/payvost-docs`
   - **Branch**: `main`
   - **Documentation Path**: `/pages`

3. Configure indexing:
   - Enable auto-sync on push
   - Set up webhooks for real-time updates

### Step 3: Get Your API Credentials

From the Inkeep portal, copy the following credentials:

- **API Key**: Found in Settings > API Keys
- **Integration ID**: Found in Settings > Integration
- **Organization ID**: Found in Settings > Organization

### Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Inkeep credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_INKEEP_API_KEY=ik_xxx...
   NEXT_PUBLIC_INKEEP_INTEGRATION_ID=int_xxx...
   NEXT_PUBLIC_INKEEP_ORGANIZATION_ID=org_xxx...
   ```

### Step 5: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Look for the search icon in the navigation bar

4. Click it or press `Cmd/Ctrl + K` to open the search modal

5. Try searching for documentation topics or asking questions

### Step 6: Customize the Search Experience

You can customize the Inkeep widget by editing `components/InkeepSearch.tsx`:

```typescript
const INKEEP_CONFIG = {
  baseSettings: {
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY,
    integrationId: process.env.NEXT_PUBLIC_INKEEP_INTEGRATION_ID,
    organizationId: process.env.NEXT_PUBLIC_INKEEP_ORGANIZATION_ID,
    organizationDisplayName: 'Payvost',
    primaryBrandColor: '#000000', // Customize this
  },
  aiChatSettings: {
    botAvatarSrcUrl: '/payvost-logo.png', // Add your logo
    quickQuestions: [
      'How do I integrate Payvost payments?',
      'What are the API authentication methods?',
      'How do I handle webhooks?',
      // Add more quick questions
    ],
  },
  searchSettings: {
    placeholder: 'Search documentation...', // Customize placeholder
  },
  modalSettings: {
    isShortcutKeyEnabled: true, // Enable Cmd/Ctrl + K
  },
};
```

## Advanced Configuration

### Custom Branding

You can customize the appearance to match Payvost branding:

```typescript
baseSettings: {
  primaryBrandColor: '#your-brand-color',
  breadcrumbRules: {
    urlToBreadcrumbMapper: [
      {
        matchingRule: {
          ruleType: 'PartialUrl',
          partialUrl: 'payvost.com',
        },
        breadcrumbName: 'Payvost',
      },
    ],
  },
}
```

### Content Filtering

Filter what content is included in search results:

```typescript
searchSettings: {
  tabSettings: {
    isAllTabEnabled: true,
    tabOrderByLabel: ['Documentation', 'API Reference', 'Guides'],
  },
}
```

### Analytics Integration

Track search analytics by integrating with your analytics platform:

```typescript
baseSettings: {
  analyticsConfig: {
    googleAnalytics: {
      measurementId: 'G-XXXXXXXXXX',
    },
  },
}
```

## Deployment

### Vercel Deployment

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add the three Inkeep environment variables:
   - `NEXT_PUBLIC_INKEEP_API_KEY`
   - `NEXT_PUBLIC_INKEEP_INTEGRATION_ID`
   - `NEXT_PUBLIC_INKEEP_ORGANIZATION_ID`
4. Redeploy your application

### Other Platforms

For other deployment platforms, ensure the environment variables are set in your hosting environment before building.

## Troubleshooting

### Search Not Appearing

1. Verify environment variables are set correctly
2. Check browser console for errors
3. Ensure you're using the correct API credentials

### Content Not Indexed

1. Verify your repository connection in Inkeep portal
2. Trigger a manual sync from the portal
3. Check that your documentation files are in the correct format (MDX/Markdown)

### Widget Not Loading

1. Check for JavaScript errors in the browser console
2. Verify the @inkeep/widgets package is installed
3. Clear your browser cache and rebuild

## Support

- **Inkeep Documentation**: https://docs.inkeep.com/
- **Inkeep Support**: support@inkeep.com
- **Payvost Team**: support@payvost.com

## Best Practices

1. **Keep Content Organized**: Use clear headings and structure in your documentation
2. **Add Quick Questions**: Configure relevant quick questions for common queries
3. **Monitor Analytics**: Regularly check what users are searching for
4. **Update Content**: Keep documentation up-to-date for better AI responses
5. **Test Regularly**: Test search functionality after major content updates

## Next Steps

After setting up Inkeep:

1. Monitor search analytics in the Inkeep portal
2. Refine quick questions based on common searches
3. Optimize documentation structure for better AI understanding
4. Consider adding FAQ sections for common queries
5. Integrate with your CMS (payvost-cms) for content management

---

For more information about Inkeep features and advanced configuration, visit the [Inkeep Documentation](https://docs.inkeep.com/).
