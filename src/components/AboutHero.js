"use client";

import Image from "next/image";
import Button from "@/components/Button";
import { motion } from "framer-motion";

export default function AboutHero() {
  // Animation Variants for Text Stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const images = [
    { src: "/about/image-1.png", alt: "Agriculture commodity loading" },
    { src: "/about/image-2.png", alt: "Farm tractor harvesting" },
    { src: "/about/image-3.png", alt: "Mining site operations" },
    { src: "/about/image-4.png", alt: "Heavy industrial machinery" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#f7f8fa] pt-32 pb-20">
      {/* Animated Text Block */}
      <motion.div
        className="mx-auto max-w-7xl px-4 text-left md:text-center sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          className="mb-3 text-sm font-normal tracking-tight text-gray-600 sm:text-xl md:text-4xl"
        >
          We Believe Global Trade Is
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-3xl font-normal leading-tight tracking-tight text-[#658e3e] sm:text-5xl lg:text-6xl"
        >
          Powered by Reliable Connections
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg"
        >
          KENT Commodities connects trusted producers with global buyers
          through reliable sourcing, quality-focused trading & efficient
          commodity supply solutions across agriculture and mining.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-6">
          <Button href="/contact">Get Started</Button>
        </motion.div>
      </motion.div>

      {/* Hero 4-Column Image Grid with Stagger & 3D Tilt Hover */}
      <div className="mx-auto mt-14 w-full overflow-hidden">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className="imagegrid-marquee flex w-max gap-2">
      {[...images, ...images].map((img, idx) => (
        <div
          key={idx}
          className="relative h-[280px] w-[72vw] shrink-0 overflow-hidden rounded-xs shadow-xs cursor-pointer sm:w-[42vw] lg:w-[320px]"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 640px) 72vw, (max-width: 1024px) 42vw, 320px"
            className="object-cover object-center"
          />
          {/* Soft overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
        </div>
      ))}
    </div>
  </motion.div>

  <style>{`
    .imagegrid-marquee {
      animation: imagegrid-scroll 32s linear infinite;
    }
    .imagegrid-marquee:hover {
      animation-play-state: paused;
    }
    @keyframes imagegrid-scroll {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-50%);
      }
    }
  `}</style>
</div>
    </section>
  );
}