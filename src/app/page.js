"use client";

import { motion } from "motion/react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CommoditiesSection from "@/components/CommoditiesSection";
import ConnectionsSection from "@/components/ConnectionsSection";
import SupportingCommoditiesSection from "@/components/SupportingCommoditiesSection";
import Footer from "@/components/FooterSection";
import ContactSection from "@/components/ContactSection";
import CustomerTestimonialsSection from "@/components/CustomerTestimonialsSection";

import {
  homeCommoditiesData,
  homeSupportingCommoditiesData,
} from "@/data/homeData";

/* -------------------------------------------------------
   Very subtle section reveal
------------------------------------------------------- */

const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 18,
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

/* -------------------------------------------------------
   Page entrance
------------------------------------------------------- */

const pageEntrance = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/* -------------------------------------------------------
   Reusable section wrapper
------------------------------------------------------- */

function AnimatedSection({ children, className = "" }) {
  return (
    <motion.div
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.08,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <motion.main
      variants={pageEntrance}
      initial="hidden"
      animate="visible"
      className="min-h-screen overflow-hidden bg-white"
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* About */}
      <AnimatedSection>
        <AboutSection />
      </AnimatedSection>

      {/* Commodities */}
      <AnimatedSection>
        <CommoditiesSection
          heading={`${homeCommoditiesData.headingLine1}\n${homeCommoditiesData.headingLine2}`}
          categories={homeCommoditiesData.categories}
        />
      </AnimatedSection>

      {/* Connections */}
      <AnimatedSection>
        <ConnectionsSection />
      </AnimatedSection>

      {/* Supporting Commodities */}
      <AnimatedSection>
        <SupportingCommoditiesSection
          items={homeSupportingCommoditiesData}
        />
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection>
        <CustomerTestimonialsSection />
      </AnimatedSection>

      {/* Contact */}
      <AnimatedSection>
        <ContactSection
          title={`Support That\nDelivers Value`}
          imageSrc="/contact-hero.png"
          imageAlt="Our support team"
        />
      </AnimatedSection>

      {/* Footer */}
      <Footer />
    </motion.main>
  );
}