"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { miningHeroData } from "@/data/miningData";

export default function MiningHeroSection({
  subtitle = miningHeroData.subtitle,
  title = miningHeroData.title,
  description = miningHeroData.description,
  images = miningHeroData.images,
}) {
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 14,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageReveal = {
    hidden: {
      opacity: 0,
      y: 16,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: 0.15 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section className="w-full bg-[#f7f8fa] px-4 pb-18 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8 lg:py-34">
      <div className="mx-auto max-w-7xl text-left sm:text-center">

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="mb-3 text-sm font-normal tracking-tight text-gray-600 sm:text-xl md:text-4xl"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: subtitle ? 0.08 : 0 }}
          className="text-3xl font-normal leading-tight tracking-tight text-[#658e3e] sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.16 }}
            className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg"
          >
            {description}
          </motion.p>
        )}

        {/* Images */}
        {images && images.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
            {images.map((img, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={imageReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative h-40 overflow-hidden rounded-xs transition-shadow duration-700 hover:shadow-md sm:h-56 lg:h-85"
              >
                <Image
                  src={img.src}
                  alt={img.alt || "Hero image"}
                  fill
                  priority={index < 2}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}