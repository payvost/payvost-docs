# Webhooks

Webhooks allow Payvost to send real-time notifications to your application when events occur in your account.

## What are Webhooks?

Webhooks are HTTP callbacks that Payvost sends to your server when specific events happen. Instead of polling the API, your application receives instant notifications.

## Common Use Cases

- Payment succeeded or failed
- Subscription created, updated, or canceled
- Refund processed
- Customer created or updated
- Dispute opened or resolved

## Setting Up Webhooks

### 1. Create an Endpoint

Create an endpoint on your server to receive webhook events:

```javascript
// Node.js with Express
app.post('/webhooks/payvost', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['payvost-signature'];
  const payload = req.body;
  
  let event;
  
  try {
    event = payvost.webhooks.constructEvent(
      payload,
      sig,
      process.env.PAYVOST_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  handleWebhookEvent(event);
  
  res.json({received: true});
});
```

### 2. Register the Endpoint

Register your endpoint in the [Payvost Dashboard](https://dashboard.payvost.com/webhooks):

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL (e.g., `https://yourapp.com/webhooks/payvost`)
4. Select events to listen for
5. Save the webhook

### 3. Save Your Webhook Secret

After creating the webhook, you'll receive a signing secret (e.g., `whsec_...`). Store this securely:

```bash
export PAYVOST_WEBHOOK_SECRET=whsec_1234567890
```

## Webhook Events

### Payment Events

```javascript
// payment.succeeded
{
  "id": "evt_1234567890",
  "type": "payment.succeeded",
  "data": {
    "object": {
      "id": "pay_1234567890",
      "amount": 5000,
      "currency": "usd",
      "status": "succeeded",
      "customer": "cust_abc123"
    }
  },
  "created": 1234567890
}
```

Available payment events:
- `payment.created`
- `payment.succeeded`
- `payment.failed`
- `payment.canceled`
- `payment.processing`

### Subscription Events

```javascript
// subscription.created
{
  "id": "evt_1234567890",
  "type": "subscription.created",
  "data": {
    "object": {
      "id": "sub_1234567890",
      "customer": "cust_abc123",
      "status": "active",
      "currentPeriodStart": 1234567890,
      "currentPeriodEnd": 1237159890
    }
  },
  "created": 1234567890
}
```

Available subscription events:
- `subscription.created`
- `subscription.updated`
- `subscription.deleted`
- `subscription.trial_will_end`

### Refund Events

```javascript
// refund.created
{
  "id": "evt_1234567890",
  "type": "refund.created",
  "data": {
    "object": {
      "id": "ref_1234567890",
      "payment": "pay_1234567890",
      "amount": 5000,
      "status": "succeeded"
    }
  },
  "created": 1234567890
}
```

Available refund events:
- `refund.created`
- `refund.updated`
- `refund.failed`

## Verifying Webhook Signatures

Always verify webhook signatures to ensure requests come from Payvost:

### Node.js

```javascript
const payvost = require('@payvost/node-sdk');

function verifyWebhook(payload, signature, secret) {
  try {
    const event = payvost.webhooks.constructEvent(
      payload,
      signature,
      secret
    );
    return event;
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return null;
  }
}
```

### Python

```python
import payvost

def verify_webhook(payload, signature, secret):
    try:
        event = payvost.Webhook.construct_event(
            payload, signature, secret
        )
        return event
    except payvost.error.SignatureVerificationError as e:
        print(f'Webhook signature verification failed: {e}')
        return None
```

### PHP

```php
<?php
$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_PAYVOST_SIGNATURE'];
$secret = getenv('PAYVOST_WEBHOOK_SECRET');

try {
    $event = \Payvost\Webhook::constructEvent(
        $payload, $sig_header, $secret
    );
} catch(\Payvost\Exception\SignatureVerificationException $e) {
    http_response_code(400);
    exit();
}
?>
```

## Handling Events

### Basic Event Handler

```javascript
function handleWebhookEvent(event) {
  switch (event.type) {
    case 'payment.succeeded':
      handlePaymentSucceeded(event.data.object);
      break;
    
    case 'payment.failed':
      handlePaymentFailed(event.data.object);
      break;
    
    case 'subscription.created':
      handleSubscriptionCreated(event.data.object);
      break;
    
    case 'subscription.deleted':
      handleSubscriptionDeleted(event.data.object);
      break;
    
    case 'refund.created':
      handleRefundCreated(event.data.object);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}
```

### Idempotent Event Processing

Prevent duplicate event processing:

```javascript
async function processWebhookEvent(event) {
  // Check if event already processed
  const existingEvent = await db.events.findOne({ id: event.id });
  
  if (existingEvent) {
    console.log(`Event ${event.id} already processed`);
    return;
  }
  
  // Process the event
  await handleWebhookEvent(event);
  
  // Mark as processed
  await db.events.create({
    id: event.id,
    type: event.type,
    processed: true,
    processedAt: new Date()
  });
}
```

## Best Practices

### 1. Respond Quickly

Return a 200 response immediately, then process asynchronously:

```javascript
app.post('/webhooks/payvost', async (req, res) => {
  const event = verifyWebhook(req.body, req.headers['payvost-signature']);
  
  if (!event) {
    return res.status(400).send('Invalid signature');
  }
  
  // Respond immediately
  res.json({received: true});
  
  // Process asynchronously
  processWebhookEvent(event).catch(err => {
    console.error('Error processing webhook:', err);
  });
});
```

### 2. Handle Retries

Payvost retries failed webhooks with exponential backoff:
- Initial attempt
- After 5 minutes
- After 15 minutes
- After 1 hour
- After 3 hours
- After 6 hours
- After 12 hours

Make your endpoint idempotent to handle duplicate deliveries.

### 3. Monitor Webhook Health

Track webhook delivery success/failure in your dashboard:

```javascript
async function logWebhookAttempt(event, success, error = null) {
  await db.webhookLogs.create({
    eventId: event.id,
    eventType: event.type,
    success: success,
    error: error,
    timestamp: new Date()
  });
}
```

### 4. Use HTTPS

Always use HTTPS for webhook endpoints in production.

### 5. Validate Event Data

Don't trust webhook data blindly. Verify critical information:

```javascript
async function handlePaymentSucceeded(payment) {
  // Fetch the payment from API to verify
  const verifiedPayment = await payvost.payments.retrieve(payment.id);
  
  if (verifiedPayment.status === 'succeeded') {
    // Fulfill order
    await fulfillOrder(verifiedPayment);
  }
}
```

## Testing Webhooks

### Local Testing with ngrok

1. Install ngrok:
```bash
npm install -g ngrok
```

2. Start your local server:
```bash
npm run dev
```

3. Expose your endpoint:
```bash
ngrok http 3000
```

4. Use the ngrok URL in your webhook configuration:
```
https://abc123.ngrok.io/webhooks/payvost
```

### Sending Test Events

Trigger test events from the Payvost Dashboard:

1. Go to **Developers** → **Webhooks**
2. Select your webhook endpoint
3. Click **Send test event**
4. Choose an event type
5. Click **Send**

### CLI Testing

```bash
payvost webhooks send \
  --endpoint https://yourapp.com/webhooks/payvost \
  --event payment.succeeded \
  --id pay_test_1234567890
```

## Debugging

### Enable Logging

```javascript
app.post('/webhooks/payvost', (req, res) => {
  console.log('Webhook received:', {
    eventId: req.body.id,
    eventType: req.body.type,
    signature: req.headers['payvost-signature']
  });
  
  // Process webhook...
});
```

### Check Webhook Logs

View webhook delivery attempts in your dashboard:

1. Go to **Developers** → **Webhooks**
2. Select your endpoint
3. View **Recent deliveries**

## Security Checklist

- [ ] Verify webhook signatures
- [ ] Use HTTPS endpoints
- [ ] Implement idempotency
- [ ] Rate limit webhook processing
- [ ] Log all webhook attempts
- [ ] Monitor for anomalies
- [ ] Validate event data

## Need Help?

- 📖 [Webhook API Reference](https://docs.payvost.com/api/webhooks)
- 💬 [Discord Community](https://discord.gg/payvost)
- 📧 [Email Support](mailto:support@payvost.com)
