"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { connectionsData } from "@/data/agricultureData";

const featureContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const featureItem = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const headingAnimation = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const descriptionAnimation = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ConnectionsSection({
  heading,
  description = connectionsData.defaultDescription,
  features = connectionsData.features,
  hideDescription = false,
  centerHeading = false,
  compact = false,
}) {
  return (
    <section
      className={`w-full bg-white overflow-hidden ${
        compact ? "py-12" : " lg:py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full pt-24 py-8 px-4 sm:px-6 lg:px-8">

        {/* Header Block */}
        <div
          className={`flex flex-col gap-4 mb-10 sm:mb-12 lg:mb-10 ${
            centerHeading || hideDescription
              ? "items-center text-center"
              : "md:flex-row md:items-start justify-between"
          }`}
        >
          {/* Heading */}
          <motion.h2
            variants={headingAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
            }}
            className="text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-[#dc5835] leading-[1.18]"
          >
            {heading || (
              <>
                {connectionsData.defaultHeadingPart1}
                <br />
                {connectionsData.defaultHeadingPart2}
              </>
            )}
          </motion.h2>

          {/* Description */}
          {!hideDescription && (
            <motion.p
              variants={descriptionAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.3,
              }}
              className="text-xs sm:text-sm text-gray-600 max-w-lg leading-relaxed pt-1 font-normal md:text-right"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Features */}
        <motion.div
          variants={featureContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-8 sm:gap-y-10 lg:gap-y-12"
        >
          {features.map((item) => (
            <motion.div
              key={item.id}
              variants={featureItem}
              className="
                group flex flex-col items-start cursor-pointer
                border-l-2 border-transparent
                pl-4 -ml-4
                transition-colors duration-500 ease-out
                hover:border-[#dc5835]
              "
            >
              {/* Icon */}
              <div
                className="
                  relative
                  w-14 h-14
                  sm:w-16 sm:h-16
                  mb-4
                  flex items-center justify-center
                  rounded-2xl
                  bg-white
                  p-3.5
                  border border-gray-100/80
                  shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                  transition-[border-color,box-shadow,background-color]
                  duration-700
                  ease-out
                  group-hover:border-[#dc5835]/20
                  group-hover:bg-[#fffaf7]
                  group-hover:shadow-[0_10px_25px_rgba(220,88,53,0.10)]
                "
              >
                {item.icon ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="
                        object-contain
                        transition-[filter]
                        duration-500
                        ease-out
                        group-hover:brightness-105
                      "
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-lg border border-dashed border-gray-200 bg-gray-50/50 flex items-center justify-center text-gray-300" />
                )}
              </div>

              {/* Title */}
              <h3
                className="
                  text-base sm:text-lg
                  font-medium
                  text-gray-900
                  tracking-tight
                  leading-snug
                  transition-colors
                  duration-500
                  ease-out
                  group-hover:text-[#dc5835]
                "
              >
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mt-2 font-normal max-w-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}