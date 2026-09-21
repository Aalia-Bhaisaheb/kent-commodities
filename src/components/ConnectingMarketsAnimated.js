"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";

export default function ConnectingMarketsAnimated({ data }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Subtle interactive parallax shift on mouse move over the image
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-4 sm:px-6 py-16 lg:px-8 lg:py-34 overflow-hidden"
    >
      <div className="mx-auto flex flex-col lg:grid max-w-7xl lg:grid-cols-2 items-center gap-8 sm:gap-12 lg:gap-16">
        
        {/* ================= HEADING (MOBILE: ORDER 1) ================= */}
        <h2
          className={`order-1 lg:order-none text-3xl font-normal leading-tight tracking-tight text-[#dc5835] sm:text-4xl lg:text-5xl transition-all duration-800 ease-out lg:hidden ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          {data.headingPart1}
          <br />
          {data.headingPart2}
        </h2>

        {/* ================= IMAGE: PARALLAX & SCROLL REVEAL (MOBILE: ORDER 2) ================= */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`order-2 lg:order-none w-full group relative h-64 overflow-hidden rounded-lg sm:h-80 lg:h-108 transition-all duration-1000 ease-out cursor-pointer ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-16 opacity-0 scale-95"
          }`}
        >
          {/* Main Photo with Mouse-Tracking Parallax */}
          <div
            className="relative h-full w-full transition-transform duration-300 ease-out"
            style={{
              transform: `scale(1.08) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
            }}
          >
            <Image
              src={data.image.src}
              alt={data.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-filter duration-500 group-hover:brightness-105"
            />
          </div>
        </div>

        {/* ================= CONTENT: REVEAL WITH STAGGER (MOBILE: ORDER 3) ================= */}
        <div className="order-3 lg:order-none space-y-6 w-full">
          {/* Heading for Desktop Only */}
          <h2
            className={`hidden lg:block text-3xl font-normal leading-tight tracking-tight text-[#dc5835] sm:text-4xl lg:text-5xl transition-all duration-800 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {data.headingPart1}
            <br />
            {data.headingPart2}
          </h2>

          <p
            className={`text-base leading-relaxed text-gray-600 sm:text-lg transition-all duration-800 delay-150 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {data.description}
          </p>

          <div
            className={`pt-2 transition-all duration-800 delay-300 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Button
              href={data.buttonHref}
              variant="primary"
              size="md"
            >
              {data.buttonText}
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}