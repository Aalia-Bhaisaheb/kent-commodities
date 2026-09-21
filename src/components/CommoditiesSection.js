"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { commoditiesData } from "@/data/agricultureData";

export default function CommoditiesSection() {
  const { headingPart1, headingPart2, items } = commoditiesData;

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  /*
   * Trigger the entrance animation once the section
   * scrolls into view. Stays true afterwards so the
   * animation doesn't replay on scroll up/down.
   */
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="commodities"
      ref={sectionRef}
      className="w-full bg-white sm:py-16 lg:py-20"
    >
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div
          className={`mb-8 shrink-0 text-center sm:mb-10 sm:transition-all sm:duration-700 sm:ease-out lg:mb-12 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-0 opacity-100 sm:translate-y-6 sm:opacity-0"
          }`}
        >
          <h2 className="text-left text-3xl font-normal leading-[1.2] tracking-tight text-[#dc5835] md:text-center lg:text-[44px]">
            {headingPart1}
            <br />
            {headingPart2}
          </h2>
        </div>

        {/* Commodity Cards */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:gap-8">
          {items.map((item, index) => (
            <article
              key={item.id}
              style={{
                transitionDelay: isVisible ? `${200 + index * 180}ms` : "0ms",
              }}
              className={`group relative min-h-[320px] w-full overflow-hidden rounded-xs border shadow-[0_4px_18px_rgba(0,0,0,0.14)] sm:min-h-[380px] sm:transition-all sm:duration-700 sm:ease-out sm:hover:border-transparent md:min-h-[360px] lg:min-h-[410px] xl:min-h-[450px] ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-0 opacity-100 sm:translate-y-10 sm:opacity-0"
              }`}
            >
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center sm:transition-transform sm:duration-[1400ms] sm:ease-out sm:group-hover:scale-110"
                />
              </div>

              {/* Default Image Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Default Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 z-10 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[400px] sm:transition-all sm:duration-700 sm:ease-out sm:group-hover:-translate-y-1">
                <div className="border border-white/25 bg-black/35 p-5 shadow-xl backdrop-blur-sm sm:p-6 sm:hover:border-transparent">
                  <h3 className="text-base font-medium leading-snug tracking-tight text-white sm:text-lg lg:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs font-normal leading-relaxed text-white/90 sm:text-[13px]">
                    {item.description}
                  </p>

                  <div className="mt-4 sm:mt-5">
                    <Button
                      href={item.href}
                      variant="primary"
                      size="md"
                    >
                      {item.buttonText}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Hover Overlay - Hidden on small screens */}
              <div
                className="
                  hidden sm:flex
                  absolute inset-0 z-20
                  items-center justify-center
                  bg-black/45
                  p-5
                  backdrop-blur-sm
                  transition-[clip-path,backdrop-filter]
                  duration-[1100ms]
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  [clip-path:polygon(0_100%,0_100%,0_100%,0_100%)]
                  group-hover:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]
                  sm:p-8
                "
              >
                <div
                  className="
                    w-full max-w-[500px]
                    border border-white/60 hover:border-transparent
                    bg-black/25
                    p-6
                    shadow-2xl
                    opacity-0
                    translate-y-3
                    transition-all
                    duration-[900ms]
                    delay-150
                    ease-out
                    group-hover:translate-y-0
                    group-hover:opacity-100
                    sm:p-8
                  "
                >
                  <h3 className="text-xl font-medium leading-snug tracking-tight text-white sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-relaxed text-white/95 sm:text-base">
                    {item.description}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
                    {item.additionalInfo}
                  </p>

                  <div className="mt-6">
                    <Button
                      href={item.href}
                      variant="primary"
                      size="md"
                    >
                      {item.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}