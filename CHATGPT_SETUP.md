# ChatGPT AI Search Setup Guide

This guide will help you integrate OpenAI ChatGPT-4/5 into the Payvost documentation site for AI-powered search and assistance.

## What is ChatGPT Integration?

ChatGPT is OpenAI's advanced language model that provides intelligent, conversational answers to documentation questions. This integration allows users to ask questions in natural language and receive contextual, accurate responses about your Payvost documentation.

## Features

- 🤖 **GPT-4/GPT-4-Turbo Support**: Latest OpenAI models for best accuracy
- 💬 **Conversational Interface**: Natural chat-like interaction
- ⚡ **Quick Questions**: Predefined common queries for fast access
- ⌨️ **Keyboard Shortcuts**: Quick access with Cmd/Ctrl + K
- 🎨 **Customizable**: Easily adjust prompts and behavior
- 🔒 **Secure**: API keys stored as environment variables

## Setup Instructions

### Step 1: Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy your API key (starts with `sk-`)
6. **Important**: Store it securely - you won't be able to see it again!

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your OpenAI API key to `.env.local`:
   ```env
   # Option 1: Client-side (for demo/development)
   NEXT_PUBLIC_OPENAI_API_KEY=sk-...your_api_key_here
   
   # Option 2: Server-side (recommended for production - more secure)
   OPENAI_API_KEY=sk-...your_api_key_here
   ```

   **Security Note**: For production, use `OPENAI_API_KEY` (server-side) instead of `NEXT_PUBLIC_OPENAI_API_KEY` to keep your key secure.

### Step 3: Choose Your Model

Edit `components/ChatGPTSearch.tsx` to select your preferred model:

```typescript
const CHATGPT_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  model: 'gpt-4', // Options: 'gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'
  maxTokens: 500,
  temperature: 0.7,
};
```

**Model Recommendations**:
- **gpt-4**: Best quality, slower, more expensive
- **gpt-4-turbo**: Great quality, faster, cost-effective
- **gpt-3.5-turbo**: Good quality, fastest, cheapest

### Step 4: Customize System Prompt

Edit the system prompt in `components/ChatGPTSearch.tsx`:

```typescript
systemPrompt: `You are a helpful assistant for Payvost payment platform documentation. 
Answer questions about payment integration, API usage, authentication, and webhooks. 
Be concise and provide code examples when relevant.
Only answer questions related to Payvost documentation.`,
```

### Step 5: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Look for the "Search with AI" button or press `Cmd/Ctrl + K`

4. Try asking a question like:
   - "How do I integrate Payvost payments?"
   - "What authentication methods are available?"
   - "Show me webhook examples"

### Step 6: Customize Quick Questions

Edit the quick questions in `components/ChatGPTSearch.tsx`:

```typescript
const quickQuestions = [
  'How do I integrate Payvost payments?',
  'What are the API authentication methods?',
  'How do I handle webhooks?',
  'What payment methods are supported?',
];
```

## Cost Management

### Understanding OpenAI Pricing

OpenAI charges based on tokens (roughly 750 words = 1000 tokens):

- **GPT-4**: $0.03/1K input tokens, $0.06/1K output tokens
- **GPT-4-Turbo**: $0.01/1K input tokens, $0.03/1K output tokens  
- **GPT-3.5-Turbo**: $0.0005/1K input tokens, $0.0015/1K output tokens

### Cost Optimization Tips

1. **Set Token Limits**: Limit `maxTokens` to control response length
2. **Use GPT-3.5-Turbo**: For high-traffic sites, consider the faster, cheaper model
3. **Implement Rate Limiting**: Add request throttling in production
4. **Monitor Usage**: Check your OpenAI dashboard regularly
5. **Set Budget Limits**: Configure spending limits in OpenAI settings

### Adding Rate Limiting

Add to `pages/api/chat.ts`:

```typescript
// Simple rate limiting example
const rateLimitMap = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip).filter((time: number) => now - time < windowMs);
  
  if (requests.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  requests.push(now);
  rateLimitMap.set(ip, requests);

  // ... rest of your handler
}
```

## Advanced Configuration

### Custom Styling

The component uses Nextra's built-in classes. To customize:

```tsx
// In components/ChatGPTSearch.tsx
<button className="your-custom-classes">
  Search with AI
</button>
```

### Adding Context from Documentation

To improve answers, you can inject documentation context:

```typescript
const systemPrompt = `You are a helpful assistant for Payvost payment platform.

DOCUMENTATION CONTEXT:
- Payvost supports credit cards, debit cards, and digital wallets
- Authentication uses API keys in the Authorization header
- Webhooks are sent to registered URLs for payment events
- Base API URL: https://api.payvost.com/v1

Answer questions based on this context.`;
```

### Streaming Responses

For real-time responses, implement streaming:

```typescript
// In pages/api/chat.ts
const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages,
  stream: true,
});

res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  res.write(`data: ${JSON.stringify({ content })}\n\n`);
}

res.end();
```

## Deployment

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add your OpenAI API key:
   - **Key**: `OPENAI_API_KEY` (server-side, recommended)
   - **Value**: Your OpenAI API key
4. Redeploy your application

### Security Best Practices

1. **Never expose API keys**: Always use `OPENAI_API_KEY` (server-side) in production
2. **Implement authentication**: Protect your API routes if needed
3. **Add rate limiting**: Prevent abuse and control costs
4. **Monitor usage**: Set up alerts for unusual activity
5. **Rotate keys**: Regularly rotate API keys for security

## Troubleshooting

### Chat Not Appearing

1. Verify environment variables are set
2. Check browser console for errors
3. Ensure OpenAI package is installed: `npm install openai`
4. Verify API key is valid

### API Errors

1. **401 Unauthorized**: Check your API key is correct
2. **429 Rate Limit**: You've exceeded your quota
3. **500 Server Error**: Check API route logs for details

### Slow Responses

1. Switch to `gpt-3.5-turbo` for faster responses
2. Reduce `maxTokens` to limit response length
3. Check your internet connection
4. Verify OpenAI service status

## Alternative: Using GPT-4o or GPT-4o-mini

For the latest models, update your config:

```typescript
model: 'gpt-4o', // or 'gpt-4o-mini' for the smaller version
```

## Support

- **OpenAI Documentation**: https://platform.openai.com/docs
- **OpenAI Community**: https://community.openai.com/
- **Payvost Support**: support@payvost.com

## Best Practices

1. **Clear System Prompts**: Be specific about what the AI should do
2. **Limit Scope**: Only answer questions about your documentation
3. **Provide Examples**: Include sample queries for users
4. **Monitor Costs**: Keep track of API usage
5. **Test Thoroughly**: Verify responses are accurate before production
6. **Update Context**: Keep the system prompt current with your docs

---

For more information about OpenAI's capabilities, visit the [OpenAI Documentation](https://platform.openai.com/docs).

