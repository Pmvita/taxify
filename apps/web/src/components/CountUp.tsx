'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  format?: (n: number) => string;
  durationMs?: number;
  className?: string;
}

/** Lightweight currency/number tween inspired by 21st.dev ticker patterns. */
export function CountUp({
  value,
  format = (n) => n.toLocaleString('en-CA', { maximumFractionDigits: 0 }),
  durationMs = 650,
  className,
}: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }

    const from = fromRef.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else fromRef.current = value;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, reduced]);

  return (
    <span className={className} aria-label={format(value)}>
      {format(display)}
    </span>
  );
}
