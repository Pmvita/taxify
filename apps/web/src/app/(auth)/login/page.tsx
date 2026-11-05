'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSupabaseClient()
      .then(() => setReady(true))
      .catch(() => setConfigured(false))
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        const supabase = await getSupabaseClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } catch (err: any) {
        setError(err?.message ?? 'Could not sign in. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    },
    [email, password]
  );

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 shadow-[var(--shadow)]">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Want to keep calculating?</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Taxify is free to try. Enter your email and we&rsquo;ll send you a link to sign in (email confirmation is disabled for development).
        </p>

        {!configured ? (
          <div className="mt-4 rounded-xl bg-[var(--orange-soft)] p-4 text-sm text-[var(--orange-600)]">
            Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment to enable sign-in.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Email</label>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm outline-none focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-sm outline-none focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
              />
            </div>
            {error ? <p className="text-sm text-[var(--orange-600)]">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-[var(--steel)] text-white text-sm font-semibold shadow-sm hover:bg-[var(--steel-600)] transition disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-[var(--muted)]">
          Free trial starts now. No credit card required; you can switch plans later.
        </p>
      </div>
    </div>
  );
}
