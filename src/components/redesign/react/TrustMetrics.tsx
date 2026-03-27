import React, { useCallback, useEffect, useRef, useState } from "react";

import type { TrustMetric, TrustMetricsProps } from "../types";

/**
 * Easing function (ease-out cubic) for count-up animation.
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Single metric display with optional count-up animation.
 */
function MetricItem({
  metric,
  isVisible,
}: {
  metric: TrustMetric;
  isVisible: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);
  const isNumeric = metric.numericValue != null;
  const suffix = isNumeric ? metric.value.replace(String(metric.numericValue), "") : "";

  const animate = useCallback(() => {
    if (!isNumeric || !metric.numericValue) return;

    const target = metric.numericValue;
    const duration = 1500;
    const start = performance.now();

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(easedProgress * target);

      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    }

    animationRef.current = requestAnimationFrame(step);
  }, [isNumeric, metric.numericValue]);

  useEffect(() => {
    if (isVisible && !hasAnimated.current && isNumeric) {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        setDisplayValue(metric.numericValue ?? 0);
      } else {
        animate();
      }
      hasAnimated.current = true;
    }

    return () => {
      if (animationRef.current != null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, isNumeric, metric.numericValue, animate]);

  return (
    <div className="text-center lg:text-left">
      <div
        data-testid="metric-value"
        className="text-3xl font-bold text-text-bright lg:text-4xl"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {isNumeric ? `${displayValue}${suffix}` : metric.value}
      </div>
      <div
        data-testid="metric-label"
        className="mt-1 text-sm text-text-muted"
      >
        {metric.label}
      </div>
      {/* Screen reader: always show final value */}
      <span className="sr-only">
        {metric.value} {metric.label}
      </span>
    </div>
  );
}

/**
 * TrustMetrics — displays trust stats with count-up animation on viewport entry.
 */
export default function TrustMetrics({ metrics }: TrustMetricsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-10 grid grid-cols-3 gap-6 lg:mt-12"
    >
      {metrics.map((metric, i) => (
        <MetricItem key={i} metric={metric} isVisible={isVisible} />
      ))}
    </div>
  );
}
