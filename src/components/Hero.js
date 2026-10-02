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
    titleLine1: "Cultivating Global Supply",
    titleLine2: "Premium Agricultural Harvests",
    accentColor: "text-[#6d8e18]",
  },
  {
    id: 2,
    src: "/home/hero-thumb-2.png",
    heroSrc: "/home/hero-2.png",
    videoSrc: "/home/hero-video-2.mp4",
    alt: "Mining Commodities",
    titleLine1: "Unearthing Raw Potential",
    titleLine2: "Essential Mineral Solutions",
    accentColor: "text-[#dc5835]",
  },
  {
    id: 3,
    src: "/home/hero-thumb-3.png",
    heroSrc: "/home/hero-3.png",
    videoSrc: "/home/hero-video-3.mp4",
    alt: "Renewable Energy and Supply",
    titleLine1: "Sustaining Global Markets",
    titleLine2: "Quality Grains & Crop Produce",
    accentColor: "text-[#6d8e18]",
  },
];

const VIDEO_DISPLAY_DURATION = 10000;
const TRANSITION_DURATION = 1800;

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState(1);

  /*
   * The image that is currently displayed.
   *
   * We keep this separate from activeId so that the image
   * does not get replaced during the transition.
   */
  const [backgroundId, setBackgroundId] = useState(1);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isChangingSlide, setIsChangingSlide] = useState(false);

  const videoRef = useRef(null);

  const timerRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const videoTimerStartedRef = useRef(false);

  const { experience } = aboutData.aboutSection;

  const activeThumbnail =
    initialThumbnails.find(
      (thumbnail) => thumbnail.id === activeId
    ) || initialThumbnails[0];

  const backgroundThumbnail =
    initialThumbnails.find(
      (thumbnail) => thumbnail.id === backgroundId
    ) || initialThumbnails[0];

  /*
   * SCROLL
   */
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

  /*
   * ACTIVE VIDEO
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    setIsVideoReady(false);
    videoTimerStartedRef.current = false;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const handleCanPlay = () => {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsVideoReady(false);
        });
      }
    };

    const handlePlaying = () => {
      setIsVideoReady(true);

      if (videoTimerStartedRef.current) {
        return;
      }

      videoTimerStartedRef.current = true;

      timerRef.current = setTimeout(() => {
        handleNextSlide();
      }, VIDEO_DISPLAY_DURATION);
    };

    const handleEnded = () => {
      handleNextSlide();
    };

    const handleError = () => {
      setIsVideoReady(false);
      videoTimerStartedRef.current = false;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      videoTimerStartedRef.current = false;
    };
  }, [activeId, backgroundId]);

  /*
   * CHANGE SLIDE
   */
  const startSlideChange = useCallback(
    (targetId) => {
      if (targetId === activeId || isChangingSlide) {
        return;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      videoTimerStartedRef.current = false;

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }

      /*
       * FIRST:
       * Change the background image immediately.
       *
       * The new image is underneath the current video.
       */
      setBackgroundId(targetId);

      /*
       * Fade the CURRENT video/image out.
       */
      setIsChangingSlide(true);

      /*
       * Keep the video hidden during the transition.
       */
      setIsVideoReady(false);

      /*
       * After the slow fade has finished,
       * make the new slide active.
       */
      transitionTimeoutRef.current = setTimeout(() => {
        setActiveId(targetId);

        /*
         * The new image is now already visible.
         * The new video's loading will happen over it.
         */
        setIsChangingSlide(false);

        transitionTimeoutRef.current = null;
      }, TRANSITION_DURATION);
    },
    [activeId, isChangingSlide]
  );

  /*
   * NEXT SLIDE
   */
  const handleNextSlide = useCallback(() => {
    const currentIndex = initialThumbnails.findIndex(
      (thumbnail) => thumbnail.id === activeId
    );

    const nextIndex =
      (currentIndex + 1) % initialThumbnails.length;

    const targetId = initialThumbnails[nextIndex].id;

    startSlideChange(targetId);
  }, [activeId, startSlideChange]);

  /*
   * THUMBNAIL CHANGE
   */
  const handleThumbnailChange = (id) => {
    startSlideChange(id);
  };

  /*
   * CLEANUP
   */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] max-h-[1080px] w-full flex-col justify-between overflow-hidden bg-[#161a15]"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">

        {/* =====================================================
            SINGLE BACKGROUND IMAGE
            ===================================================== */}

        <Image
          key={backgroundThumbnail.heroSrc}
          src={backgroundThumbnail.heroSrc}
          alt={backgroundThumbnail.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* =====================================================
            CURRENT VIDEO
            ===================================================== */}

        <video
          ref={videoRef}
          key={activeThumbnail.videoSrc}
          autoPlay
          muted
          loop={false}
          playsInline
          preload="auto"
          poster={activeThumbnail.heroSrc}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
            isChangingSlide
              ? "opacity-0"
              : isVideoReady
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

        {/* OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-20 flex w-full flex-1 flex-col justify-center pt-24 sm:pt-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="leading-[1.15] tracking-tight">
            <span className="block text-2xl font-normal text-white sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[40px]">
              {activeThumbnail.titleLine1}
            </span>

            <span
              className={`mt-1.5 block text-2xl font-normal sm:mt-2 md:text-4xl lg:text-[42px] xl:text-[52px] ${activeThumbnail.accentColor}`}
            >
              {activeThumbnail.titleLine2}
            </span>
          </h1>
        </div>
      </div>

      {/* BOTTOM CONTENT */}
      <div
        aria-hidden={isScrolled}
        className={`relative z-20 mx-auto w-full max-w-7xl px-4 pb-8 transition-[opacity,transform] duration-700 ease-out sm:px-6 sm:pb-12 lg:px-8 ${
          isScrolled
            ? "pointer-events-none translate-y-4 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end sm:gap-8">

          {/* EXPERIENCE */}
          <div className="flex flex-col">
            <span className="text-4xl font-normal leading-none tracking-tight text-white sm:text-5xl md:text-6xl">
              {experience.number}
            </span>

            <div className="my-2.5 h-px w-32 bg-white/40 sm:my-3 sm:w-44" />

            <p className="text-xs font-normal tracking-wide text-white/90 sm:text-sm md:text-base">
              {experience.label}
            </p>
          </div>

          {/* THUMBNAILS */}
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