"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { aboutData } from "@/data/about";

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

function parseStatNumber(value) {
  const text = String(value);
  const match = text.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);

  if (!match) {
    return { prefix: "", target: 0, suffix: text, decimals: 0 };
  }

  const [, prefix, numericValue, suffix] = match;
  const decimals = numericValue.includes(".")
    ? numericValue.split(".")[1].length
    : 0;

  return { prefix, target: Number(numericValue), suffix, decimals };
}

function formatStatValue(stat, value) {
  const formattedNumber =
    stat.decimals > 0 ? value.toFixed(stat.decimals) : Math.round(value);
  return `${stat.prefix}${formattedNumber}${stat.suffix}`;
}

export default function AboutSection() {
  const {
    experience,
    stats,
    headingLine1,
    headingLine2,
    description,
    eyebrow,
    coreValues,
  } = aboutData.aboutSection;

  const statsRef = useRef(null);
  const anchorRef = useRef(null);
  const pinContainerRef = useRef(null);
  const lastScrollY = useRef(0);
  const modeRef = useRef("pin");

  const [isScrolled, setIsScrolled] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showEyebrow, setShowEyebrow] = useState(false);
  const [showCoreValues, setShowCoreValues] = useState(false);
  const [mode, setMode] = useState("pin"); // "pin" = top->bottom, "free" = scrolled past / up

  const allStats = useMemo(
    () => (experience ? [experience, ...stats] : stats),
    [experience, stats],
  );

  const parsedStats = useMemo(
    () => allStats.map((stat) => parseStatNumber(stat.number)),
    [allStats],
  );

  const [animatedValues, setAnimatedValues] = useState(() =>
    parsedStats.map(() => 0),
  );

  // Scrolled flag
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Start count-up once
  useEffect(() => {
    const element = statsRef.current;
    if (!element || hasStarted) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Count-up animation (runs once)
  useEffect(() => {
    if (!hasStarted) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setAnimatedValues(parsedStats.map((s) => s.target));
      return undefined;
    }

    let frame;
    const duration = 1200;
    const startedAt = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValues(parsedStats.map((s) => s.target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [hasStarted, parsedStats]);

  // Pin/free switching + reveal progress
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;

      const currentY = window.scrollY;
      const goingUp = currentY < lastScrollY.current;
      lastScrollY.current = currentY;

      const el = pinContainerRef.current;
      if (!el) return;

      // Mobile: no pin, nothing hidden
      if (window.innerWidth < 768) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      /* ---------- FREE MODE ---------- */
      if (modeRef.current === "free") {
        // Re-arm only once the section is fully below the viewport
        if (rect.top >= vh) {
          modeRef.current = "pin";
          setMode("pin");
          setShowEyebrow(false);
          setShowCoreValues(false);
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
        setShowEyebrow(true);
        setShowCoreValues(true);
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
        setShowEyebrow(true);
        setShowCoreValues(true);
        return;
      }

      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      setShowEyebrow(progress >= 0.35);
      setShowCoreValues(progress >= 0.7);
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

    const el = pinContainerRef.current;
    if (!el) return;

    const { kind, value } = anchorRef.current;
    anchorRef.current = null;

    const rect = el.getBoundingClientRect();
    const now = kind === "bottom" ? rect.bottom : rect.top;
    const diff = now - value;

    if (diff !== 0) shiftScroll(diff);
  }, [mode]);

  const isPinMode = mode === "pin";

  // No transitions in free mode so content appears instantly
  const eyebrowFade = isPinMode
    ? "transition-all duration-700 ease-out"
    : "transition-none";

  return (
    <section
      id="about"
      className="relative w-full bg-white text-gray-900 md:py-12"
    >
      {/* Statistics Container */}
      <div
        ref={statsRef}
        className={`relative z-20 mx-auto mt-16 w-[calc(100%-2rem)] max-w-7xl transition-all duration-700 ease-out sm:mt-20 sm:w-[calc(100%-3rem)] ${
          isScrolled ? "md:-mt-24 lg:-mt-32" : "md:mt-0 md:w-full"
        }`}
      >
        <div
          className={`grid grid-cols-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_14px_40px_rgba(35,71,150,0.10)] transition-all duration-700 ease-out ${
            isScrolled
              ? "md:grid-cols-5"
              : "md:grid-cols-4 md:rounded-none md:border-x-0 md:bg-transparent md:shadow-none"
          }`}
        >
          {allStats.map((stat, index) => {
            const isLastItem = index === allStats.length - 1;
            const isFifthItem = index === 4;
            const isExperience = Boolean(experience) && index === 0;

            let visibility = "flex";
            if (isFifthItem) visibility = "hidden md:flex";
            else if (isExperience && !isScrolled) visibility = "flex md:hidden";

            return (
              <div
                key={`${stat.label}-${index}`}
                className={`min-h-[120px] flex-col justify-center px-5 py-6 sm:min-h-[145px] sm:px-8 lg:px-10 ${visibility} ${
                  !isLastItem ? "border-gray-100 md:border-r" : ""
                } ${index < 2 ? "border-b md:border-b-0" : ""}`}
              >
                <span className="text-3xl font-normal leading-none tracking-tight text-[#234796] sm:text-4xl lg:text-[46px]">
                  {formatStatValue(parsedStats[index], animatedValues[index] ?? 0)}
                </span>
                <span className="mt-2.5 text-xs font-normal leading-snug text-gray-700 sm:text-sm lg:text-base">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pinned section (pin mode) / normal flow (free mode) */}
      <div
        ref={pinContainerRef}
        className={`relative w-full ${isPinMode ? "md:h-[300vh]" : ""}`}
      >
        <div
          className={`relative flex w-full flex-col justify-center py-12 ${
            isPinMode ? "md:sticky md:top-0 md:h-screen md:py-0" : "md:py-12"
          }`}
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col justify-between px-4 sm:px-6 lg:px-8">
            {/* Middle Section */}
            <div className="mx-auto flex max-w-3xl flex-col items-center pb-6 pt-6 text-center md:pb-8 md:pt-12">
              <h2 className="text-center text-3xl font-normal leading-[1.2] tracking-tight text-[#dc5835] sm:text-4xl lg:text-[42px]">
                {headingLine1}
                <br />
                {headingLine2}
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-normal leading-relaxed text-gray-600 sm:mt-5 sm:text-base">
                {description}
              </p>

              <div
                className={`my-5 h-8 w-px bg-gray-300 sm:my-6 sm:h-10 ${eyebrowFade} ${
                  showEyebrow ? "md:opacity-100" : "md:opacity-0"
                }`}
              />

              <p
                className={`text-xs font-medium uppercase tracking-[0.2em] text-[#dc5835] sm:text-[13px] ${eyebrowFade} ${
                  showEyebrow
                    ? "md:translate-y-0 md:opacity-100"
                    : "md:translate-y-3 md:opacity-0"
                }`}
              >
                {eyebrow}
              </p>
            </div>

            {/* Core Values */}
            <div className="mx-auto w-full max-w-5xl pb-6">
              <div className="grid grid-cols-2 divide-y divide-gray-200 md:grid-cols-4 md:divide-x md:divide-y-0">
                {coreValues.map((value, index) => (
                  <div
                    key={value.title || index}
                    style={{
                      transitionDelay:
                        isPinMode && showCoreValues ? `${index * 80}ms` : "0ms",
                    }}
                    className={`group flex transform flex-col items-center justify-center px-4 py-4 text-center md:py-2 ${eyebrowFade} ${
                      showCoreValues
                        ? "md:translate-y-0 md:opacity-100"
                        : "md:translate-y-3 md:opacity-0"
                    } motion-reduce:transform-none motion-reduce:transition-none`}
                  >
                    <div className="relative h-11 w-11 transition-transform duration-300 ease-out sm:h-12 sm:w-12 md:group-hover:-translate-y-0.5">
                      <Image
                        src={value.icon}
                        alt={value.title}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <span className="mt-2.5 text-sm font-normal leading-snug text-gray-800 sm:mt-3 sm:text-base">
                      {value.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}