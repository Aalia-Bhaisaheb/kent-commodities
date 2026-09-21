"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function MiningOverviewAnimated({ data }) {
  const containerRef = useRef(null);
  const lastScrollY = useRef(0);

  const [progress, setProgress] = useState(0);
  const [isUpwardFlow, setIsUpwardFlow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      if (window.innerWidth < 768) return;

      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      lastScrollY.current = currentScrollY;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = containerRef.current.clientHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      // 1. Entering or moving upward through the section from below
      if (isScrollingUp && rect.top < 0) {
        setIsUpwardFlow(true);
      }

      // 2. User reverses direction to scroll DOWN again
      if (isScrollingDown && isUpwardFlow) {
        setIsUpwardFlow(false);
      }

      // 3. Reset progress when scrolled above the animation entry point
      if (rect.top >= 0) {
        setIsUpwardFlow(false);
        setProgress(0);
        return;
      }

      // Calculate scroll progress for down-scroll
      const currentScroll = -rect.top;
      const rawProgress = Math.min(
        Math.max(currentScroll / totalScrollable, 0),
        1
      );

      setProgress(rawProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isUpwardFlow]);

  // When scrolling down, activate animation once progress crosses threshold.
  // When scrolling up, keep shifted state static without animations.
  const isShifted = isUpwardFlow || progress > 0.05;

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-white ${
        isUpwardFlow ? "h-auto py-12 md:py-20" : "md:h-[105vh]"
      }`}
    >
      <div
        className={`flex w-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8 ${
          isUpwardFlow
            ? "relative h-auto md:py-0"
            : "md:sticky md:top-0 md:h-screen md:overflow-hidden md:py-0"
        }`}
      >
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12 lg:gap-16">
          
          {/* HEADING (Left Column on Desktop) */}
          <div
            className={`order-1 md:order-1 ${
              isUpwardFlow
                ? "!transition-none !transform-none !opacity-100 !pointer-events-auto"
                : "transition-all duration-500 ease-out"
            } ${
              isShifted
                ? "opacity-100 md:translate-x-0"
                : "opacity-100 pointer-events-auto md:opacity-0 md:pointer-events-none md:-translate-x-8"
            }`}
          >
            <h2 className="mb-1.5 text-3xl font-normal leading-tight tracking-tight text-[#dc5835] sm:text-4xl lg:text-5xl">
              {data.titleLine1}
              <br />
              {data.titleLine2}
            </h2>

            {/* Desktop Description */}
            <p className="hidden mt-2 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg md:block">
              {data.description}
            </p>
          </div>

          {/* IMAGE CONTAINER (Right Column on Desktop) */}
          <div className="order-2 relative h-[280px] w-full sm:h-[360px] md:order-2 md:z-10 lg:h-[400px]">
            <div
              className={`relative h-full w-full overflow-hidden rounded-xs bg-white md:absolute md:inset-0 ${
                isUpwardFlow
                  ? "!transition-none !transform-none"
                  : "transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              } ${
                isShifted
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