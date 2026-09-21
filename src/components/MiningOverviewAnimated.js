"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

// Lenis-aware scroll shift that keeps the remaining momentum
function shiftScroll(diff) {
  const lenis = typeof window !== "undefined" ? window.__lenis : null;

  if (!lenis) {
    window.scrollBy(0, diff);
    return;
  }

  // Distance Lenis was still going to travel (the momentum we don't want to lose)
  const remaining = (lenis.targetScroll ?? lenis.scroll) - lenis.scroll;

  lenis.resize();
  const base = lenis.scroll + diff;
  lenis.scrollTo(base, { immediate: true, force: true });

  // Re-apply the leftover momentum so the scroll keeps flowing
  if (Math.abs(remaining) > 1) {
    lenis.scrollTo(base + remaining, {
      duration: 0.5,
      force: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  }
}

export default function MiningOverviewAnimated({ data }) {
  const containerRef = useRef(null);
  const anchorRef = useRef(null); // reference point used to keep the page still when collapsing
  const lastScrollY = useRef(0);
  const modeRef = useRef("pin");

  const [mode, setMode] = useState("pin"); // "pin" = top->bottom, "free" = passed / scrolled up
  const [shifted, setShifted] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;

      if (window.innerWidth < 768) return;

      const el = containerRef.current;
      if (!el) return;

      const currentY = window.scrollY;
      const goingUp = currentY < lastScrollY.current;
      lastScrollY.current = currentY;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      /* ---------- FREE MODE ---------- */
      if (modeRef.current === "free") {
        // Re-arm only once the section is fully below the viewport
        if (rect.top >= vh) {
          modeRef.current = "pin";
          setMode("pin");
          setShifted(false);
        }
        return;
      }

      /* ---------- PIN MODE ---------- */
      const total = rect.height - vh;
      if (total <= 0) return;

      // 1) Silent switch: section is completely above the viewport (passed going down)
      if (rect.bottom <= 0) {
        anchorRef.current = { kind: "bottom", value: rect.bottom };
        modeRef.current = "free";
        setMode("free");
        setShifted(true);
        return;
      }

      // 2) Fallback: user reversed direction while still inside the section
      const isPinned = rect.top <= 0 && rect.bottom > vh;
      const isAfter = rect.top <= 0 && rect.bottom <= vh;

      if (goingUp && (isPinned || isAfter)) {
        anchorRef.current = {
          kind: "top",
          value: isPinned ? 0 : rect.bottom - vh,
        };
        modeRef.current = "free";
        setMode("free");
        setShifted(true);
        return;
      }

      if (rect.top >= 0) {
        setShifted(false);
        return;
      }

      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      setShifted(progress > 0.05);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    lastScrollY.current = window.scrollY;
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // After switching to free mode, keep the page visually still
  useLayoutEffect(() => {
    if (mode !== "free" || !anchorRef.current) return;

    const el = containerRef.current;
    if (!el) return;

    const { kind, value } = anchorRef.current;
    anchorRef.current = null;

    const rect = el.getBoundingClientRect();
    const now = kind === "bottom" ? rect.bottom : rect.top;
    const diff = now - value;

    if (diff !== 0) shiftScroll(diff);
  }, [mode]);

  const isPinMode = mode === "pin";
  const fade = isPinMode ? "transition-all duration-500 ease-out" : "transition-none";
  const imageFade = isPinMode
    ? "transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
    : "transition-none";

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-white ${
        isPinMode ? "md:h-[105vh]" : "md:py-20"
      }`}
    >
      <div
        className={`flex w-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8 ${
          isPinMode
            ? "md:sticky md:top-0 md:h-screen md:overflow-hidden md:py-0"
            : "relative md:py-0"
        }`}
      >
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* HEADING (Left Column on Desktop) */}
          <div
            className={`order-1 md:order-1 ${fade} ${
              shifted
                ? "opacity-100 md:translate-x-0"
                : "opacity-100 pointer-events-auto md:pointer-events-none md:-translate-x-8 md:opacity-0"
            }`}
          >
            <h2 className="mb-1.5 text-3xl font-normal leading-tight tracking-tight text-[#dc5835] sm:text-4xl lg:text-5xl">
              {data.titleLine1}
              <br />
              {data.titleLine2}
            </h2>

            {/* Desktop Description */}
            <p className="mt-2 hidden max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg md:block">
              {data.description}
            </p>
          </div>

          {/* IMAGE CONTAINER (Right Column on Desktop) */}
          <div className="relative order-2 h-[280px] w-full sm:h-[360px] md:order-2 md:z-10 lg:h-[400px]">
            <div
              className={`relative h-full w-full overflow-hidden rounded-xs bg-white md:absolute md:inset-0 ${imageFade} ${
                shifted
                  ? "md:translate-x-0"
                  : "md:-translate-x-1/2 md:lg:-translate-x-[calc(50%+2rem)]"
              }`}
            >
              <Image
                src={data.image.src}
                alt={data.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* MOBILE DESCRIPTION */}
          <div className="order-3 md:hidden">
            <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}