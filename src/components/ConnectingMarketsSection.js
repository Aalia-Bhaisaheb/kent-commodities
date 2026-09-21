"use client";

import Image from "next/image";
import { aboutData } from "@/data/about";
import { motion } from "framer-motion";

export default function ConnectingMarketsSection() {
  const { headingLine1, headingLine2, description, image } =
    aboutData.connectingMarketsSection;

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 14,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageReveal = {
    hidden: {
      opacity: 0,
      y: 14,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="w-full bg-[#f7f8fa] py-14 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ================= LEFT: CONTENT ================= */}
          <div className="space-y-6">

            {/* Heading */}
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.4,
              }}
              className="text-3xl font-normal leading-tight tracking-tight text-[#dc5835] sm:text-4xl lg:text-[44px]"
            >
              {headingLine1}
              <br />
              {headingLine2}
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.35,
              }}
              transition={{
                delay: 0.15,
              }}
              className="max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base"
            >
              {description}
            </motion.p>
          </div>

          {/* ================= RIGHT: IMAGE ================= */}
          <motion.div
            variants={imageReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
            className="relative h-[320px] w-full overflow-hidden rounded-xs bg-gray-100 shadow-sm transition-shadow duration-700 hover:shadow-md sm:h-[420px] lg:h-[480px]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}