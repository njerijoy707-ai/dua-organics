/**
 * Dua Organics — Scroll Animation Hook
 *
 * Uses IntersectionObserver to trigger fade-in animations
 * when elements scroll into the viewport.
 *
 * Returns a ref to attach to the element, a boolean for visibility,
 * and a style object that handles the actual animation via inline
 * styles (immune to Tailwind purging).
 */
import { useEffect, useRef, useState, useMemo, type CSSProperties } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  delay?: number;      /* Animation delay in ms */
  duration?: number;    /* Animation duration in ms */
  distance?: number;    /* translateY distance in px */
}

export function useScrollAnimation(opts: ScrollAnimationOptions = {}) {
  const { threshold = 0.1, delay = 0, duration = 800, distance = 40 } = opts;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        /* Once visible, stay visible (don't re-hide on scroll away) */
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  /* Build inline styles for the animation — avoids Tailwind purge issues */
  const style: CSSProperties = useMemo(() => {
    if (isVisible) {
      return {
        opacity: 1,
        transform: 'translateY(0)',
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      };
    }
    return {
      opacity: 0,
      transform: `translateY(${distance}px)`,
      transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
    };
  }, [isVisible, delay, duration, distance]);

  return { ref, isVisible, style };
}
