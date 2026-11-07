"use client";
/* eslint-disable react-hooks/immutability -- uniforms and the scroll/pointer bridge are mutated every frame on purpose, outside React renders. */

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { StatHeading } from "../../StatFlow";
import { PromptBox, useReducedMotion, useTypingCycle } from "../chatgpt-shared";
import { FINAL, QUESTIONS } from "./data";
import type { Bridge } from "./GlobeScene";

/* three.js and the scene load only on this route, after first paint. */
const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false, loading: () => null });

/** Without WebGL the stage stays a plain dark panel; the prompt box and headline still render. */
class NoWebGL extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const LABELS = 4;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function GlobeExperience() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(false);
  const [p, setP] = useState(0);
  const [bridge] = useState<Bridge>(() => ({ progress: 0, pointer: { x: 0, y: 0 }, labels: [], target: { x: 0, y: -0.62 } }));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setMobile(mq.matches);
      bridge.target.y = mq.matches ? -0.6 : -0.62;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [bridge]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const sticky = el.firstElementChild as HTMLElement;
      const range = r.height - sticky.offsetHeight;
      const v = range > 0 ? clamp(-(r.top - 64) / range) : 0;
      bridge.progress = v;
      setP(v);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [bridge]);

  useEffect(() => {
    const el = stage.current;
    if (!el || reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      bridge.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      bridge.pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      bridge.pointer.x = 0;
      bridge.pointer.y = 0;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [bridge, reduced]);

  const scripted = reduced || p >= 0.45;
  const idle = useTypingCycle(QUESTIONS, { active: active && !scripted, holdMs: 900 });
  const typed = reduced ? FINAL.length : Math.round(smooth(0.5, 0.76, p) * FINAL.length);
  const sent = !reduced && p > 0.8;
  const glow = reduced ? 0.4 : smooth(0.78, 0.95, p);

  return (
    <div ref={wrap} className={reduced ? "relative" : "relative h-[320svh]"}>
      <div className={reduced ? "py-4" : "sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center py-4 md:py-6"}>
        <div className="flex h-full max-h-[48rem] min-h-[34rem] flex-col overflow-hidden rounded-xl border border-line bg-card">
          <StatHeading className="pb-5 md:pb-6" />
          <div ref={stage} aria-hidden="true" className="relative min-h-0 flex-1 overflow-hidden bg-[#0c0c0b]">
            <NoWebGL>
              <GlobeScene bridge={bridge} mobile={mobile} reduced={reduced} active={active} />
            </NoWebGL>

            {Array.from({ length: LABELS }, (_, k) => (
              <span
                key={k}
                ref={(el) => {
                  bridge.labels[k] = el;
                }}
                className="globe-label pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[11px] text-[#ece9df] opacity-0 backdrop-blur-sm"
              />
            ))}

            <div
              className="absolute left-1/2 w-[min(23rem,calc(100%-2.5rem))] -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${((1 - (mobile ? -0.6 : -0.62)) / 2) * 100}%` }}
            >
              <div
                className="rounded-xl transition-shadow duration-500"
                style={{ boxShadow: `0 0 0 ${1 + glow * 2}px rgb(255 79 26 / ${0.15 + glow * 0.6}), 0 0 ${24 + glow * 50}px rgb(255 79 26 / ${0.1 + glow * 0.4})` }}
              >
                <PromptBox caret={!sent}>
                  {scripted ? (sent ? <span className="text-ink">{FINAL}</span> : FINAL.slice(0, typed)) : idle.text}
                </PromptBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
