"use client";

import { motion } from "motion/react";
import customerTestimonials from "@/data/customerTestimonials";

const headerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const headingReveal = {
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

const descriptionReveal = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const testimonialsContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const testimonialReveal = {
  hidden: {
    opacity: 0,
    y: 14,
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

export default function CustomerTestimonialsSection({
  data = customerTestimonials,
}) {
  return (
    <section className="w-full overflow-hidden bg-white px-4 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16"
        >
          <motion.h2
            variants={headingReveal}
            className="text-2xl font-normal leading-tight tracking-tight text-[#dc5835] xs:text-3xl sm:text-4xl lg:text-[40px]"
          >
            {data.title}
          </motion.h2>

          <motion.p
            variants={descriptionReveal}
            className="max-w-md text-xs leading-relaxed text-gray-600 sm:text-sm"
          >
            {data.description}
          </motion.p>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          variants={testimonialsContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-12 sm:gap-4 lg:mt-14"
        >
          {data.testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.id}
              variants={testimonialReveal}
              whileHover={{
                y: -3,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex min-h-[190px] w-[260px] shrink-0 snap-start flex-col justify-between bg-[#f7f8fa] px-4 py-5 xs:w-[285px] xs:px-5 sm:w-[310px] sm:px-6 sm:py-6"
            >
              <div>
                <header>
                  <h3 className="text-xs font-medium tracking-tight text-gray-800 sm:text-sm">
                    {testimonial.name}
                  </h3>

                  <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1">
                    {testimonial.role}
                  </p>
                </header>

                <blockquote className="mt-4 text-[11px] leading-relaxed text-gray-600 sm:mt-5 sm:text-xs">
                  {testimonial.quote}
                </blockquote>
              </div>

              <div
                className="mt-4 flex gap-0.5 text-xs leading-none text-[#f5c400] sm:mt-5 sm:text-sm"
                aria-label={testimonial.ratingLabel}
                role="img"
              >
                {Array.from({ length: testimonial.rating }).map(
                  (_, index) => (
                    <motion.span
                      key={`${testimonial.id}-star-${index}`}
                      aria-hidden="true"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.06,
                      }}
                    >
                      ★
                    </motion.span>
                  ),
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}