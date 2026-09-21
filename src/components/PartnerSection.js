"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { partnerBenefitsData } from "@/data/miningData";

export default function PartnerSection({
  heading = (
    <>
      Why Partner With KENT
      <br />
      Commodities?
    </>
  ),
  items = partnerBenefitsData,
}) {
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

  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 14,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section className="w-full bg-white px-4 py-10 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <motion.h2
          variants={headingAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-xl text-left sm:text-center text-3xl font-normal leading-tight tracking-tight text-[#dc5835] sm:text-4xl"
        >
          {heading}
        </motion.h2>

        {/* Benefit Cards */}
        <div className="mt-10 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              custom={index}
              variants={cardAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ y: -2 }}
              transition={{
                y: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }}
              className="min-h-[190px] bg-[#f7f8fa] px-5 py-5 transition-colors duration-300 hover:bg-[#f1f4f7] sm:px-4 lg:min-h-[210px] lg:px-5"
            >
              {/* Icon */}
              <div className="relative h-14 w-14">
                <Image
                  src={benefit.icon}
                  alt={benefit.title}
                  fill
                  sizes="48px"
                  className="object-contain object-left"
                />
              </div>

              {/* Title */}
              <h3 className="mt-7 text-sm font-medium tracking-tight text-gray-800 sm:text-base">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-[11px] leading-relaxed text-gray-600 md:text-sm sm:text-xs">
                {benefit.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}