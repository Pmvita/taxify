'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    const initCheckout = async () => {
      try {
        const supabase = await getSupabaseClient();
        const { data: { user } = {} } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            successUrl: `${window.location.origin}/pricing?checkout=success`,
            cancelUrl: `${window.location.origin}/pricing?checkout=cancelled`,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        console.error('Checkout initialization failed:', err);
        router.push('/pricing?error=checkout');
      }
    };

    initCheckout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-[var(--muted)]">Redirecting to checkout…</p>
    </div>
  );
}
