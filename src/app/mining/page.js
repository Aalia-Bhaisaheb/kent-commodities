import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/FooterSection";
import MiningHeroSection from "@/components/MiningHeroSection";
import SupportingCommoditiesSection from "@/components/SupportingCommoditiesSection";
import ContactSection from "@/components/ContactSection";
import PartnerSection from "@/components/PartnerSection";
import MiningOverviewAnimated from "@/components/MiningOverviewAnimated";

import {
  miningMetaData,
  miningHeroData,
  miningOverviewData,
  miningProductsData,
  partnerBenefitsData,
} from "@/data/miningData";

export const metadata = miningMetaData;

export default function MiningPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <MiningHeroSection
        subtitle={miningHeroData.subtitle}
        title={miningHeroData.title}
        description={miningHeroData.description}
        images={miningHeroData.images}
      />

      {/* Animated Overview Section with Scroll Pin */}
      <MiningOverviewAnimated data={miningOverviewData} />

      {/* Products Grid */}
      <SupportingCommoditiesSection
        title="Products"
        items={miningProductsData}
      />

      <PartnerSection items={partnerBenefitsData} />

      <ContactSection
        title={`Support That\nDelivers Value`}
        imageSrc="/contact-hero.png"
        imageAlt="Kent Commodities contact"
      />

      <Footer />
    </main>
  );
}