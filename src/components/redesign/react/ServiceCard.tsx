import React, { useCallback, useEffect, useRef, useState } from "react";

import type { ServiceCardProps } from "../types";

/** Inline SVG icons mapped by identifier — no external dependency */
const icons: Record<string, React.ReactElement> = {
  code: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  zap: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  sparkles: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
      <path d="M19 8l.7 2.1a1 1 0 0 0 .6.6L22.5 11.5l-2.1.7a1 1 0 0 0-.6.6L19 15l-.7-2.1a1 1 0 0 0-.6-.6L15.5 11.5l2.1-.7a1 1 0 0 0 .6-.6L19 8z" />
    </svg>
  ),
  megaphone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M3 11l18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  cube: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
};

export default function ServiceCard({ icon, title, description, index }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion.current) {
      setIsVisible(true);
    }
  }, []);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    },
    []
  );

  useEffect(() => {
    const el = cardRef.current;
    if (!el || prefersReducedMotion.current) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  const staggerDelay = prefersReducedMotion.current ? "0ms" : `${index * 120}ms`;

  return (
    <div
      ref={cardRef}
      className="group bg-midnight-surface hover:border-accent-cyan/30 hover:shadow-accent-cyan/5 rounded-2xl border border-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: prefersReducedMotion.current
          ? "none"
          : "opacity 600ms ease-out, transform 600ms ease-out",
        transitionDelay: staggerDelay,
      }}
    >
      {/* Icon */}
      <div className="text-accent-cyan mb-4 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        {icons[icon] ?? icons.code}
      </div>

      {/* Title */}
      <h3 className="font-sora text-text-bright text-lg font-semibold">{title}</h3>

      {/* Description */}
      <p className="text-text-muted mt-2 text-sm leading-relaxed">{description}</p>

      {/* Arrow indicator */}
      <div className="mt-4 flex justify-end">
        <span
          className="text-text-muted group-hover:text-accent-cyan transition-all duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </div>
  );
}
