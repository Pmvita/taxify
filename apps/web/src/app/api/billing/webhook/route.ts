import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/billing/webhook
 *
 * Handles Stripe webhooks to manage subscription events.
 * When a checkout.session.completed event is received, the user's
 * plan level can be updated in your database.
 *
 * Requires STRIPE_SECRET_KEY environment variable.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('stripe-signature');

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

    let event;

    try {
      const rawBody = await request.text();
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature ?? '',
        process.env.STRIPE_WEBHOOK_SECRET ?? ''
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        // In production, update the user's plan in your database.
        // Example: await db.subscriptions.update({ customerId, plan: 'pro' })
        console.log('Checkout session completed:', event.data.object.id);
        break;

      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object.id);
        break;

      case 'customer.subscription.deleted':
        console.log('Subscription deleted:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
