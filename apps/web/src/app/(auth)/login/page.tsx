'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [configured, setConfigured] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSupabaseClient()
      .then(() => setReady(true))
      .catch(() => setConfigured(false))
      .finally(() => setReady(true));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/pricing');
    } catch (err: any) {
      setError(err?.message ?? 'Could not sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <div className="mx-auto w-full max-w-md px-5 pt-12 sm:pt-20">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 shadow-[var(--shadow)]">
        <h1 className="text-xl font-semibold text-[var(--ink)]">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Enter your credentials to access your tax calculations.
        </p>

        {!configured ? (
          <div className="mt-4 rounded-xl bg-[var(--orange-soft)] p-4 text-sm text-[var(--orange-600)]">
            Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY to enable sign-in.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-base shadow-sm outline-none transition focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] text-base shadow-sm outline-none transition focus:border-[var(--steel)] focus:ring-2 focus:ring-[var(--steel)]/20"
              />
            </div>
            {error ? (
              <p className="text-sm text-[var(--orange-600)]">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[var(--steel)] text-white text-base font-semibold shadow-sm hover:bg-[var(--steel-600)] transition disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-[var(--muted)]">
          Free trial starts now. No credit card required; you can switch plans
          later.
        </p>
      </div>
    </div>
  );
}
