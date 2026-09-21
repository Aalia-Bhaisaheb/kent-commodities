"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "./Button";
import { motion } from "framer-motion";

export default function ContactSection({
  title = "Support That\nDelivers Value",
  titleColor = "text-[#dc5835]",
  description = "We believe in strong collaboration, sharing expertise & resources to create lasting partnerships & drive mutual growth.",
  imageSrc,
  imageAlt = "Contact image",
  selectOptions = [
    { value: "sourcing", label: "Sourcing" },
    { value: "logistics", label: "Logistics & Supply" },
    { value: "consulting", label: "Consulting" },
  ],
  selectPlaceholder = "Select Service",
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    service: "",
    additionalDetails: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(formData);
    }

    setSubmitted(true);
  };

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const formReveal = {
    hidden: {
      opacity: 0,
      y: 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">

        {/* Left Column */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col justify-between lg:col-span-5"
        >
          <div>
            {/* Title */}
            <motion.h2
              variants={fadeUp}
              className={`text-3xl font-normal leading-tight tracking-tight sm:text-4xl lg:text-[46px] ${titleColor}`}
            >
              {title.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </motion.h2>

            {/* Description */}
            {description && (
              <motion.p
                variants={fadeUp}
                transition={{ delay: 0.12 }}
                className="mt-4 max-w-lg text-sm font-normal leading-relaxed text-gray-600 sm:mt-5 sm:text-base"
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Image */}
          {imageSrc && (
            <motion.div
              variants={imageReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="relative mt-10 h-62 w-full overflow-hidden rounded-xs transition-shadow duration-700 hover:shadow-md sm:h-72 lg:h-80"
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          variants={formReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-xs bg-[#f8f9fa] p-8 lg:p-16 lg:col-span-7"
        >
          {/* Form Heading */}
          <motion.h3
            variants={fadeUp}
            className="mb-8 text-left sm:text-center text-3xl font-light tracking-normal text-[#d95338] sm:text-4xl lg:text-[40px]"
          >
            Get In Touch
          </motion.h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                required
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                aria-label="First Name"
                className="w-full border-none bg-white px-4 py-4 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#708c2a]"
              />

              <input
                required
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                aria-label="Last Name"
                className="w-full border-none bg-white px-4 py-4 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#708c2a]"
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                aria-label="Email"
                className="w-full border-none bg-white px-4 py-4 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#708c2a]"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                aria-label="Phone"
                className="w-full border-none bg-white px-4 py-4 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#708c2a]"
              />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                aria-label="Address"
                className="w-full border-none bg-white px-4 py-4 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#708c2a]"
              />

              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                aria-label={selectPlaceholder}
                className="w-full border-none bg-white px-4 py-4 text-xs text-gray-400 outline-none focus:text-gray-800 focus:ring-1 focus:ring-[#708c2a]"
              >
                <option value="" disabled hidden>
                  {selectPlaceholder}
                </option>

                {selectOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="text-gray-800"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Textarea */}
            <textarea
              required
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              placeholder="Additional Details!"
              aria-label="Additional Details"
              rows={5}
              className="w-full resize-none border-none bg-white px-4 py-4 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#708c2a]"
            />

            {/* Submit */}
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <Button type="submit" variant="primary" size="md">
                Submit
              </Button>

              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-[11px] text-[#708c2a]"
                  role="status"
                >
                  Thanks — your message has been sent.
                </motion.p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}