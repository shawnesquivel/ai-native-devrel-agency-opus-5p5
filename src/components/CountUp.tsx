"use client";

import { useEffect, useRef, useState } from "react";

const fmt = new Intl.NumberFormat("en-US");

export default function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setN(Math.round(eased * value));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  const final = `${fmt.format(value)}${suffix}`;
  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span className="invisible">{final}</span>
      <span className="absolute inset-0" aria-hidden="true">
        {fmt.format(n)}
        {suffix}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
