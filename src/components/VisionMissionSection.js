"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { aboutData } from "@/data/about";

export default function VisionMissionSection() {
  const { image, vision, mission } = aboutData.visionMissionSection;

  const pinContainerRef = useRef(null);
  const lastScrollY = useRef(0);

  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollDir, setScrollDir] = useState("down");
  const [pinStatus, setPinStatus] = useState("before");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerRect, setContainerRect] = useState({
    left: 0,
    width: 0,
  });
  const [sectionEntered, setSectionEntered] = useState(false);

  // Screen size listener
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Track global scroll direction
  useEffect(() => {
    const handleScrollDir = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        setScrollDir("up");
      } else if (currentScrollY > lastScrollY.current) {
        setScrollDir("down");
      }

      lastScrollY.current = currentScrollY;
    };

    handleScrollDir();
    window.addEventListener("scroll", handleScrollDir, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollDir);
  }, []);

  // Entrance observer: Trigger on top-to-bottom enter, reset when scrolled above
  useEffect(() => {
    if (!isDesktop) {
      setSectionEntered(true);
      return;
    }

    const element = pinContainerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (scrollDir === "down") {
            setSectionEntered(true);
          }
        } else {
          // Reset animation state when scrolled back above section
          if (entry.boundingClientRect.top > 0) {
            setSectionEntered(false);
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isDesktop, scrollDir]);

  // Handle pin status calculation
  useEffect(() => {
    if (!isDesktop) {
      setPinStatus("before");
      setScrollProgress(0);
      return;
    }

    const handlePinScroll = () => {
      const el = pinContainerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = rect.height - viewportHeight;

      setContainerRect({
        left: rect.left,
        width: rect.width,
      });

      // When scrolling UP, skip calculating pinned state
      if (scrollDir === "up") {
        setPinStatus("before");
        setScrollProgress(1);
        setSectionEntered(true);
        return;
      }

      // Scrolling DOWN pin state calculations
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
  }, [isDesktop, scrollDir]);

  const isScrollingUp = scrollDir === "up";

  // Visible during down-scroll progress OR fully static when scrolling up
  const showVision = !isDesktop || isScrollingUp || scrollProgress >= 0.1;
  const showMission = !isDesktop || isScrollingUp || scrollProgress >= 0.55;

  // Wrapper positioning rules
  let wrapperStyle;

  if (!isDesktop || isScrollingUp) {
    // When scrolling up, revert wrapper to standard static layout flow
    wrapperStyle = { position: "relative" };
  } else if (pinStatus === "pinned") {
    wrapperStyle = {
      position: "fixed",
      top: 0,
      left: containerRect.left,
      width: containerRect.width,
    };
  } else if (pinStatus === "after") {
    wrapperStyle = {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
    };
  } else {
    wrapperStyle = {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
    };
  }

  return (
    <div
      ref={pinContainerRef}
      className={`relative w-full bg-[#f7f8fa] ${
        isScrollingUp ? "min-h-0 lg:h-auto lg:py-20" : "min-h-screen lg:h-[220vh]"
      }`}
    >
      <div
        style={wrapperStyle}
        className={`flex w-full items-center justify-center ${
          isScrollingUp
            ? "py-0"
            : "min-h-screen overflow-visible lg:overflow-hidden"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* ================= CONTENT ================= */}
            <div className="order-1 space-y-10 lg:order-2 lg:space-y-12">
              {/* ---------- VISION ---------- */}
              <div
                className={`${
                  isScrollingUp
                    ? "!transition-none !transform-none !opacity-100"
                    : "lg:transition-all lg:duration-700 lg:ease-out"
                } ${
                  showVision
                    ? "lg:translate-y-0 lg:opacity-100"
                    : "lg:translate-y-5 lg:opacity-0"
                }`}
              >
                <h2 className="mb-3 text-3xl font-normal leading-tight tracking-tight text-[#dc5835] sm:text-4xl lg:text-5xl">
                  {vision.title}
                </h2>

                <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
                  {vision.subtitle}
                </h3>

                <p className="max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                  {vision.description}
                </p>
              </div>

              {/* ---------- MISSION ---------- */}
              <div
                className={`${
                  isScrollingUp
                    ? "!transition-none !transform-none !opacity-100"
                    : "lg:transition-all lg:duration-700 lg:ease-out"
                } ${
                  showMission
                    ? "lg:translate-y-0 lg:opacity-100"
                    : "lg:translate-y-5 lg:opacity-0"
                }`}
              >
                <h2 className="mb-3 text-3xl font-normal leading-tight tracking-tight text-[#dc5835] sm:text-4xl lg:text-5xl">
                  {mission.title}
                </h2>

                <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
                  {mission.subtitle}
                </h3>

                <p className="max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                  {mission.description}
                </p>
              </div>
            </div>

            {/* ================= IMAGE ================= */}
            <div
              className={`order-2 group relative h-[350px] w-full overflow-hidden rounded-xs bg-gray-200 shadow-sm sm:h-[450px] lg:order-1 lg:h-[500px] ${
                isScrollingUp
                  ? "!transition-none !transform-none !opacity-100"
                  : "lg:transition-all lg:duration-700 lg:ease-out"
              } ${
                sectionEntered || isScrollingUp
                  ? "lg:translate-x-0 lg:opacity-100"
                  : "lg:-translate-x-10 lg:opacity-0"
              } lg:hover:shadow-md`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center lg:transition-[filter] lg:duration-700 lg:ease-out lg:group-hover:brightness-[0.97]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}