"use client";

import { useEffect, useRef } from "react";
import { StatHeading } from "../StatFlow";
import { FINAL, PromptBox, QUESTIONS, useInView, useReducedMotion, useTypingCycle } from "./chatgpt-shared";

const PROMPTS = [...QUESTIONS.slice(5, 10), FINAL];
const INK = "18,18,17";
const ACCENT = "255,79,26";

type Flier = { p: number; t: number; speed: number; accent: boolean; sx: number; sy: number };

/** Fibonacci sphere: evenly spread unit vectors. */
function sphere(n: number) {
  const pts = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < n; k++) {
    const y = 1 - (k / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = golden * k;
    pts[k * 3] = Math.cos(a) * r;
    pts[k * 3 + 1] = y;
    pts[k * 3 + 2] = Math.sin(a) * r;
  }
  return pts;
}

export default function ChatGptGlobe() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);
  const reduced = useReducedMotion();
  const { text } = useTypingCycle(PROMPTS, { active: inView, holdMs: (n) => (n === PROMPTS.length - 1 ? 2600 : 900) });

  useEffect(() => {
    const el = canvas.current;
    const host = wrap.current;
    if (!el || !host) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let pts = sphere(1600);
    let fliers: Flier[] = [];
    const tilt = 0.42;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = host.clientWidth;
      h = host.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      const small = w < 640;
      pts = sphere(small ? 1100 : 2200);
      fliers = Array.from({ length: small ? 22 : 40 }, () => spawn(Math.random()));
    };

    const spawn = (t = 0): Flier => ({
      p: Math.floor(Math.random() * (pts.length / 3)),
      t,
      speed: 1 / (1500 + Math.random() * 1400),
      accent: Math.random() < 0.18,
      sx: NaN,
      sy: NaN,
    });

    const geometry = () => {
      const cx = w / 2;
      const cy = h * (w < 640 ? 0.38 : 0.4);
      const R = Math.min(w * 0.4, h * 0.33);
      const b = box.current?.getBoundingClientRect();
      const hr = host.getBoundingClientRect();
      const tx = b ? b.left - hr.left + b.width / 2 : cx;
      const ty = b ? b.top - hr.top + 8 : h * 0.8;
      return { cx, cy, R, tx, ty };
    };

    const project = (k: number, angle: number, cx: number, cy: number, R: number) => {
      const x = pts[k * 3];
      const y = pts[k * 3 + 1];
      const z = pts[k * 3 + 2];
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const x1 = x * ca + z * sa;
      const z1 = -x * sa + z * ca;
      const y2 = y * ct - z1 * st;
      const z2 = y * st + z1 * ct;
      const f = 2.6 / (2.6 - z2);
      return { sx: cx + x1 * R * f, sy: cy + y2 * R * f, z: z2 };
    };

    let raf = 0;
    let last = performance.now();
    let angle = 0;

    const frame = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      angle += dt * 0.00011;
      const { cx, cy, R, tx, ty } = geometry();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const n = pts.length / 3;
      for (let k = 0; k < n; k++) {
        const { sx, sy, z } = project(k, angle, cx, cy, R);
        const depth = (z + 1) / 2;
        ctx.fillStyle = `rgba(${INK},${(0.08 + depth * 0.62).toFixed(3)})`;
        const r = 0.55 + depth * 0.75;
        ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
      }

      for (const fl of fliers) {
        if (Number.isNaN(fl.sx)) {
          const s = project(fl.p, angle, cx, cy, R);
          if (s.z < 0.15) {
            fl.p = Math.floor(Math.random() * n);
            continue;
          }
          fl.sx = s.sx;
          fl.sy = s.sy;
        }
        fl.t += dt * fl.speed;
        if (fl.t >= 1) {
          Object.assign(fl, spawn());
          continue;
        }
        const qx = fl.sx + (tx - fl.sx) * 0.15;
        const qy = ty - (ty - fl.sy) * 0.15;
        const color = fl.accent ? ACCENT : INK;
        for (let s = 0; s < 5; s++) {
          const t = Math.max(0, fl.t - s * 0.018);
          const e = t * t;
          const u = 1 - e;
          const x = u * u * fl.sx + 2 * u * e * qx + e * e * tx;
          const y = u * u * fl.sy + 2 * u * e * qy + e * e * ty;
          const fade = Math.min(1, fl.t * 6) * Math.min(1, (1 - fl.t) * 8);
          ctx.fillStyle = `rgba(${color},${(fade * (1 - s / 5) * 0.9).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, (fl.accent ? 2.2 : 1.7) * (1 - s * 0.12), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!reduced && inView) raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || !inView) frame(performance.now());
    });
    ro.observe(host);
    last = performance.now();
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView, reduced]);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card">
      <StatHeading />
      <div ref={wrap} aria-hidden="true" className="relative h-[26rem] md:h-[32rem]">
        <canvas ref={canvas} className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-card via-card/80 to-transparent"
        />
        <div ref={box} className="absolute bottom-6 left-1/2 w-[min(22rem,calc(100%-2.5rem))] -translate-x-1/2 md:bottom-10">
          <PromptBox>{text}</PromptBox>
        </div>
      </div>
    </div>
  );
}
