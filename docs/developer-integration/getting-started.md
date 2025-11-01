# Getting Started with Payvost

This guide will help you get started with integrating Payvost into your application.

## Step 1: Create Your Account

1. Visit [payvost.com](https://payvost.com) and sign up for a developer account
2. Verify your email address
3. Complete your business profile

## Step 2: Get Your API Keys

1. Log in to your [Payvost Dashboard](https://dashboard.payvost.com)
2. Navigate to **Settings** → **API Keys**
3. Generate your API keys:
   - **Test Mode Keys** - For development and testing
   - **Live Mode Keys** - For production use

> ⚠️ **Important**: Keep your API keys secure. Never commit them to version control or share them publicly.

## Step 3: Install SDK (Optional)

Payvost provides official SDKs for popular programming languages:

### Node.js

```bash
npm install @payvost/node-sdk
```

### Python

```bash
pip install payvost
```

### PHP

```bash
composer require payvost/php-sdk
```

### Ruby

```bash
gem install payvost
```

## Step 4: Make Your First API Call

Here's a simple example to verify your integration:

### Node.js

```javascript
const Payvost = require('@payvost/node-sdk');

const client = new Payvost({
  apiKey: 'your_test_api_key',
  environment: 'test'
});

// Create a payment
async function createPayment() {
  try {
    const payment = await client.payments.create({
      amount: 1000, // Amount in cents
      currency: 'USD',
      description: 'Test payment'
    });
    console.log('Payment created:', payment.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createPayment();
```

### Python

```python
import payvost

client = payvost.Client(
    api_key='your_test_api_key',
    environment='test'
)

# Create a payment
payment = client.payments.create(
    amount=1000,  # Amount in cents
    currency='USD',
    description='Test payment'
)
print(f'Payment created: {payment.id}')
```

### cURL

```bash
curl https://api.payvost.com/v1/payments \
  -u your_test_api_key: \
  -d amount=1000 \
  -d currency=USD \
  -d description="Test payment"
```

## Step 5: Handle the Response

A successful payment creation will return:

```json
{
  "id": "pay_1234567890",
  "object": "payment",
  "amount": 1000,
  "currency": "usd",
  "status": "pending",
  "description": "Test payment",
  "created": 1234567890,
  "metadata": {}
}
```

## Next Steps

Now that you've made your first API call, you can:

1. [Set up authentication](./authentication.md) properly
2. [Integrate payment processing](./payment-integration.md) into your app
3. [Configure webhooks](./webhooks.md) to receive real-time updates
4. [Test your integration](./testing.md) thoroughly

## Common Issues

### Authentication Errors

If you get a 401 Unauthorized error:
- Verify your API key is correct
- Ensure you're using the right environment (test vs. live)
- Check that your API key hasn't been revoked

### Rate Limiting

- Test mode: 100 requests per minute
- Live mode: 1000 requests per minute

If you hit rate limits, implement exponential backoff in your retry logic.

## Need Help?

- 📖 [Full API Reference](https://docs.payvost.com/api)
- 💬 [Discord Community](https://discord.gg/payvost)
- 📧 [Email Support](mailto:support@payvost.com)
