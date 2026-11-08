import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/billing/checkout
 *
 * Creates a Stripe Checkout Session for the Pro plan.
 *
 * Requires STRIPE_SECRET_KEY environment variable.
 *
 * Body:
 * {
 *   successUrl?: string;
 *   cancelUrl?: string;
 * }
 *
 * Response:
 * {
 *   sessionId: string;
 *   url: string;
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { successUrl, cancelUrl } = body ?? {};

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY is not configured' },
        { status: 500 }
      );
    }

    // Dynamic import to avoid loading @stripe/stripe-js on the client side.
    const { Stripe } = await import('stripe');

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Taxify Pro',
              description: 'Unlimited calculators, PDF exports, multi-year rates',
            },
            unit_amount: 1200, // $12.00 USD monthly
          },
          quantity: 1,
        },
      ],
      success_url: successUrl ?? `${request.nextUrl.origin}/pricing?active=pro&checkout=success`,
      cancel_url: cancelUrl ?? `${request.nextUrl.origin}/pricing?checkout=cancelled`,
      metadata: {
        plan: 'pro',
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
