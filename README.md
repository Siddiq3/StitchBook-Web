# StitchBook Web

React web frontend for the StitchBook tailoring platform.

## Routes

- `/` - premium public landing page
- `/about` - brand, mission, team, and contact page
- `/checkout` - Razorpay checkout page opened from the mobile app
- `/payment-success` - payment success result screen
- `/payment-failure` - payment failure result screen

## Checkout URL Example

```text
http://localhost:5173/checkout?checkoutToken=SHORT_LIVED_CHECKOUT_TOKEN
```

Only pass this param:

- `checkoutToken`

Do not pass the user access token in the URL.

## Secure Payment Flow

Set these in `.env`:

```bash
VITE_API_BASE_URL=http://localhost:5002/api
```

The React Native app should first call the protected backend API:

```http
POST /api/payment/razorpay/create-order
```

Example request from mobile:

```json
{
  "orderId": "123",
  "amount": 1499,
  "customer": {
    "name": "Aarav",
    "email": "aarav@example.com",
    "phone": "9876543210"
  }
}
```

The backend returns:

```json
{
  "checkoutToken": "short_token",
  "checkoutUrl": "/checkout?checkoutToken=short_token",
  "razorpayOrderId": "order_xxx",
  "keyId": "rzp_xxx"
}
```

Then mobile opens:

```text
http://localhost:5173/checkout?checkoutToken=short_token
```

The web page will:

- fetch safe checkout details using `GET /api/payment/checkout-session/:checkoutToken`
- open Razorpay checkout
- send Razorpay IDs to `POST /api/payment/razorpay/verify-payment`
- backend verifies the Razorpay signature
- backend records payment in the existing payments table

## Backend Notes

The backend records payments and recalculates `advance_paid` / `balance_due`. The checkout session expires after 15 minutes.

For local web development, add the Vite origin to the backend environment because backend CORS is whitelist-based:

```bash
FRONTEND_URLS=http://localhost:5173,http://localhost:8081,http://localhost:3000
```
