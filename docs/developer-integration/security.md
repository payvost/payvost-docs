# Security Best Practices

Security is critical when handling payments. Follow these best practices to keep your integration secure.

## API Key Security

### Storage

**Never hardcode API keys:**

```javascript
// ❌ Bad - Hardcoded keys
const apiKey = 'sk_live_1234567890';

// ✅ Good - Environment variables
const apiKey = process.env.PAYVOST_SECRET_KEY;
```

### Environment Variables

Store keys in environment variables:

```bash
# .env
PAYVOST_SECRET_KEY=sk_live_1234567890
PAYVOST_PUBLISHABLE_KEY=pk_live_1234567890
```

Add `.env` to `.gitignore`:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### Key Rotation

Rotate API keys regularly (every 90 days recommended):

1. Generate new key in dashboard
2. Update all services with new key
3. Test thoroughly
4. Revoke old key after verification

## Server-Side vs Client-Side

### Server-Side Operations

Always perform sensitive operations server-side:

```javascript
// ✅ Good - Server-side payment creation
app.post('/api/create-payment', async (req, res) => {
  const payment = await payvost.payments.create({
    amount: req.body.amount,
    currency: 'USD',
    customer: req.body.customerId
  });
  
  res.json({ clientSecret: payment.clientSecret });
});
```

### Client-Side Operations

Only use publishable keys client-side:

```javascript
// ✅ Good - Client-side with publishable key
const payvost = new Payvost('pk_live_1234567890');

// Create payment method (non-sensitive)
const paymentMethod = await payvost.paymentMethods.create({
  type: 'card',
  card: cardElement
});
```

## PCI Compliance

### Never Store Sensitive Card Data

**Never store:**
- Full card numbers
- CVV/CVC codes
- Card PINs

```javascript
// ❌ Bad - Storing full card number
await db.customers.update({
  cardNumber: '4242424242424242'
});

// ✅ Good - Store payment method ID
await db.customers.update({
  paymentMethodId: 'pm_1234567890'
});
```

### Use Payvost.js for Card Data

Let Payvost handle sensitive card data:

```html
<script src="https://js.payvost.com/v1/"></script>
<script>
  const payvost = Payvost('pk_live_1234567890');
  
  // Payvost.js handles card data securely
  const {paymentMethod, error} = await payvost.createPaymentMethod({
    type: 'card',
    card: cardElement
  });
</script>
```

## HTTPS Only

### Enforce HTTPS

Always use HTTPS in production:

```javascript
// Express.js - Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### Strict Transport Security

Enable HSTS:

```javascript
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  next();
});
```

## Input Validation

### Server-Side Validation

Always validate input server-side:

```javascript
function validatePaymentRequest(req, res, next) {
  const { amount, currency } = req.body;
  
  // Validate amount
  if (!amount || amount < 50 || amount > 999999) {
    return res.status(400).json({
      error: 'Invalid amount'
    });
  }
  
  // Validate currency
  const validCurrencies = ['USD', 'EUR', 'GBP'];
  if (!validCurrencies.includes(currency)) {
    return res.status(400).json({
      error: 'Invalid currency'
    });
  }
  
  next();
}

app.post('/api/payments', validatePaymentRequest, createPayment);
```

### Sanitize Input

```javascript
const validator = require('validator');

function sanitizeInput(input) {
  return validator.escape(validator.trim(input));
}

const description = sanitizeInput(req.body.description);
```

## Webhook Security

### Verify Signatures

Always verify webhook signatures:

```javascript
app.post('/webhooks', (req, res) => {
  const sig = req.headers['payvost-signature'];
  
  let event;
  try {
    event = payvost.webhooks.constructEvent(
      req.body,
      sig,
      process.env.PAYVOST_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed');
    return res.status(400).send('Invalid signature');
  }
  
  // Process verified event
  handleEvent(event);
  res.json({ received: true });
});
```

### Use Raw Body

Webhooks require raw request body:

```javascript
app.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  handleWebhook
);
```

### Secure Endpoint

Protect your webhook endpoint:

```javascript
// Rate limit webhooks
const rateLimit = require('express-rate-limit');

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/webhooks', webhookLimiter, handleWebhook);
```

## Idempotency

### Prevent Duplicate Payments

Use idempotency keys:

```javascript
async function createPayment(orderId) {
  return await payvost.payments.create({
    amount: 5000,
    currency: 'USD',
    description: `Order ${orderId}`
  }, {
    idempotencyKey: `order_${orderId}_${Date.now()}`
  });
}
```

### Database Transactions

Ensure atomic operations:

```javascript
async function processPayment(orderId) {
  const session = await db.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Create payment
      const payment = await payvost.payments.create({
        amount: 5000,
        currency: 'USD'
      });
      
      // Update order
      await db.orders.updateOne(
        { id: orderId },
        { status: 'paid', paymentId: payment.id }
      );
    });
  } finally {
    await session.endSession();
  }
}
```

## Rate Limiting

### Implement Rate Limiting

Protect against abuse:

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/', apiLimiter);
```

### Handle Rate Limit Errors

```javascript
async function makePayvostRequest() {
  try {
    return await payvost.payments.create({...});
  } catch (error) {
    if (error.type === 'rate_limit_error') {
      // Wait and retry
      await sleep(5000);
      return makePayvostRequest();
    }
    throw error;
  }
}
```

## Error Handling

### Don't Expose Sensitive Info

```javascript
// ❌ Bad - Exposing internal details
app.post('/api/payments', async (req, res) => {
  try {
    const payment = await payvost.payments.create({...});
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
});

// ✅ Good - Generic error messages
app.post('/api/payments', async (req, res) => {
  try {
    const payment = await payvost.payments.create({...});
    res.json(payment);
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      error: 'Payment processing failed'
    });
  }
});
```

### Log Errors Securely

```javascript
function logError(error, context) {
  // Remove sensitive data before logging
  const sanitized = {
    message: error.message,
    type: error.type,
    code: error.code,
    context: {
      userId: context.userId,
      // Don't log: card numbers, API keys, etc.
    }
  };
  
  console.error(JSON.stringify(sanitized));
}
```

## Authentication & Authorization

### Verify User Identity

```javascript
async function createPayment(req, res) {
  // Verify user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verify user owns the customer account
  const customer = await db.customers.findOne({
    id: req.body.customerId
  });
  
  if (customer.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Proceed with payment
  const payment = await payvost.payments.create({...});
  res.json(payment);
}
```

### Session Security

```javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // Not accessible via JavaScript
    maxAge: 3600000, // 1 hour
    sameSite: 'strict'
  }
}));
```

## Monitoring & Alerts

### Monitor Suspicious Activity

```javascript
async function detectSuspiciousActivity(payment) {
  const recentPayments = await db.payments.find({
    userId: payment.userId,
    created: { $gte: Date.now() - 3600000 } // Last hour
  });
  
  // Alert on unusual patterns
  if (recentPayments.length > 10) {
    await sendAlert({
      type: 'suspicious_activity',
      userId: payment.userId,
      count: recentPayments.length
    });
  }
}
```

### Log Security Events

```javascript
function logSecurityEvent(event) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    type: 'security',
    event: event.type,
    userId: event.userId,
    ip: event.ip,
    userAgent: event.userAgent
  }));
}
```

## Data Encryption

### Encrypt Sensitive Data at Rest

```javascript
const crypto = require('crypto');

function encrypt(text) {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}
```

## Security Headers

### Set Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet());

// Additional headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

## Security Checklist

Before going live:

- [ ] API keys stored in environment variables
- [ ] No hardcoded credentials in code
- [ ] All requests use HTTPS
- [ ] Webhook signatures verified
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Error messages don't expose sensitive info
- [ ] Logging doesn't include sensitive data
- [ ] Authentication/authorization in place
- [ ] Security headers configured
- [ ] Monitoring and alerts set up
- [ ] Regular security audits scheduled

## Compliance

### GDPR

If serving EU customers:
- Obtain user consent for data processing
- Allow users to access their data
- Support data deletion requests
- Document data processing activities

### PCI DSS

- Never store full card numbers
- Use Payvost's SAQ A compliance
- Maintain secure systems
- Regular security testing

## Incident Response

### Security Incident Plan

1. **Detect**: Monitor for security events
2. **Contain**: Isolate affected systems
3. **Investigate**: Determine scope and impact
4. **Remediate**: Fix vulnerabilities
5. **Notify**: Inform affected users
6. **Document**: Record lessons learned

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PCI Security Standards](https://www.pcisecuritystandards.org/)
- [GDPR Compliance](https://gdpr.eu/)

## Need Help?

- 📖 [Security Documentation](https://docs.payvost.com/security)
- 🔐 [Report Security Issue](mailto:security@payvost.com)
- 💬 [Discord Community](https://discord.gg/payvost)
