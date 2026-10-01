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

// Time each video stays active
const SLIDE_DURATION = 8000;

// Smooth fade duration
const TRANSITION_DURATION = 1500;

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState(1);

  // Whether the current video is ready to be displayed
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Used for smooth slide transition
  const [isChangingSlide, setIsChangingSlide] = useState(false);

  const videoRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  const { experience } = aboutData.aboutSection;

  /*
   * ---------------------------------------------------------
   * SCROLL DETECTION
   * ---------------------------------------------------------
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
   * ---------------------------------------------------------
   * VIDEO LOAD / PLAY
   *
   * The video remains hidden until it is actually ready.
   * The fallback image remains visible meanwhile.
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // New video is not ready yet
    setIsVideoReady(false);

    const handleCanPlay = () => {
      // Video has enough data to start playing
      setIsVideoReady(true);

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If playback fails, keep showing the image
          setIsVideoReady(false);
        });
      }
    };

    const handleError = () => {
      // Video failed to load
      setIsVideoReady(false);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    // Start loading the video
    video.load();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [activeId]);

  /*
   * ---------------------------------------------------------
   * CHANGE TO NEXT VIDEO
   * ---------------------------------------------------------
   */
  const handleNextSlide = useCallback(() => {
    // Start smooth transition
    setIsChangingSlide(true);

    // Change video after the fade-out has started
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setActiveId((prevId) => {
        const currentIndex = initialThumbnails.findIndex(
          (thumbnail) => thumbnail.id === prevId
        );

        const nextIndex =
          (currentIndex + 1) % initialThumbnails.length;

        return initialThumbnails[nextIndex].id;
      });

      // Reset transition state
      setIsChangingSlide(false);
    }, TRANSITION_DURATION);
  }, []);

  /*
   * ---------------------------------------------------------
   * AUTO SLIDESHOW
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, SLIDE_DURATION);

    return () => {
      clearInterval(timer);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [handleNextSlide]);

  /*
   * ---------------------------------------------------------
   * ACTIVE THUMBNAIL
   * ---------------------------------------------------------
   */
  const activeThumbnail =
    initialThumbnails.find(
      (thumbnail) => thumbnail.id === activeId
    ) || initialThumbnails[0];

  /*
   * ---------------------------------------------------------
   * MANUAL THUMBNAIL CHANGE
   * ---------------------------------------------------------
   */
  const handleThumbnailChange = (id) => {
    if (id === activeId) return;

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Start fade
    setIsChangingSlide(true);

    transitionTimeoutRef.current = setTimeout(() => {
      // Hide video immediately
      setIsVideoReady(false);

      // Change slide
      setActiveId(id);

      // End transition
      setIsChangingSlide(false);
    }, TRANSITION_DURATION);
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] max-h-[1080px] w-full flex-col justify-between overflow-hidden bg-[#161a15]"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden">

        {/* ---------------------------------------------------
            FALLBACK IMAGE

            This image ALWAYS remains visible until the video
            has successfully loaded and started playing.
        ---------------------------------------------------- */}
        <Image
          key={activeThumbnail.heroSrc}
          src={activeThumbnail.heroSrc}
          alt={activeThumbnail.alt}
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-opacity ease-in-out ${
            isVideoReady && !isChangingSlide
              ? "opacity-0"
              : "opacity-100"
          }`}
          style={{
            transitionDuration: `${TRANSITION_DURATION}ms`,
          }}
        />

        {/* ---------------------------------------------------
            HERO VIDEO

            Video stays completely transparent until
            "canplay" confirms that it is ready.
        ---------------------------------------------------- */}
        <video
          ref={videoRef}
          key={activeThumbnail.videoSrc}
          muted
          loop
          playsInline
          preload="auto"
          poster={activeThumbnail.heroSrc}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
            isVideoReady && !isChangingSlide
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

        {/* ---------------------------------------------------
            OVERLAYS
        ---------------------------------------------------- */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* =====================================================
          HERO HEADING
      ====================================================== */}
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

      {/* =====================================================
          EXPERIENCE + THUMBNAILS
      ====================================================== */}
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