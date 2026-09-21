"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { agriculturalProductsData } from "@/data/agricultureData";

export default function AgriculturalProducts({
  headingPart1 = agriculturalProductsData.headingPart1,
  headingPart2 = agriculturalProductsData.headingPart2,
  products = agriculturalProductsData.products,
  centerIndex = agriculturalProductsData.centerIndex,
}) {
  const [activeIndex, setActiveIndex] = useState(centerIndex || 0);
  const [isPaused, setIsPaused] = useState(false);

  const totalProducts = products.length;

  const nextProduct = () => {
    setActiveIndex((current) => (current + 1) % totalProducts);
  };

  const previousProduct = () => {
    setActiveIndex(
      (current) => (current - 1 + totalProducts) % totalProducts,
    );
  };

  // Automatic carousel movement
  useEffect(() => {
    if (totalProducts <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalProducts);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalProducts, isPaused]);

  // Keeps the carousel circular when cards move from left to right
  const getDistanceFromCenter = (index) => {
    let distance = index - activeIndex;

    if (distance > totalProducts / 2) {
      distance -= totalProducts;
    }

    if (distance < -totalProducts / 2) {
      distance += totalProducts;
    }

    return distance;
  };

  const positions = {
    "-3": "calc(-50% - 350px)",
    "-2": "calc(-50% - 280px)",
    "-1": "calc(-50% - 200px)",
    "0": "-50%",
    "1": "calc(-50% + 190px)",
    "2": "calc(-50% + 270px)",
    "3": "calc(-50% + 350px)",
  };

  const zIndexes = {
    "-3": "z-10",
    "-2": "z-20",
    "-1": "z-30",
    "0": "z-40",
    "1": "z-30",
    "2": "z-20",
    "3": "z-10",
  };

  const heights = {
    "-3": "h-[175px]",
    "-2": "h-[210px]",
    "-1": "h-[255px]",
    "0": "h-[300px]",
    "1": "h-[255px]",
    "2": "h-[210px]",
    "3": "h-[175px]",
  };

  const labelHeights = {
    "-3": "h-[25px]",
    "-2": "h-[27px]",
    "-1": "h-[29px]",
    "0": "h-[32px]",
    "1": "h-[29px]",
    "2": "h-[27px]",
    "3": "h-[25px]",
  };

  const activeProduct = products[activeIndex];

  return (
    <section className="w-full overflow-hidden bg-white px-4 py-16 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        {/* Heading */}
        <h2 className="text-center text-3xl font-normal leading-[1.2] tracking-tight text-[#dc5835] sm:text-4xl lg:text-[42px]">
          {headingPart1}
          <br />
          {headingPart2}
        </h2>

        {/* Desktop Carousel */}
        <div
          className="relative mx-auto mt-12 hidden h-[330px] w-full max-w-7xl items-center justify-center md:flex"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Previous Button */}
          <button
            type="button"
            onClick={previousProduct}
            aria-label="Previous product"
            className="absolute left-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-[#567425] hover:bg-[#48631f] text-white shadow-md transition "
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {products.map((product, index) => {
            const distance = getDistanceFromCenter(index);

            // Only display the active card and three cards on each side
            if (Math.abs(distance) > 3) return null;

            const isCenter = distance === 0;

            return (
              <div
                key={product.name}
                style={{
                  left: "50%",
                  transform: `translateX(${positions[distance]}) translateY(-50%)`,
                }}
                className={`absolute top-1/2 transition-all duration-600 ease-in-out ${
                  zIndexes[distance]
                } ${isCenter ? "w-[450px]" : "w-[210px]"}`}
              >
                <div
                  className={`flex flex-col overflow-hidden border border-[#e5e5e5] bg-gray-100 px-2.5 pb-1 pt-2.5 ${
                    isCenter
                      ? "shadow-[0_14px_32px_rgba(0,0,0,0.18)]"
                      : "shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative w-full overflow-hidden bg-gray-100 ${heights[distance]}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      sizes={isCenter ? "460px" : "210px"}
                      className="object-cover"
                    />
                  </div>

                  {/* Label */}
                  <div
                    className={`flex w-full items-center justify-center bg-gray-100 text-center ${labelHeights[distance]}`}
                  >
                    <span
                      className={`leading-none text-gray-800 ${
                        isCenter
                          ? "text-sm font-medium"
                          : "text-[10px] font-normal"
                      }`}
                    >
                      {product.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Next Button */}
          <button
            type="button"
            onClick={nextProduct}
            aria-label="Next product"
            className="absolute right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-[#567425] hover:bg-[#48631f] text-white shadow-md transition"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile Carousel */}
        {activeProduct && (
          <div className="mt-8 flex flex-col items-center md:hidden">
            <div className="w-full max-w-[320px] border border-gray-200 bg-white p-2 shadow-lg">
              <div className="relative h-[210px] w-full overflow-hidden">
                <Image
                  src={activeProduct.image}
                  alt={activeProduct.alt}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>

              <div className="flex h-10 items-center justify-center">
                <span className="text-sm font-medium text-gray-800">
                  {activeProduct.name}
                </span>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={previousProduct}
                aria-label="Previous product"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2e7d32] text-white transition hover:bg-[#48631f]"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
              </button>

              <div className="flex gap-1.5">
                {products.map((product, index) => (
                  <button
                    key={product.name}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${product.name}`}
                    className={`h-2 w-2 rounded-full transition ${
                      index === activeIndex
                        ? "bg-[#dc5835]"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextProduct}
                aria-label="Next product"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#567425] hover:bg-[#48631f] text-white transition"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}