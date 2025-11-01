# Migration Guide

Learn how to migrate to Payvost from other payment providers.

## Supported Migrations

We provide migration guides for:
- Stripe
- PayPal
- Braintree
- Square
- Authorize.Net
- Other payment processors

## Before You Begin

### Prerequisites

- [ ] Active Payvost account
- [ ] API keys configured
- [ ] Test environment set up
- [ ] Backup of current payment data
- [ ] Migration plan documented

### Migration Checklist

- [ ] Audit current payment implementation
- [ ] Map existing features to Payvost equivalents
- [ ] Plan data migration strategy
- [ ] Set up test environment
- [ ] Migrate customer data
- [ ] Migrate payment methods
- [ ] Update application code
- [ ] Test thoroughly
- [ ] Plan cutover strategy
- [ ] Execute migration
- [ ] Monitor post-migration

## Migrating from Stripe

### Concept Mapping

| Stripe | Payvost | Notes |
|--------|---------|-------|
| `PaymentIntent` | `Payment` | Similar functionality |
| `Customer` | `Customer` | Direct equivalent |
| `PaymentMethod` | `PaymentMethod` | Direct equivalent |
| `Subscription` | `Subscription` | Similar structure |
| `Invoice` | `Invoice` | Direct equivalent |
| `Webhook` | `Webhook` | Similar implementation |

### Code Comparison

**Stripe:**
```javascript
const stripe = require('stripe')('sk_test_...');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  payment_method: 'pm_card_visa',
  confirm: true
});
```

**Payvost:**
```javascript
const payvost = require('@payvost/node-sdk');
const client = new payvost.Client('sk_test_...');

const payment = await client.payments.create({
  amount: 2000,
  currency: 'usd',
  paymentMethod: 'pm_card_visa',
  confirm: true
});
```

### Data Migration

Export customer data from Stripe:

```javascript
// Export Stripe customers
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const customers = [];

for await (const customer of stripe.customers.list({ limit: 100 })) {
  customers.push(customer);
}

// Import to Payvost
const payvost = new Payvost.Client(process.env.PAYVOST_SECRET_KEY);

for (const stripeCustomer of customers) {
  await payvost.customers.create({
    email: stripeCustomer.email,
    name: stripeCustomer.name,
    metadata: {
      stripeId: stripeCustomer.id,
      migrated: true
    }
  });
}
```

### Webhook Migration

**Stripe webhook handler:**
```javascript
app.post('/stripe-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  
  if (event.type === 'payment_intent.succeeded') {
    // Handle payment success
  }
  
  res.json({ received: true });
});
```

**Payvost webhook handler:**
```javascript
app.post('/payvost-webhook', async (req, res) => {
  const sig = req.headers['payvost-signature'];
  const event = payvost.webhooks.constructEvent(req.body, sig, webhookSecret);
  
  if (event.type === 'payment.succeeded') {
    // Handle payment success
  }
  
  res.json({ received: true });
});
```

## Migrating from PayPal

### Key Differences

| Feature | PayPal | Payvost |
|---------|--------|---------|
| API Style | REST | REST |
| Auth | OAuth 2.0 | API Key |
| Payment Flow | Redirect | Embedded/Redirect |
| Currencies | 25+ | 135+ |

### Code Comparison

**PayPal:**
```javascript
const paypal = require('@paypal/checkout-server-sdk');

const request = new paypal.orders.OrdersCreateRequest();
request.requestBody({
  intent: 'CAPTURE',
  purchase_units: [{
    amount: {
      currency_code: 'USD',
      value: '20.00'
    }
  }]
});

const order = await client.execute(request);
```

**Payvost:**
```javascript
const payvost = require('@payvost/node-sdk');

const payment = await payvost.payments.create({
  amount: 2000,
  currency: 'USD',
  description: 'Order payment'
});
```

### Migration Script

```javascript
// Migrate PayPal transactions to Payvost
async function migratePayPalOrders() {
  const orders = await fetchPayPalOrders();
  
  for (const order of orders) {
    // Create corresponding record in your DB
    await db.payments.create({
      externalId: order.id,
      amount: parseFloat(order.amount.value) * 100,
      currency: order.amount.currency_code,
      status: mapPayPalStatus(order.status),
      provider: 'paypal',
      migratedTo: 'payvost'
    });
  }
}

function mapPayPalStatus(paypalStatus) {
  const mapping = {
    'COMPLETED': 'succeeded',
    'PENDING': 'processing',
    'FAILED': 'failed',
    'CANCELLED': 'canceled'
  };
  return mapping[paypalStatus] || 'unknown';
}
```

## Migrating from Braintree

### Concept Mapping

| Braintree | Payvost |
|-----------|---------|
| `Transaction` | `Payment` |
| `Customer` | `Customer` |
| `PaymentMethod` | `PaymentMethod` |
| `Subscription` | `Subscription` |
| `ClientToken` | `ClientSecret` |

### Code Comparison

**Braintree:**
```javascript
const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Production,
  merchantId: 'merchant_id',
  publicKey: 'public_key',
  privateKey: 'private_key'
});

const result = await gateway.transaction.sale({
  amount: '20.00',
  paymentMethodNonce: nonceFromTheClient
});
```

**Payvost:**
```javascript
const payvost = new Payvost.Client(apiKey);

const payment = await payvost.payments.create({
  amount: 2000,
  currency: 'USD',
  paymentMethod: paymentMethodId
});
```

## Migration Strategies

### Parallel Run

Run both systems simultaneously:

```javascript
async function processPayment(amount, currency) {
  // Create payment in both systems
  const [oldPayment, newPayment] = await Promise.all([
    oldProvider.createPayment({ amount, currency }),
    payvost.payments.create({ amount, currency })
  ]);
  
  // Use old provider for now, but log new provider result
  console.log('New provider payment:', newPayment.id);
  return oldPayment;
}
```

### Gradual Migration

Migrate customers gradually:

```javascript
async function createPayment(customerId, amount) {
  const customer = await db.customers.findOne({ id: customerId });
  
  if (customer.migratedToPayvost) {
    // Use Payvost
    return await payvost.payments.create({
      amount,
      customer: customer.payvostId
    });
  } else {
    // Use old provider
    return await oldProvider.createPayment({
      amount,
      customer: customer.oldProviderId
    });
  }
}
```

### Feature Flag Migration

Use feature flags for controlled rollout:

```javascript
const featureFlags = require('./featureFlags');

async function processPayment(amount, currency) {
  if (featureFlags.usePayvost) {
    return await payvost.payments.create({ amount, currency });
  } else {
    return await oldProvider.createPayment({ amount, currency });
  }
}
```

## Data Mapping

### Customer Data

```javascript
async function migrateCustomer(oldCustomer) {
  return await payvost.customers.create({
    email: oldCustomer.email,
    name: oldCustomer.name,
    phone: oldCustomer.phone,
    address: {
      line1: oldCustomer.address.street,
      line2: oldCustomer.address.unit,
      city: oldCustomer.address.city,
      state: oldCustomer.address.state,
      postalCode: oldCustomer.address.zip,
      country: oldCustomer.address.country
    },
    metadata: {
      oldProviderId: oldCustomer.id,
      migratedAt: new Date().toISOString()
    }
  });
}
```

### Transaction History

```javascript
async function migrateTransactionHistory() {
  const transactions = await oldProvider.getTransactions();
  
  for (const tx of transactions) {
    await db.transactions.create({
      id: generateId(),
      provider: 'old_provider',
      providerId: tx.id,
      amount: tx.amount,
      currency: tx.currency,
      status: mapStatus(tx.status),
      createdAt: tx.createdAt,
      metadata: {
        migrated: true,
        originalData: JSON.stringify(tx)
      }
    });
  }
}
```

## Testing Migration

### Test Checklist

- [ ] Create test customer
- [ ] Process test payment
- [ ] Test refund flow
- [ ] Verify webhook delivery
- [ ] Test subscription creation
- [ ] Test subscription update
- [ ] Test subscription cancellation
- [ ] Verify data accuracy
- [ ] Test error handling
- [ ] Load test new integration

### Migration Test Script

```javascript
async function testMigration() {
  console.log('Starting migration tests...');
  
  // Test 1: Customer creation
  const customer = await payvost.customers.create({
    email: 'test@example.com',
    name: 'Test Customer'
  });
  console.log('✓ Customer created:', customer.id);
  
  // Test 2: Payment processing
  const payment = await payvost.payments.create({
    amount: 1000,
    currency: 'USD',
    customer: customer.id,
    paymentMethod: 'pm_test_card'
  });
  console.log('✓ Payment created:', payment.id);
  
  // Test 3: Refund
  const refund = await payvost.refunds.create({
    payment: payment.id
  });
  console.log('✓ Refund processed:', refund.id);
  
  console.log('Migration tests completed successfully!');
}
```

## Cutover Plan

### Pre-Cutover

1. **T-7 days**: Final testing in production-like environment
2. **T-3 days**: Data migration dry run
3. **T-1 day**: Freeze non-critical changes
4. **T-0**: Execute cutover

### Cutover Steps

```javascript
async function executeCutover() {
  // 1. Enable maintenance mode
  await enableMaintenanceMode();
  
  // 2. Process remaining transactions on old system
  await processRemainingTransactions();
  
  // 3. Final data sync
  await syncFinalData();
  
  // 4. Update DNS/configuration
  await updateConfiguration('provider', 'payvost');
  
  // 5. Verify new system
  await verifyNewSystem();
  
  // 6. Disable maintenance mode
  await disableMaintenanceMode();
  
  console.log('Cutover completed successfully!');
}
```

### Post-Cutover

- Monitor transaction success rates
- Watch for error spikes
- Verify webhook delivery
- Check customer experience
- Review system performance

## Rollback Plan

### When to Rollback

Rollback if:
- Error rate > 5%
- System unavailable > 5 minutes
- Data inconsistencies detected
- Critical functionality broken

### Rollback Procedure

```javascript
async function rollback() {
  console.log('Initiating rollback...');
  
  // 1. Enable maintenance mode
  await enableMaintenanceMode();
  
  // 2. Switch back to old provider
  await updateConfiguration('provider', 'old_provider');
  
  // 3. Verify old system operational
  await verifyOldSystem();
  
  // 4. Sync any new data back
  await syncRollbackData();
  
  // 5. Disable maintenance mode
  await disableMaintenanceMode();
  
  console.log('Rollback completed');
}
```

## Common Issues

### API Rate Limits

Different providers have different rate limits. Plan accordingly:

```javascript
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  maxConcurrent: 10,
  minTime: 100 // 100ms between requests
});

const createPayment = limiter.wrap(payvost.payments.create);
```

### Currency Handling

Ensure currency codes match:

```javascript
function convertCurrency(oldCurrency) {
  const mapping = {
    'USD': 'USD',
    'EUR': 'EUR',
    'GBP': 'GBP'
    // Add more mappings as needed
  };
  return mapping[oldCurrency] || oldCurrency;
}
```

### Status Mapping

Map status codes correctly:

```javascript
function mapPaymentStatus(oldStatus) {
  const mapping = {
    'completed': 'succeeded',
    'pending': 'processing',
    'failed': 'failed',
    'cancelled': 'canceled',
    'refunded': 'refunded'
  };
  return mapping[oldStatus.toLowerCase()] || 'unknown';
}
```

## Need Help?

Our migration specialists can help:

- 📧 Email: migrations@payvost.com
- 💬 Discord: [Migration Support Channel](https://discord.gg/payvost)
- 📞 Phone: 1-800-PAYVOST
- 📖 [Migration Documentation](https://docs.payvost.com/migration)

## Next Steps

- [Authentication](./authentication.md)
- [Payment Integration](./payment-integration.md)
- [Testing](./testing.md)
