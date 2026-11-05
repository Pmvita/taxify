// Stripe client helper for the Taxify web app (free-trial billing).
//
// In production, set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
// This module only exposes client-safe primitives. Server-side billing (webhooks,
// creating Checkout Sessions) belongs in a Next.js route handler or server action.

import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripeInstance: Promise<Stripe | null> | null = null;

export function getStripeClient(): Promise<Stripe | null> {
  if (stripeInstance) {
    return stripeInstance;
  }

  const publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? process.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // Dev without Stripe: return null (the UI shows a graceful "not configured" state).
    stripeInstance = Promise.resolve(null);
    return stripeInstance;
  }

  stripeInstance = loadStripe(publishableKey);
  return stripeInstance;
}

export async function createCheckoutSession(
  secret: string,
  lineItems: Array<{ price: string; quantity?: number }> = [],
  { successUrl, cancelUrl }: { successUrl: string; cancelUrl: string }
): Promise<string> {
  // Built on the server: POST /api/billing/checkout with STRIPE_SECRET_KEY, then
  // redirect to the returned sessionUrl. Kept as a signature here so the free-trial
  // flow is explicit and not accidentally implemented with client-side secret keys.
  throw new Error(
    'createCheckoutSession is a server-only call. Implement /api/billing/checkout on the server and call it from a server action or route handler.'
  );
}
