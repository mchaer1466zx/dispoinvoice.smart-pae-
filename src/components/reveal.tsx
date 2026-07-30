"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal halus: konten mulai sedikit turun & transparan, lalu naik &
 * memunculkan diri saat masuk viewport (sekali). Tanpa React state (pakai
 * data-attribute via ref) supaya bebas re-render, dan menghormati
 * prefers-reduced-motion — pengguna yang meminimalkan gerak langsung melihat
 * konten penuh. Transisi 300ms ease-out, tidak ada efek memantul.
 */
export function Reveal({
  children,
  delayMs = 0,
  className,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      el.dataset.shown = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.shown = "true";
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-shown="false"
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        "translate-y-3 opacity-0 transition-[opacity,transform] duration-300 ease-out will-change-transform data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
