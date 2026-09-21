"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/FooterSection";
import ContactSection from "@/components/ContactSection";
import OfficeLocations from "@/components/OfficeLocations";
import { contactHeroData } from "@/data/contactData";

export default function ContactPage() {
  const handleFormSubmit = (formData) => {
    console.log("Submitted contact page data:", formData);
    // Submit to your API endpoint here (e.g., fetch('/api/contact', { ... }))
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="mt-20 pt-2 pb-12 px-4 sm:mt-16 lg:mt-0 sm:pt-10">
        <ContactSection
          title={contactHeroData.title}
          titleColor={contactHeroData.titleColor}
          description={contactHeroData.description}
          selectPlaceholder={contactHeroData.selectPlaceholder}
          selectOptions={contactHeroData.selectOptions}
          onSubmit={handleFormSubmit}
        />
      </div>

      <OfficeLocations />

      <Footer />
    </main>
  );
}