"use client";

import React, { useState } from "react";
import Image from "next/image";
import { miningProductsData } from "@/data/miningData";

export default function SupportingCommoditiesSection({
  title = (
    <>
      Commodities That Support
      <br className="hidden sm:inline" /> Growing Industries
    </>
  ),
  items = miningProductsData,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="w-full bg-white py-8 pt-10 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] text-left font-normal text-[#dc5835] md:text-center tracking-tight leading-tight mb-10 sm:mb-14">
          {title}
        </h2>

        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-stretch gap-5 lg:gap-6 lg:h-[420px]">
          {items.map((card, index) => {
            const isExpanded = hoveredId ? hoveredId === card.id : index === 0;

            return (
              <div
                key={card.id || index}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group cursor-pointer bg-white border border-gray-200/80 rounded-sm p-3.5 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-500 ease-in-out ${
                  isExpanded ? "lg:flex-[1.8]" : "lg:flex-1"
                }`}
              >
                {/* Image Container */}
                <div className="relative w-full h-[260px] sm:h-[300px] lg:h-full overflow-hidden bg-gray-100 rounded-xs">
                  <Image
                    src={card.image}
                    alt={card.alt || card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Bottom Title Label */}
                <div className="pt-4 pb-1 text-center">
                  <h3
                    className={`text-sm sm:text-base font-semibold tracking-tight transition-colors duration-300 ${
                      isExpanded ? "text-[#dc5835]" : "text-gray-800"
                    }`}
                  >
                    {card.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}