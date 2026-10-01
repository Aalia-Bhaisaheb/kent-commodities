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

const VIDEO_DISPLAY_DURATION = 10000;
const TRANSITION_DURATION = 1200;

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState(1);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isChangingSlide, setIsChangingSlide] = useState(false);

  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const videoTimerStartedRef = useRef(false);

  const { experience } = aboutData.aboutSection;

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
   * PRELOAD VIDEOS
   */
  useEffect(() => {
    const preloadVideos = [];

    initialThumbnails.forEach((thumbnail) => {
      const video = document.createElement("video");

      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = thumbnail.videoSrc;

      preloadVideos.push(video);
    });

    return () => {
      preloadVideos.forEach((video) => {
        video.removeAttribute("src");
        video.load();
      });
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

    /*
     * VIDEO CAN PLAY
     */
    const handleCanPlay = () => {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsVideoReady(false);
        });
      }
    };

    /*
     * VIDEO ACTUALLY STARTED PLAYING
     */
    const handlePlaying = () => {
      setIsVideoReady(true);

      if (videoTimerStartedRef.current) {
        return;
      }

      videoTimerStartedRef.current = true;

      /*
       * 10 seconds STARTS HERE.
       */
      timerRef.current = setTimeout(() => {
        handleNextSlide();
      }, VIDEO_DISPLAY_DURATION);
    };

    /*
     * VIDEO ERROR
     */
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
    video.addEventListener("error", handleError);

    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      videoTimerStartedRef.current = false;
    };
  }, [activeId]);

  /*
   * NEXT SLIDE
   *
   * IMPORTANT:
   * Change the active slide FIRST.
   *
   * This prevents the old slide's fallback image
   * from becoming visible during the transition.
   */
  const handleNextSlide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    videoTimerStartedRef.current = false;

    const currentIndex = initialThumbnails.findIndex(
      (thumbnail) => thumbnail.id === activeId
    );

    const nextIndex =
      (currentIndex + 1) % initialThumbnails.length;

    const nextId = initialThumbnails[nextIndex].id;

    /*
     * Immediately switch to the NEXT slide.
     *
     * The next slide's fallback image is now displayed
     * while its video loads.
     */
    setIsChangingSlide(true);
    setIsVideoReady(false);
    setActiveId(nextId);

    /*
     * After the new slide has appeared,
     * remove the transition state.
     */
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setIsChangingSlide(false);
    }, TRANSITION_DURATION);
  }, [activeId]);

  /*
   * MANUAL THUMBNAIL CHANGE
   */
  const handleThumbnailChange = (id) => {
    if (id === activeId) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    videoTimerStartedRef.current = false;

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    /*
     * Immediately switch to selected slide.
     *
     * This makes the selected slide's image appear
     * directly instead of showing the previous image.
     */
    setIsChangingSlide(true);
    setIsVideoReady(false);
    setActiveId(id);

    transitionTimeoutRef.current = setTimeout(() => {
      setIsChangingSlide(false);
    }, TRANSITION_DURATION);
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

  const activeThumbnail =
    initialThumbnails.find(
      (thumbnail) => thumbnail.id === activeId
    ) || initialThumbnails[0];

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] max-h-[1080px] w-full flex-col justify-between overflow-hidden bg-[#161a15]"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* NEXT SLIDE IMAGE */}
        <Image
          key={activeThumbnail.heroSrc}
          src={activeThumbnail.heroSrc}
          alt={activeThumbnail.alt}
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-opacity ease-in-out ${
            isVideoReady
              ? "opacity-0"
              : "opacity-100"
          }`}
          style={{
            transitionDuration: `${TRANSITION_DURATION}ms`,
          }}
        />

        {/* VIDEO */}
        <video
          ref={videoRef}
          key={activeThumbnail.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={activeThumbnail.heroSrc}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
            isVideoReady
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
              Connecting Global Markets
            </span>

            <span className="mt-1.5 block text-2xl font-normal text-[#6d8e18] sm:mt-2 md:text-4xl lg:text-[42px] xl:text-[52px]">
              With Quality Commodities
            </span>
          </h1>
        </div>
      </div>

      {/* BOTTOM CONTENT */}
      <div
        aria-hidden={isScrolled}
        className={`relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 transition-[opacity,transform] duration-700 ease-out sm:px-6 sm:pb-12 lg:px-8 ${
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