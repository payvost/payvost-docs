# Testing Your Integration

Learn how to test your Payvost integration thoroughly before going live.

## Test Environment

Payvost provides a complete test environment that mirrors production without processing real transactions.

### Test Mode Features

- ✅ No real money involved
- ✅ Unlimited test transactions
- ✅ Same API endpoints
- ✅ Realistic test scenarios
- ✅ Webhook testing
- ✅ Error simulation

## Test API Keys

Use test API keys for development:

```bash
# Publishable key (client-side)
pk_test_1234567890abcdef

# Secret key (server-side)
sk_test_1234567890abcdef
```

Get your test keys from the [Payvost Dashboard](https://dashboard.payvost.com/settings/api-keys).

## Test Cards

### Successful Payments

Use these cards for successful transactions:

| Card Number | Brand | CVC | Expiry |
|------------|-------|-----|--------|
| 4242424242424242 | Visa | Any 3 digits | Any future date |
| 5555555555554444 | Mastercard | Any 3 digits | Any future date |
| 378282246310005 | American Express | Any 4 digits | Any future date |
| 6011111111111117 | Discover | Any 3 digits | Any future date |

### Declined Cards

Test different decline scenarios:

| Card Number | Decline Reason |
|------------|----------------|
| 4000000000000002 | Generic decline |
| 4000000000009995 | Insufficient funds |
| 4000000000009987 | Lost card |
| 4000000000009979 | Stolen card |
| 4000000000000069 | Expired card |
| 4000000000000127 | Incorrect CVC |
| 4000000000000119 | Processing error |
| 4242424242424241 | Invalid card number |

### Special Scenarios

| Card Number | Scenario |
|------------|----------|
| 4000002500003155 | Requires 3D Secure authentication |
| 4000008260003178 | Requires additional verification |
| 4000000000000341 | Charge succeeds but fails to capture |

## Testing Amounts

Specific amounts trigger different behaviors in test mode:

### Successful Amounts

```javascript
// Amount: $10.00
{ amount: 1000, currency: 'USD' }
// Result: Payment succeeds

// Amount: $15.00
{ amount: 1500, currency: 'USD' }
// Result: Payment succeeds with receipt
```

### Failed Amounts

```javascript
// Amount: $20.00
{ amount: 2000, currency: 'USD' }
// Result: Declined - insufficient_funds

// Amount: $30.00
{ amount: 3000, currency: 'USD' }
// Result: Declined - card_declined

// Amount: $40.00
{ amount: 4000, currency: 'USD' }
// Result: Processing error

// Amount: $50.00
{ amount: 5000, currency: 'USD' }
// Result: Requires authentication
```

## Test Scenarios

### Basic Payment Flow

```javascript
// Test: Create and confirm a payment
async function testBasicPayment() {
  const payment = await payvost.payments.create({
    amount: 1000,
    currency: 'USD',
    paymentMethod: 'pm_card_visa',
    confirm: true
  });
  
  console.assert(
    payment.status === 'succeeded',
    'Payment should succeed'
  );
}
```

### Card Decline

```javascript
// Test: Handle card decline
async function testCardDecline() {
  try {
    await payvost.payments.create({
      amount: 2000, // Amount that triggers decline
      currency: 'USD',
      paymentMethod: 'pm_card_declined',
      confirm: true
    });
  } catch (error) {
    console.assert(
      error.type === 'card_error',
      'Should throw card error'
    );
  }
}
```

### 3D Secure Authentication

```javascript
// Test: Handle 3D Secure flow
async function test3DSecure() {
  const payment = await payvost.payments.create({
    amount: 5000,
    currency: 'USD',
    paymentMethod: 'pm_card_threeDSecure',
    confirm: true
  });
  
  console.assert(
    payment.status === 'requires_action',
    'Payment should require authentication'
  );
  
  // In real app, redirect user to authentication
  const authenticatedPayment = await payvost.payments.confirm(
    payment.id,
    { returnUrl: 'https://yourapp.com/payment/complete' }
  );
}
```

### Refund Processing

```javascript
// Test: Process a refund
async function testRefund() {
  // Create successful payment
  const payment = await payvost.payments.create({
    amount: 1000,
    currency: 'USD',
    paymentMethod: 'pm_card_visa',
    confirm: true
  });
  
  // Refund it
  const refund = await payvost.refunds.create({
    payment: payment.id,
    amount: 1000
  });
  
  console.assert(
    refund.status === 'succeeded',
    'Refund should succeed'
  );
}
```

### Subscription Lifecycle

```javascript
// Test: Full subscription lifecycle
async function testSubscription() {
  // Create customer
  const customer = await payvost.customers.create({
    email: 'test@example.com'
  });
  
  // Create subscription
  const subscription = await payvost.subscriptions.create({
    customer: customer.id,
    items: [{ price: 'price_test_monthly' }],
    paymentMethod: 'pm_card_visa'
  });
  
  console.assert(
    subscription.status === 'active',
    'Subscription should be active'
  );
  
  // Update subscription
  const updated = await payvost.subscriptions.update(
    subscription.id,
    { metadata: { updated: 'true' } }
  );
  
  // Cancel subscription
  const canceled = await payvost.subscriptions.cancel(subscription.id);
  
  console.assert(
    canceled.status === 'canceled',
    'Subscription should be canceled'
  );
}
```

## Webhook Testing

### Local Testing with ngrok

1. Install and start ngrok:
```bash
npm install -g ngrok
ngrok http 3000
```

2. Configure webhook endpoint:
```
https://abc123.ngrok.io/webhooks/payvost
```

3. Trigger test events from dashboard

### Test Webhook Handler

```javascript
// webhook-test.js
const axios = require('axios');

async function sendTestWebhook() {
  const event = {
    id: 'evt_test_123',
    type: 'payment.succeeded',
    data: {
      object: {
        id: 'pay_test_123',
        amount: 1000,
        currency: 'usd',
        status: 'succeeded'
      }
    },
    created: Date.now()
  };
  
  const response = await axios.post(
    'http://localhost:3000/webhooks/payvost',
    event,
    {
      headers: {
        'payvost-signature': 'test_signature'
      }
    }
  );
  
  console.log('Webhook response:', response.status);
}

sendTestWebhook();
```

## Integration Testing

### Complete E2E Test

```javascript
const assert = require('assert');
const payvost = require('@payvost/node-sdk');

describe('Payvost Integration', () => {
  let client;
  
  before(() => {
    client = new payvost.Client({
      apiKey: process.env.PAYVOST_TEST_KEY,
      environment: 'test'
    });
  });
  
  it('should create a successful payment', async () => {
    const payment = await client.payments.create({
      amount: 1000,
      currency: 'USD',
      paymentMethod: 'pm_card_visa',
      confirm: true
    });
    
    assert.strictEqual(payment.status, 'succeeded');
    assert.strictEqual(payment.amount, 1000);
  });
  
  it('should handle card decline', async () => {
    await assert.rejects(
      async () => {
        await client.payments.create({
          amount: 2000,
          currency: 'USD',
          paymentMethod: 'pm_card_declined',
          confirm: true
        });
      },
      {
        name: 'PayvostCardError',
        code: 'card_declined'
      }
    );
  });
  
  it('should process refund', async () => {
    const payment = await client.payments.create({
      amount: 1000,
      currency: 'USD',
      paymentMethod: 'pm_card_visa',
      confirm: true
    });
    
    const refund = await client.refunds.create({
      payment: payment.id
    });
    
    assert.strictEqual(refund.status, 'succeeded');
  });
});
```

## Test Checklist

Before going live, ensure you've tested:

### Basic Functionality
- [ ] Create payment with valid card
- [ ] Create payment with invalid card
- [ ] Payment with 3D Secure
- [ ] Process full refund
- [ ] Process partial refund
- [ ] Create customer
- [ ] Create subscription
- [ ] Cancel subscription

### Error Handling
- [ ] Invalid API key
- [ ] Network timeout
- [ ] Card declined
- [ ] Insufficient funds
- [ ] Invalid card number
- [ ] Expired card
- [ ] Rate limiting

### Webhooks
- [ ] Payment succeeded
- [ ] Payment failed
- [ ] Subscription created
- [ ] Subscription canceled
- [ ] Refund processed
- [ ] Signature verification
- [ ] Idempotency handling

### Edge Cases
- [ ] Zero-amount authorization
- [ ] Multiple currencies
- [ ] Large amounts
- [ ] Special characters in metadata
- [ ] Concurrent requests
- [ ] Idempotency keys

## Load Testing

Test your integration under load:

```javascript
// load-test.js
const payvost = require('@payvost/node-sdk');

async function loadTest() {
  const client = new payvost.Client(process.env.PAYVOST_TEST_KEY);
  const promises = [];
  
  // Create 100 concurrent payments
  for (let i = 0; i < 100; i++) {
    promises.push(
      client.payments.create({
        amount: 1000,
        currency: 'USD',
        paymentMethod: 'pm_card_visa',
        confirm: true,
        idempotencyKey: `test_${i}_${Date.now()}`
      })
    );
  }
  
  const results = await Promise.allSettled(promises);
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  
  console.log(`${succeeded}/${results.length} payments succeeded`);
}

loadTest();
```

## Debugging

### Enable Request Logging

```javascript
const client = new payvost.Client({
  apiKey: process.env.PAYVOST_TEST_KEY,
  debug: true, // Enable debug logging
  timeout: 30000
});
```

### Log Webhook Events

```javascript
app.post('/webhooks/payvost', (req, res) => {
  console.log('Webhook received:', {
    eventId: req.body.id,
    eventType: req.body.type,
    data: JSON.stringify(req.body.data, null, 2)
  });
  
  res.json({ received: true });
});
```

## Going Live

When you're ready to go live:

1. Replace test keys with live keys
2. Update environment configuration
3. Verify webhook endpoints
4. Monitor initial transactions
5. Set up error alerts

## Next Steps

- [Security Best Practices](./security.md)
- [Migration Guide](./migration.md)
- [API Reference](https://docs.payvost.com/api)

## Need Help?

- 📖 [Full Documentation](https://docs.payvost.com)
- 💬 [Discord Community](https://discord.gg/payvost)
- 📧 [Email Support](mailto:support@payvost.com)
