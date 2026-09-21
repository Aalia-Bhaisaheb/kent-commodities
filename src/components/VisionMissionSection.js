"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { aboutData } from "@/data/about";

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

export default function VisionMissionSection() {
  const { image, vision, mission } = aboutData.visionMissionSection;

  const pinContainerRef = useRef(null);
  const lastScrollY = useRef(0);
  const tickingRef = useRef(false);
  const modeRef = useRef("pin");
  const anchorRef = useRef(null); // reference point used to keep the page still when collapsing

  const [isDesktop, setIsDesktop] = useState(false);
  const [mode, setMode] = useState("pin"); // "pin" (top->bottom) | "free" (passed / scrolled up)
  const [pinStatus, setPinStatus] = useState("before");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerRect, setContainerRect] = useState({ left: 0, width: 0 });
  const [sectionEntered, setSectionEntered] = useState(false);

  // Screen size listener
  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Entrance observer (image slide-in)
  useEffect(() => {
    if (!isDesktop) {
      setSectionEntered(true);
      return undefined;
    }

    const element = pinContainerRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionEntered(true);
        } else if (entry.boundingClientRect.top > 0) {
          setSectionEntered(false);
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isDesktop]);

  // Pin math + direction + pin/free switching
  useEffect(() => {
    const update = () => {
      tickingRef.current = false;

      const currentScrollY = window.scrollY;
      const goingUp = currentScrollY < lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (!isDesktop) return;

      const el = pinContainerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      /* ---------- FREE MODE: normal flow, re-arm when fully below viewport ---------- */
      if (modeRef.current === "free") {
        if (rect.top >= vh) {
          modeRef.current = "pin";
          setMode("pin");
          setPinStatus("before");
          setScrollProgress(0);
        }
        return;
      }

      /* ---------- PIN MODE ---------- */
      const total = rect.height - vh;
      setContainerRect({ left: rect.left, width: rect.width });

      if (total <= 0) {
        setPinStatus("before");
        setScrollProgress(0);
        return;
      }

      // 1) Silent switch: section is completely above the viewport (passed going down)
      if (rect.bottom <= 0) {
        anchorRef.current = { kind: "bottom", value: rect.bottom };
        modeRef.current = "free";
        setMode("free");
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
        return;
      }

      if (rect.top > 0) {
        setPinStatus("before");
        setScrollProgress(0);
      } else if (isAfter) {
        setPinStatus("after");
        setScrollProgress(1);
      } else {
        setPinStatus("pinned");
        setScrollProgress(Math.min(Math.max(-rect.top / total, 0), 1));
      }
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
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
  }, [isDesktop]);

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

  const isPinMode = isDesktop && mode === "pin";

  const showVision = !isPinMode || scrollProgress >= 0.1;
  const showMission = !isPinMode || scrollProgress >= 0.55;
  const showImage = !isPinMode || sectionEntered;

  let wrapperStyle;
  if (!isPinMode) {
    wrapperStyle = { position: "relative" };
  } else if (pinStatus === "pinned") {
    wrapperStyle = {
      position: "fixed",
      top: 0,
      left: containerRect.left,
      width: containerRect.width,
    };
  } else if (pinStatus === "after") {
    wrapperStyle = { position: "absolute", left: 0, right: 0, bottom: 0 };
  } else {
    wrapperStyle = { position: "absolute", left: 0, right: 0, top: 0 };
  }

  const fade = isPinMode ? "lg:transition-all lg:duration-700 lg:ease-out" : "";

  return (
    <div
      ref={pinContainerRef}
      className={`relative w-full min-h-screen bg-[#f7f8fa] ${
        isPinMode ? "lg:h-[220vh]" : ""
      }`}
    >
      <div
        style={wrapperStyle}
        className="flex w-full min-h-screen items-center justify-center overflow-visible lg:overflow-hidden"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* ================= CONTENT ================= */}
            <div className="order-1 space-y-10 lg:order-2 lg:space-y-12">
              {/* VISION */}
              <div
                className={`${fade} ${
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

              {/* MISSION */}
              <div
                className={`${fade} ${
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
              className={`order-2 group relative h-[350px] w-full overflow-hidden rounded-xs bg-gray-200 shadow-sm sm:h-[450px] lg:order-1 lg:h-[500px] lg:hover:shadow-md ${fade} ${
                showImage
                  ? "lg:translate-x-0 lg:opacity-100"
                  : "lg:-translate-x-10 lg:opacity-0"
              }`}
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