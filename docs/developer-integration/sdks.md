# SDKs and Libraries

Payvost provides official SDKs for popular programming languages to make integration easier and faster.

## Official SDKs

### Node.js / JavaScript

[![npm version](https://img.shields.io/npm/v/@payvost/node-sdk.svg)](https://www.npmjs.com/package/@payvost/node-sdk)

```bash
npm install @payvost/node-sdk
```

**Quick Start:**

```javascript
const Payvost = require('@payvost/node-sdk');

const client = new Payvost({
  apiKey: process.env.PAYVOST_API_KEY,
  environment: 'production' // or 'test'
});

// Create a payment
const payment = await client.payments.create({
  amount: 5000,
  currency: 'USD',
  description: 'Order #1234'
});
```

**Repository:** [github.com/payvost/payvost-node](https://github.com/payvost/payvost-node)

---

### Python

[![PyPI version](https://img.shields.io/pypi/v/payvost.svg)](https://pypi.org/project/payvost/)

```bash
pip install payvost
```

**Quick Start:**

```python
import payvost

client = payvost.Client(
    api_key=os.environ['PAYVOST_API_KEY'],
    environment='production'
)

# Create a payment
payment = client.payments.create(
    amount=5000,
    currency='USD',
    description='Order #1234'
)
```

**Repository:** [github.com/payvost/payvost-python](https://github.com/payvost/payvost-python)

---

### PHP

[![Packagist version](https://img.shields.io/packagist/v/payvost/php-sdk.svg)](https://packagist.org/packages/payvost/php-sdk)

```bash
composer require payvost/php-sdk
```

**Quick Start:**

```php
<?php
require 'vendor/autoload.php';

\Payvost\Payvost::setApiKey(getenv('PAYVOST_API_KEY'));

// Create a payment
$payment = \Payvost\Payment::create([
    'amount' => 5000,
    'currency' => 'USD',
    'description' => 'Order #1234'
]);
?>
```

**Repository:** [github.com/payvost/payvost-php](https://github.com/payvost/payvost-php)

---

### Ruby

[![Gem version](https://img.shields.io/gem/v/payvost.svg)](https://rubygems.org/gems/payvost)

```bash
gem install payvost
```

**Quick Start:**

```ruby
require 'payvost'

Payvost.api_key = ENV['PAYVOST_API_KEY']

# Create a payment
payment = Payvost::Payment.create(
  amount: 5000,
  currency: 'USD',
  description: 'Order #1234'
)
```

**Repository:** [github.com/payvost/payvost-ruby](https://github.com/payvost/payvost-ruby)

---

### Go

```bash
go get github.com/payvost/payvost-go
```

**Quick Start:**

```go
package main

import (
    "github.com/payvost/payvost-go"
    "github.com/payvost/payvost-go/payment"
)

func main() {
    payvost.Key = os.Getenv("PAYVOST_API_KEY")
    
    // Create a payment
    params := &payvost.PaymentParams{
        Amount:      payvost.Int64(5000),
        Currency:    payvost.String("USD"),
        Description: payvost.String("Order #1234"),
    }
    
    p, _ := payment.New(params)
}
```

**Repository:** [github.com/payvost/payvost-go](https://github.com/payvost/payvost-go)

---

### Java

```xml
<dependency>
    <groupId>com.payvost</groupId>
    <artifactId>payvost-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

**Quick Start:**

```java
import com.payvost.Payvost;
import com.payvost.model.Payment;
import com.payvost.param.PaymentCreateParams;

public class PayvostExample {
    public static void main(String[] args) {
        Payvost.apiKey = System.getenv("PAYVOST_API_KEY");
        
        PaymentCreateParams params = PaymentCreateParams.builder()
            .setAmount(5000L)
            .setCurrency("USD")
            .setDescription("Order #1234")
            .build();
        
        Payment payment = Payment.create(params);
    }
}
```

**Repository:** [github.com/payvost/payvost-java](https://github.com/payvost/payvost-java)

---

### .NET (C#)

```bash
dotnet add package Payvost.net
```

**Quick Start:**

```csharp
using Payvost;

var client = new PayvostClient(Environment.GetEnvironmentVariable("PAYVOST_API_KEY"));

// Create a payment
var options = new PaymentCreateOptions
{
    Amount = 5000,
    Currency = "USD",
    Description = "Order #1234"
};

var payment = await client.Payments.CreateAsync(options);
```

**Repository:** [github.com/payvost/payvost-dotnet](https://github.com/payvost/payvost-dotnet)

---

## Mobile SDKs

### iOS (Swift)

```swift
// Swift Package Manager
dependencies: [
    .package(url: "https://github.com/payvost/payvost-ios", from: "1.0.0")
]
```

**Quick Start:**

```swift
import PayvostSDK

let client = PayvostClient(apiKey: "your_publishable_key")

// Create payment method
let card = PaymentMethodCard(
    number: "4242424242424242",
    expMonth: 12,
    expYear: 2025,
    cvc: "123"
)

let paymentMethod = try await client.paymentMethods.create(card: card)
```

**Repository:** [github.com/payvost/payvost-ios](https://github.com/payvost/payvost-ios)

---

### Android (Kotlin)

```gradle
implementation 'com.payvost:payvost-android:1.0.0'
```

**Quick Start:**

```kotlin
import com.payvost.android.PayvostClient

val client = PayvostClient("your_publishable_key")

// Create payment method
val card = Card(
    number = "4242424242424242",
    expMonth = 12,
    expYear = 2025,
    cvc = "123"
)

val paymentMethod = client.paymentMethods.create(card)
```

**Repository:** [github.com/payvost/payvost-android](https://github.com/payvost/payvost-android)

---

### React Native

```bash
npm install @payvost/react-native-sdk
```

**Quick Start:**

```javascript
import { PayvostProvider, usePayvost } from '@payvost/react-native-sdk';

function App() {
  return (
    <PayvostProvider apiKey="your_publishable_key">
      <PaymentScreen />
    </PayvostProvider>
  );
}

function PaymentScreen() {
  const { createPaymentMethod } = usePayvost();
  
  const handlePayment = async () => {
    const paymentMethod = await createPaymentMethod({
      card: {
        number: '4242424242424242',
        expMonth: 12,
        expYear: 2025,
        cvc: '123'
      }
    });
  };
}
```

**Repository:** [github.com/payvost/payvost-react-native](https://github.com/payvost/payvost-react-native)

---

### Flutter

```yaml
dependencies:
  payvost_flutter: ^1.0.0
```

**Quick Start:**

```dart
import 'package:payvost_flutter/payvost_flutter.dart';

final payvost = Payvost('your_publishable_key');

// Create payment method
final paymentMethod = await payvost.createPaymentMethod(
  PaymentMethodData(
    card: CardDetails(
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2025,
      cvc: '123',
    ),
  ),
);
```

**Repository:** [github.com/payvost/payvost-flutter](https://github.com/payvost/payvost-flutter)

---

## Community SDKs

These SDKs are maintained by the community:

- **Rust**: [payvost-rs](https://github.com/community/payvost-rs)
- **Elixir**: [payvost_ex](https://github.com/community/payvost_ex)
- **Scala**: [payvost-scala](https://github.com/community/payvost-scala)

> Note: Community SDKs are not officially supported by Payvost.

## Framework Integrations

### Express.js

```javascript
const express = require('express');
const payvost = require('@payvost/node-sdk');

const app = express();
app.use(express.json());

const client = new payvost.Client(process.env.PAYVOST_API_KEY);

app.post('/api/payments', async (req, res) => {
  try {
    const payment = await client.payments.create(req.body);
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Django

```python
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import payvost

client = payvost.Client(os.environ['PAYVOST_API_KEY'])

@csrf_exempt
def create_payment(request):
    try:
        payment = client.payments.create(
            amount=request.POST.get('amount'),
            currency=request.POST.get('currency')
        )
        return JsonResponse(payment)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
```

### Laravel

```php
use Payvost\Laravel\Facades\Payvost;

Route::post('/payments', function (Request $request) {
    $payment = Payvost::payments()->create([
        'amount' => $request->input('amount'),
        'currency' => $request->input('currency')
    ]);
    
    return response()->json($payment);
});
```

### Ruby on Rails

```ruby
class PaymentsController < ApplicationController
  def create
    payment = Payvost::Payment.create(
      amount: params[:amount],
      currency: params[:currency]
    )
    
    render json: payment
  rescue Payvost::PayvostError => e
    render json: { error: e.message }, status: 400
  end
end
```

## CLI Tool

Install the Payvost CLI for quick testing and management:

```bash
npm install -g @payvost/cli
```

**Usage:**

```bash
# Login
payvost login

# Create a payment
payvost payments create --amount 5000 --currency USD

# List payments
payvost payments list

# Retrieve a payment
payvost payments retrieve pay_1234567890

# Test webhooks
payvost webhooks test --endpoint https://yourapp.com/webhooks
```

## SDK Features

All official SDKs include:

- ✅ Automatic retries with exponential backoff
- ✅ Idempotency key support
- ✅ Webhook signature verification
- ✅ Type definitions (where applicable)
- ✅ Comprehensive error handling
- ✅ Request logging and debugging
- ✅ Connection pooling
- ✅ Timeout configuration

## Version Compatibility

| SDK | Minimum Version | API Version |
|-----|----------------|-------------|
| Node.js | 14.x | v1 |
| Python | 3.7+ | v1 |
| PHP | 7.4+ | v1 |
| Ruby | 2.7+ | v1 |
| Go | 1.16+ | v1 |
| Java | 8+ | v1 |
| .NET | 5.0+ | v1 |

## Getting Help

- 📖 [API Reference](https://docs.payvost.com/api)
- 💬 [Discord Community](https://discord.gg/payvost)
- 🐛 [Report SDK Issues](https://github.com/payvost)
- 📧 [Email Support](mailto:support@payvost.com)

## Contributing

We welcome contributions to our SDKs! See each repository's CONTRIBUTING.md for guidelines.
