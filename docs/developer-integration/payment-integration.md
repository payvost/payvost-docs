# Payment Integration

Learn how to integrate payment processing into your application using the Payvost API.

## Payment Flow

The typical payment flow consists of:

1. **Create Payment Intent** - Initialize a payment on your server
2. **Collect Payment Method** - Gather payment details from customer
3. **Confirm Payment** - Process the payment
4. **Handle Result** - Show success or handle errors

## Creating a Payment

### Basic Payment

```javascript
// Node.js example
const payment = await payvost.payments.create({
  amount: 5000, // $50.00 in cents
  currency: 'USD',
  description: 'Order #1234',
  metadata: {
    orderId: '1234',
    customerId: 'cust_abc123'
  }
});
```

### Payment with Customer

```javascript
const payment = await payvost.payments.create({
  amount: 5000,
  currency: 'USD',
  customer: 'cust_abc123',
  description: 'Subscription renewal',
  paymentMethod: 'pm_card_visa'
});
```

## Payment Methods

### Credit/Debit Cards

```javascript
const paymentMethod = await payvost.paymentMethods.create({
  type: 'card',
  card: {
    number: '4242424242424242',
    expMonth: 12,
    expYear: 2025,
    cvc: '123'
  },
  billingDetails: {
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      line1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US'
    }
  }
});
```

### Bank Transfer

```javascript
const paymentMethod = await payvost.paymentMethods.create({
  type: 'bank_transfer',
  bankTransfer: {
    accountNumber: '000123456789',
    routingNumber: '110000000',
    accountHolderName: 'John Doe',
    accountType: 'checking'
  }
});
```

### Digital Wallets

Supported digital wallets:
- Apple Pay
- Google Pay
- PayPal
- Venmo

```javascript
const payment = await payvost.payments.create({
  amount: 5000,
  currency: 'USD',
  paymentMethodTypes: ['card', 'apple_pay', 'google_pay']
});
```

## Confirming Payments

### Automatic Confirmation

```javascript
const payment = await payvost.payments.create({
  amount: 5000,
  currency: 'USD',
  paymentMethod: 'pm_card_visa',
  confirm: true // Automatically confirm
});
```

### Manual Confirmation

```javascript
// Create payment
const payment = await payvost.payments.create({
  amount: 5000,
  currency: 'USD',
  paymentMethod: 'pm_card_visa'
});

// Confirm later
const confirmedPayment = await payvost.payments.confirm(payment.id);
```

## Handling Payment Status

```javascript
switch (payment.status) {
  case 'succeeded':
    // Payment successful, fulfill order
    fulfillOrder(payment.metadata.orderId);
    break;
  
  case 'processing':
    // Payment is being processed
    showProcessingMessage();
    break;
  
  case 'requires_action':
    // Additional action needed (e.g., 3D Secure)
    handle3DSecure(payment.clientSecret);
    break;
  
  case 'requires_payment_method':
    // Payment method failed, request new one
    requestNewPaymentMethod();
    break;
  
  case 'canceled':
    // Payment was canceled
    handleCancellation();
    break;
  
  case 'failed':
    // Payment failed
    handleFailure(payment.lastPaymentError);
    break;
}
```

## Refunds

### Full Refund

```javascript
const refund = await payvost.refunds.create({
  payment: 'pay_1234567890'
});
```

### Partial Refund

```javascript
const refund = await payvost.refunds.create({
  payment: 'pay_1234567890',
  amount: 2500, // Refund $25.00 of $50.00
  reason: 'requested_by_customer'
});
```

### Refund Status

```javascript
const refund = await payvost.refunds.retrieve('ref_1234567890');

if (refund.status === 'succeeded') {
  console.log('Refund processed successfully');
}
```

## Recurring Payments

### Create Subscription

```javascript
const subscription = await payvost.subscriptions.create({
  customer: 'cust_abc123',
  items: [{
    price: 'price_monthly'
  }],
  paymentMethod: 'pm_card_visa',
  defaultPaymentMethod: 'pm_card_visa'
});
```

### Update Subscription

```javascript
const subscription = await payvost.subscriptions.update(
  'sub_1234567890',
  {
    items: [{
      id: 'si_abc123',
      price: 'price_yearly' // Change to yearly
    }]
  }
);
```

### Cancel Subscription

```javascript
// Cancel immediately
const subscription = await payvost.subscriptions.cancel('sub_1234567890');

// Cancel at period end
const subscription = await payvost.subscriptions.update(
  'sub_1234567890',
  {
    cancelAtPeriodEnd: true
  }
);
```

## Error Handling

```javascript
try {
  const payment = await payvost.payments.create({
    amount: 5000,
    currency: 'USD',
    paymentMethod: 'pm_card_visa',
    confirm: true
  });
} catch (error) {
  switch (error.type) {
    case 'card_error':
      // Card was declined
      console.error('Card declined:', error.message);
      break;
    
    case 'validation_error':
      // Invalid parameters
      console.error('Invalid parameters:', error.message);
      break;
    
    case 'api_error':
      // Payvost API error
      console.error('API error:', error.message);
      break;
    
    case 'authentication_error':
      // Authentication failed
      console.error('Auth error:', error.message);
      break;
    
    default:
      // Unknown error
      console.error('Unknown error:', error.message);
  }
}
```

## Idempotency

Prevent duplicate payments by using idempotency keys:

```javascript
const payment = await payvost.payments.create({
  amount: 5000,
  currency: 'USD',
  description: 'Order #1234'
}, {
  idempotencyKey: 'order_1234_payment'
});
```

## Testing

### Test Card Numbers

Use these test cards in test mode:

| Card Number | Description |
|------------|-------------|
| 4242424242424242 | Visa - Success |
| 4000000000000002 | Visa - Declined |
| 4000002500003155 | Visa - 3D Secure required |
| 5555555555554444 | Mastercard - Success |
| 378282246310005 | Amex - Success |

### Test Amounts

Specific amounts trigger different scenarios:

- `$10.00` - Success
- `$20.00` - Declined (insufficient_funds)
- `$30.00` - Declined (card_declined)
- `$40.00` - Processing error

## Best Practices

1. **Always validate amounts** on the server
2. **Use HTTPS** for all payment requests
3. **Implement idempotency** for payment creation
4. **Handle all payment statuses** appropriately
5. **Set up webhooks** for real-time updates
6. **Store payment IDs** in your database
7. **Never log sensitive card data**
8. **Implement retry logic** with exponential backoff

## Next Steps

- [Set up Webhooks](./webhooks.md) for real-time payment updates
- [Test your integration](./testing.md) thoroughly
- [Review Security Best Practices](./security.md)

## Need Help?

- 📖 [Full API Reference](https://docs.payvost.com/api/payments)
- 💬 [Discord Community](https://discord.gg/payvost)
- 📧 [Email Support](mailto:support@payvost.com)
