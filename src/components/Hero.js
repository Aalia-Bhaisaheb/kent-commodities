"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { aboutData } from "@/data/about";

const initialThumbnails = [
  {
    id: 1,
    src: "/home/hero-thumb-1.png",
    heroSrc: "/home/hero-1.png",
    videoSrc: "/home/hero-video-1.mp4",
    alt: "Agriculture Commodities",
  },
  {
    id: 2,
    src: "/home/hero-thumb-2.png",
    heroSrc: "/home/hero-2.png",
    videoSrc: "/home/hero-video-2.mp4",
    alt: "Mining Commodities",
  },
  {
    id: 3,
    src: "/home/hero-thumb-3.png",
    heroSrc: "/home/hero-3.png",
    videoSrc: "/home/hero-video-3.mp4",
    alt: "Renewable Energy and Supply",
  },
];

// Change video every 9 seconds
const SLIDE_DURATION = 9000;

// Smooth transition duration
const TRANSITION_DURATION = 1500;

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState(1);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videoRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  const { experience } = aboutData.aboutSection;

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 140);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Play video whenever active slide changes
  useEffect(() => {
    if (!videoRef.current) return;

    setIsVideoLoaded(false);

    videoRef.current.load();

    const playPromise = videoRef.current.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setIsVideoLoaded(false);
      });
    }
  }, [activeId]);

  // Automatically change video every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);

      // Wait for fade-out before changing the video
      transitionTimeoutRef.current = setTimeout(() => {
        setActiveId((prevId) => {
          const currentIndex = initialThumbnails.findIndex(
            (thumbnail) => thumbnail.id === prevId
          );

          const nextIndex =
            (currentIndex + 1) % initialThumbnails.length;

          return initialThumbnails[nextIndex].id;
        });

        setIsTransitioning(false);
      }, TRANSITION_DURATION / 2);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(timer);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const activeThumbnail =
    initialThumbnails.find(
      (thumbnail) => thumbnail.id === activeId
    ) || initialThumbnails[0];

  // Manual thumbnail change
  const handleThumbnailChange = (id) => {
    if (id === activeId) return;

    setIsTransitioning(true);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setIsVideoLoaded(false);
      setActiveId(id);
      setIsTransitioning(false);
    }, TRANSITION_DURATION / 2);
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] max-h-[1080px] w-full flex-col justify-between overflow-hidden bg-[#161a15]"
    >
      {/* Background Hero Video & Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">

        {/* Fallback Image */}
        <Image
          key={activeThumbnail.heroSrc}
          src={activeThumbnail.heroSrc}
          alt={activeThumbnail.alt}
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-opacity ease-in-out ${
            isVideoLoaded && !isTransitioning
              ? "opacity-0"
              : "opacity-100"
          }`}
          style={{
            transitionDuration: `${TRANSITION_DURATION}ms`,
          }}
        />

        {/* Hero Background Video */}
        <video
          ref={videoRef}
          key={activeThumbnail.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          poster={activeThumbnail.heroSrc}
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setIsVideoLoaded(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
            isVideoLoaded && !isTransitioning
              ? "opacity-100"
              : "opacity-0"
          }`}
          style={{
            transitionDuration: `${TRANSITION_DURATION}ms`,
          }}
        >
          <source
            src={activeThumbnail.videoSrc}
            type="video/mp4"
          />
        </video>

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* Hero Heading */}
      <div className="relative z-20 flex w-full flex-1 flex-col justify-center pt-24 sm:pt-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="leading-[1.15] tracking-tight">
            <span className="block text-2xl font-normal text-white sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[40px]">
              Connecting Global Markets
            </span>

            <span className="mt-1.5 block text-2xl font-normal text-[#6d8e18] sm:mt-2 sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[52px]">
              With Quality Commodities
            </span>
          </h1>
        </div>
      </div>

      {/* Experience Stat and Thumbnails */}
      <div
        aria-hidden={isScrolled}
        className={`relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 transition-[opacity,transform] duration-700 ease-out sm:px-6 sm:pb-12 lg:px-8 ${
          isScrolled
            ? "pointer-events-none translate-y-4 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end sm:gap-8">

          {/* Experience Stat */}
          <div className="flex flex-col">
            <span className="text-4xl font-normal leading-none tracking-tight text-white sm:text-5xl md:text-6xl">
              {experience.number}
            </span>

            <div className="my-2.5 h-px w-32 bg-white/40 sm:my-3 sm:w-44" />

            <p className="text-xs font-normal tracking-wide text-white/90 sm:text-sm md:text-base">
              {experience.label}
            </p>
          </div>

          {/* Thumbnail Preview */}
          <div className="flex items-center gap-2 self-start sm:gap-2.5 sm:self-auto">
            {initialThumbnails.map((thumbnail) => {
              const isActive = thumbnail.id === activeId;

              return (
                <button
                  key={thumbnail.id}
                  type="button"
                  onClick={() =>
                    handleThumbnailChange(thumbnail.id)
                  }
                  className={`relative h-12 w-16 cursor-pointer overflow-hidden rounded-xs transition-[opacity,transform,border-color] duration-300 ease-out sm:h-14 sm:w-20 md:h-16 md:w-24 ${
                    isActive
                      ? "scale-105 border-[1.5px] border-white opacity-100 shadow-md"
                      : "border border-white/20 opacity-80 hover:scale-[1.03] hover:opacity-100"
                  }`}
                >
                  <Image
                    src={thumbnail.src}
                    alt={thumbnail.alt}
                    fill
                    sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}