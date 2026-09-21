"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { aboutData } from "@/data/about";

function parseStatNumber(value) {
  const text = String(value);
  const match = text.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);

  if (!match) {
    return {
      prefix: "",
      target: 0,
      suffix: text,
      decimals: 0,
    };
  }

  const [, prefix, numericValue, suffix] = match;

  const decimals = numericValue.includes(".")
    ? numericValue.split(".")[1].length
    : 0;

  return {
    prefix,
    target: Number(numericValue),
    suffix,
    decimals,
  };
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
  const pinContainerRef = useRef(null);
  const lastScrollY = useRef(0);
  
  const [scrollDir, setScrollDir] = useState("down");
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // 'before' -> not reached yet, 'pinned' -> fixed in viewport, 'after' -> released
  const [pinStatus, setPinStatus] = useState("before");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerRect, setContainerRect] = useState({ left: 0, width: 0 });

  const visibleStats = useMemo(() => {
    if (isScrolled && experience) {
      return [experience, ...stats];
    }
    return stats;
  }, [experience, isScrolled, stats]);

  const parsedStats = useMemo(
    () => visibleStats.map((stat) => parseStatNumber(stat.number)),
    [visibleStats],
  );

  const [animatedValues, setAnimatedValues] = useState(() =>
    parsedStats.map((stat) => stat.target),
  );

  // Track global scroll position & direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        setScrollDir("up");
      } else if (currentScrollY > lastScrollY.current) {
        setScrollDir("down");
      }

      lastScrollY.current = currentScrollY;
      setIsScrolled(currentScrollY > 140);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Statistics
  useEffect(() => {
    const element = statsRef.current;
    if (!element || hasStarted) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (scrollDir === "up") {
            setAnimatedValues(parsedStats.map((stat) => stat.target));
          }
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasStarted, parsedStats, scrollDir]);

  // Number counting animation
  useEffect(() => {
    if (!hasStarted) return undefined;

    if (scrollDir === "up") {
      setAnimatedValues(parsedStats.map((stat) => stat.target));
      return undefined;
    }

    let animationFrame;
    const duration = 1200;
    const startedAt = performance.now();

    setAnimatedValues(parsedStats.map(() => 0));

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues(parsedStats.map((stat) => stat.target * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, parsedStats, scrollDir]);

  /*
   * Pin & scroll reveal logic
   */
  useEffect(() => {
    const handlePinScroll = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);

      if (!desktop) return;

      const el = pinContainerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = rect.height - viewportHeight;

      setContainerRect({ left: rect.left, width: rect.width });

      // If scrolling UP: disable pin and release layout height
      if (scrollDir === "up") {
        setPinStatus("before");
        setScrollProgress(1);
        return;
      }

      // Scrolling DOWN logic:
      if (total <= 0) {
        setPinStatus("before");
        setScrollProgress(0);
        return;
      }

      if (rect.top > 0) {
        setPinStatus("before");
        setScrollProgress(0);
      } else if (rect.bottom <= viewportHeight) {
        setPinStatus("after");
        setScrollProgress(1);
      } else {
        setPinStatus("pinned");
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / total, 0), 1);
        setScrollProgress(progress);
      }
    };

    handlePinScroll();
    window.addEventListener("scroll", handlePinScroll, { passive: true });
    window.addEventListener("resize", handlePinScroll);
    return () => {
      window.removeEventListener("scroll", handlePinScroll);
      window.removeEventListener("resize", handlePinScroll);
    };
  }, [scrollDir]);

  const isScrollingUp = scrollDir === "up";

  // Visible during down-scroll progress OR instantly visible when scrolling up
  const showEyebrow = isScrollingUp || scrollProgress >= 0.35;
  const showCoreValues = isScrollingUp || scrollProgress >= 0.7;

  const wrapperStyle = isDesktop && !isScrollingUp
    ? pinStatus === "pinned"
      ? { position: "fixed", top: 0, left: containerRect.left, width: containerRect.width }
      : pinStatus === "after"
      ? { position: "absolute", left: 0, right: 0, bottom: 0 }
      : { position: "absolute", left: 0, right: 0, top: 0 }
    : undefined;

  return (
    <section
      id="about"
      className="relative w-full bg-white text-gray-900 md:py-12"
    >
      {/* Statistics */}
      <div
        ref={statsRef}
        className={`relative z-20 mx-auto transition-all duration-700 ease-out ${
          isScrolled
            ? "-mt-24 w-[calc(100%-2rem)] max-w-7xl sm:-mt-28 sm:w-[calc(100%-3rem)] lg:-mt-32"
            : "mt-0 w-full max-w-7xl"
        }`}
      >
        <div
          className={`grid grid-cols-2 overflow-hidden transition-all duration-700 ease-out ${
            isScrolled
              ? "rounded-xl border border-gray-100 bg-white shadow-[0_14px_40px_rgba(35,71,150,0.10)] md:grid-cols-5"
              : "rounded-none border-y border-gray-100 bg-transparent shadow-none md:grid-cols-4"
          }`}
        >
          {visibleStats.map((stat, index) => {
            const isLastItem = index === visibleStats.length - 1;

            return (
              <div
                key={`${stat.label}-${index}`}
                className={`flex min-h-[120px] flex-col justify-center px-5 py-6 transition-all duration-700 sm:min-h-[145px] sm:px-8 lg:px-10 ${
                  !isLastItem ? "border-gray-100 md:border-r" : ""
                } ${index < 2 ? "border-b md:border-b-0" : ""}`}
              >
                <span className="text-3xl font-normal leading-none tracking-tight text-[#234796] sm:text-4xl lg:text-[46px]">
                  {formatStatValue(parsedStats[index], animatedValues[index])}
                </span>
                <span className="mt-2.5 text-xs font-normal leading-snug text-gray-700 sm:text-sm lg:text-base">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Section + Core Values */}
      <div 
        ref={pinContainerRef} 
        className={`relative w-full ${
          isScrollingUp ? "h-auto" : "h-auto md:h-[300vh]"
        }`}
      >
        <div
          style={wrapperStyle}
          className={`relative flex w-full flex-col justify-center overflow-hidden py-12 ${
            isScrollingUp ? "md:py-12" : "md:absolute md:min-h-screen md:py-0"
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
                className={`my-5 h-8 w-px bg-gray-300 opacity-100 sm:my-6 sm:h-10 ${
                  isScrollingUp ? "transition-none" : "transition-opacity duration-700 ease-out"
                } ${showEyebrow ? "md:opacity-100" : "md:opacity-0"}`}
              />

              <p
                className={`text-xs font-medium uppercase tracking-[0.2em] text-[#dc5835] opacity-100 sm:text-[13px] ${
                  isScrollingUp ? "transition-none" : "transition-all duration-700 ease-out"
                } ${
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
                        showCoreValues && !isScrollingUp ? `${index * 80}ms` : "0ms",
                    }}
                    className={`group flex transform flex-col items-center justify-center px-4 py-4 text-center opacity-100 md:py-2 ${
                      isScrollingUp ? "transition-none" : "transition-all duration-700 ease-out"
                    } ${
                      showCoreValues
                        ? "md:translate-y-0 md:opacity-100"
                        : "md:translate-y-3 md:opacity-0"
                    } motion-reduce:transform-none motion-reduce:transition-none`}
                  >
                    <div className="relative h-11 w-11 transition-transform duration-300 ease-out md:group-hover:-translate-y-0.5 sm:h-12 sm:w-12">
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