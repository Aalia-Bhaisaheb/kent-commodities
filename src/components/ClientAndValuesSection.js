"use client";

import Image from "next/image";
import { aboutData } from "@/data/about";
import { motion } from "framer-motion";

export default function ClientAndValuesSection() {
  const { clientTitle, clients, valuesTitle, values } =
    aboutData.clientAndValuesSection;

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 14,
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 16,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section className="w-full overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= CLIENTELE ================= */}
        <div className="mb-20 text-left sm:text-center sm:mb-28">

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.4,
            }}
            className="mb-12 text-3xl font-normal leading-tight tracking-tight text-[#dc5835] sm:text-4xl lg:text-[40px]"
          >
            {clientTitle}
          </motion.h2>

          <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex w-max animate-infinite-scroll items-center gap-16">
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="relative h-16 w-32 shrink-0 opacity-75 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                >
                  <Image
                    src={client.src}
                    alt={`${client.name} logo`}
                    fill
                    className="object-contain object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CORE VALUES ================= */}
        <div className="mx-auto w-full max-w-7xl px-5">

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.4,
            }}
            className="mb-5 text-left sm:text-center text-3xl font-normal leading-[1.2] tracking-tight text-[#dc5835] sm:text-4xl lg:text-[42px]"
          >
            {valuesTitle}
          </motion.h2>

          {/* Cards */}
          <motion.div
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {values.map((value, index) => (
              <motion.article
                key={value.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                whileHover={{
                  y: -2,
                  transition: {
                    duration: 0.4,
                    ease: "easeOut",
                  },
                }}
                className="min-h-[158px] bg-[#f6f7f9] px-4 py-5 transition-shadow duration-500 hover:shadow-md"
              >
                {/* Icon */}
                <div className="mb-6 flex h-10 items-start">
                  <Image
                    src={value.icon}
                    alt={`${value.title} icon`}
                    width={48}
                    height={48}
                    className="h-11 w-11 object-contain object-left"
                  />
                </div>

                {/* Title */}
                <h3 className="mt-7 text-sm font-medium tracking-tight text-gray-800 sm:text-base">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-[11px] leading-relaxed text-gray-600 sm:text-xs md:text-sm">
                  {value.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}