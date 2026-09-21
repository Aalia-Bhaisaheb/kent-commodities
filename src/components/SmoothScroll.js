'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  // Create Lenis once, disable the browser's own scroll restoration (which
  // otherwise fights with Lenis and can land you mid-page on refresh/back),
  // and force the page to start at the top on first load.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis({
      duration: 1.2, // was 1.8 — that made every scroll feel delayed/heavy
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    // Expose globally so other components (e.g. your pinned sections) can
    // read scroll position/direction straight from Lenis instead of
    // tracking window.scrollY themselves — keeps everything in sync with
    // what's actually being rendered.
    window.__lenis = lenis;

    // Force to top on initial mount (covers hard refresh / first load)
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // Reset to top on every client-side route change (App Router navigations
  // don't reload the page, so without this you'd keep whatever scroll
  // position the previous page ended on).
  useEffect(() => {
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return children;
}