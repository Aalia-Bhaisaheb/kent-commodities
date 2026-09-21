"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { aboutData } from "@/data/about";

export default function VisionMissionSection() {
  const { image, vision, mission } = aboutData.visionMissionSection;

  const pinContainerRef = useRef(null);
  const lastScrollY = useRef(0);
  const tickingRef = useRef(false);

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
          setSectionEntered(true);
        } else if (entry.boundingClientRect.top > 0) {
          // Reset animation state when scrolled back above section
          setSectionEntered(false);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isDesktop]);

  // Single rAF-throttled scroll handler: tracks direction AND pin math together,
  // and never changes layout height/position based on direction (that was
  // causing the document height to collapse mid-scroll and produce jumps).
  useEffect(() => {
    const update = () => {
      tickingRef.current = false;

      const currentScrollY = window.scrollY;
      let dir = scrollDir;
      if (currentScrollY < lastScrollY.current) {
        dir = "up";
        setScrollDir("up");
      } else if (currentScrollY > lastScrollY.current) {
        dir = "down";
        setScrollDir("down");
      }
      lastScrollY.current = currentScrollY;

      if (!isDesktop) {
        setPinStatus("before");
        setScrollProgress(0);
        return;
      }

      const el = pinContainerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = rect.height - viewportHeight;

      setContainerRect({ left: rect.left, width: rect.width });

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

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  const isScrollingUp = scrollDir === "up";

  // Visible during down-scroll progress, or instantly visible when scrolling up.
  // NOTE: this only affects opacity/transform classes below, never layout/height.
  const showVision = !isDesktop || isScrollingUp || scrollProgress >= 0.1;
  const showMission = !isDesktop || isScrollingUp || scrollProgress >= 0.55;

  // Wrapper positioning is driven purely by pinStatus (rect-based), which is
  // correct in both scroll directions on its own — no direction special-casing.
  let wrapperStyle;
  if (!isDesktop) {
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
      className="relative w-full min-h-screen bg-[#f7f8fa] lg:h-[220vh]"
    >
      <div
        style={wrapperStyle}
        className="flex w-full min-h-screen items-center justify-center overflow-visible lg:overflow-hidden"
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