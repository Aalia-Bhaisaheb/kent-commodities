"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { aboutData } from "@/data/about";

const initialThumbnails = [
  {
    id: 1,
    src: "/home/hero-thumb-1.png",
    heroSrc: "/home/hero-1.png",
    alt: "Agriculture Commodities",
  },
  {
    id: 2,
    src: "/home/hero-thumb-2.png",
    heroSrc: "/home/hero-2.png",
    alt: "Mining Commodities",
  },
  {
    id: 3,
    src: "/home/hero-thumb-3.png",
    heroSrc: "/home/hero-3.png",
    alt: "Renewable Energy and Supply",
  },
];

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState(1);

  const { experience } = aboutData.aboutSection;

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

  const activeThumbnail = initialThumbnails.find((t) => t.id === activeId) || initialThumbnails[0];

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] max-h-[1080px] w-full flex-col justify-between overflow-hidden bg-[#161a15]"
    >
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          key={activeThumbnail.heroSrc}
          src={activeThumbnail.heroSrc}
          alt={activeThumbnail.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-opacity duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* Hero Heading Container */}
      {/* Increased `pt-36` on default (mobile) and scaled back at `sm:` breakpoint */}
      <div className="relative z-20 flex w-full flex-1 flex-col pt-36 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
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

      {/* Hero Experience Stat and Thumbnails */}
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
                  onClick={() => setActiveId(thumbnail.id)}
                  className={`relative h-12 w-16 cursor-pointer overflow-hidden rounded-xs transition-[opacity,transform,border-color] duration-300 ease-out sm:h-14 sm:w-20 md:h-16 md:w-24 ${
                    isActive
                      ? "border-[1.5px] border-white opacity-100 shadow-md scale-105"
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