# API Authentication

Payvost uses API keys to authenticate requests. You can manage your API keys in the Payvost Dashboard.

## Authentication Methods

### API Key Authentication

The most common authentication method. Include your API key in the request header:

```bash
Authorization: Bearer your_api_key_here
```

### Basic Authentication

Alternatively, you can use HTTP Basic Auth with your API key as the username and leave the password empty:

```bash
curl https://api.payvost.com/v1/payments \
  -u your_api_key:
```

## API Key Types

### Test Mode Keys

- Prefix: `pk_test_` (publishable) or `sk_test_` (secret)
- Use for development and testing
- No real charges are made
- Sandbox environment

### Live Mode Keys

- Prefix: `pk_live_` (publishable) or `sk_live_` (secret)
- Use for production
- Real charges are processed
- Production environment

## Key Types

### Publishable Keys

- Safe to embed in client-side code
- Can be used in mobile apps and websites
- Limited permissions (e.g., creating payment tokens)
- Prefix: `pk_test_` or `pk_live_`

### Secret Keys

- Must be kept secure on your server
- Never expose in client-side code
- Full API access
- Prefix: `sk_test_` or `sk_live_`

## Best Practices

### Secure Storage

```javascript
// ✅ Good - Using environment variables
const apiKey = process.env.PAYVOST_SECRET_KEY;

// ❌ Bad - Hardcoding keys
const apiKey = 'sk_test_1234567890';
```

### Key Rotation

Rotate your API keys regularly:

1. Generate a new API key in the dashboard
2. Update your application to use the new key
3. Test thoroughly
4. Revoke the old key

### Environment Separation

Always use separate keys for different environments:

```javascript
const config = {
  development: {
    apiKey: process.env.PAYVOST_DEV_KEY
  },
  staging: {
    apiKey: process.env.PAYVOST_STAGING_KEY
  },
  production: {
    apiKey: process.env.PAYVOST_PROD_KEY
  }
};
```

## Authentication Examples

### Node.js

```javascript
const axios = require('axios');

const apiKey = process.env.PAYVOST_SECRET_KEY;

const payvostAPI = axios.create({
  baseURL: 'https://api.payvost.com/v1',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
});

// Make authenticated request
async function getPayment(paymentId) {
  const response = await payvostAPI.get(`/payments/${paymentId}`);
  return response.data;
}
```

### Python

```python
import os
import requests

api_key = os.environ['PAYVOST_SECRET_KEY']

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

# Make authenticated request
def get_payment(payment_id):
    response = requests.get(
        f'https://api.payvost.com/v1/payments/{payment_id}',
        headers=headers
    )
    return response.json()
```

### PHP

```php
<?php
$apiKey = getenv('PAYVOST_SECRET_KEY');

$ch = curl_init('https://api.payvost.com/v1/payments/' . $paymentId);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$payment = json_decode($response);
?>
```

## Error Handling

### 401 Unauthorized

```json
{
  "error": {
    "type": "authentication_error",
    "message": "Invalid API key provided"
  }
}
```

**Causes:**
- Invalid or expired API key
- Wrong environment (using test key in live mode)
- Revoked API key

### 403 Forbidden

```json
{
  "error": {
    "type": "permission_error",
    "message": "This API key does not have permission to perform this action"
  }
}
```

**Causes:**
- Using publishable key for server-side operations
- Insufficient permissions for the operation

## Rate Limiting

API keys are subject to rate limits:

- **Test Mode**: 100 requests per minute
- **Live Mode**: 1000 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Security Checklist

- [ ] API keys stored in environment variables
- [ ] Secret keys never committed to version control
- [ ] Separate keys for test and production
- [ ] Regular key rotation schedule
- [ ] API keys revoked when team members leave
- [ ] Monitoring for unusual API usage
- [ ] HTTPS only for all API requests

## Need Help?

- 📖 [API Reference](https://docs.payvost.com/api)
- 🔐 [Security Best Practices](./security.md)
- 💬 [Discord Community](https://discord.gg/payvost)
