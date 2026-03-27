import React from "react";

import type { HeroVisualProps } from "../types";

/**
 * HeroVisual — floating glassmorphism mockup composition.
 * Pure CSS animations, no JS state needed. Decorative only.
 */
export default function HeroVisual({ className = "" }: HeroVisualProps) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={`relative h-[420px] w-full lg:h-[480px] ${className}`}
    >
      {/* Background glow shapes */}
      <div
        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.3), transparent)",
          willChange: "transform",
        }}
      />
      <div
        className="absolute top-1/3 right-0 h-48 w-48 rounded-full blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.25), transparent)",
          willChange: "transform",
        }}
      />

      {/* Main floating glass panel — AI chat mockup */}
      <div
        className="absolute top-8 right-4 left-4 motion-safe:animate-[float_6s_ease-in-out_infinite]"
        style={{ willChange: "transform" }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
          {/* Mock header */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="bg-accent-cyan/60 inline-block h-3 w-3 rounded-full" />
              <span className="bg-accent-teal/60 inline-block h-3 w-3 rounded-full" />
              <span className="bg-accent-violet/60 inline-block h-3 w-3 rounded-full" />
            </div>
            <div className="h-2.5 w-28 rounded-full bg-white/10" />
          </div>

          {/* Mock conversation */}
          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="bg-accent-cyan/20 h-3 w-40 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-56 rounded-full bg-white/10" />
              <div className="h-3 w-48 rounded-full bg-white/10" />
              <div className="h-3 w-32 rounded-full bg-white/10" />
            </div>
            <div className="flex justify-end">
              <div className="bg-accent-cyan/20 h-3 w-36 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-52 rounded-full bg-white/10" />
              <div className="h-3 w-44 rounded-full bg-white/10" />
            </div>
          </div>

          {/* Mock input */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
            <div className="h-2.5 flex-1 rounded-full bg-white/10" />
            <div className="bg-accent-cyan/30 h-6 w-6 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Secondary floating card — slight offset and counter-rotation */}
      <div
        className="absolute right-2 bottom-12 w-48 motion-safe:animate-[float_8s_ease-in-out_infinite_1s]"
        style={{ willChange: "transform" }}
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2">
            <div className="bg-accent-teal/20 h-8 w-8 rounded-lg" />
            <div className="space-y-1">
              <div className="h-2 w-16 rounded-full bg-white/15" />
              <div className="h-2 w-12 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="bg-accent-cyan/15 h-1.5 w-full rounded-full" />
            <div className="bg-accent-teal/15 h-1.5 w-3/4 rounded-full" />
            <div className="bg-accent-violet/15 h-1.5 w-1/2 rounded-full" />
          </div>
        </div>
      </div>

      {/* Tertiary small floating card — analytics chip */}
      <div
        className="absolute top-4 right-0 w-36 motion-safe:animate-[float_7s_ease-in-out_infinite_2s]"
        style={{ willChange: "transform" }}
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <div className="h-2 w-10 rounded-full bg-white/15" />
            <div className="bg-accent-cyan/20 h-5 w-5 rounded-full" />
          </div>
          <div className="text-accent-cyan/80 text-xl font-bold">↑ 42%</div>
          <div className="mt-1 h-1.5 w-20 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
