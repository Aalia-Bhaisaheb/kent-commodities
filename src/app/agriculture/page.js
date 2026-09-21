import Navbar from "@/components/Navbar";
import Footer from "@/components/FooterSection";
import ConnectionsSection from "@/components/ConnectionsSection";
import AgriculturalProducts from "@/components/AgriculturalProducts";
import ContactSection from "@/components/ContactSection";
import AgricultureHeroSection from "@/components/AgricultureHeroSection";
import ConnectingMarketsAnimated from "@/components/ConnectingMarketsAnimated";

import {
  agricultureMetaData,
  agricultureHeroData,
  connectingMarketsData,
  connectionsData,
} from "@/data/agricultureData";

export const metadata = agricultureMetaData;

export default function AgriculturePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Intro / Hero Section */}
      <AgricultureHeroSection
        subtitle={agricultureHeroData.subtitle}
        title={agricultureHeroData.title}
        description={agricultureHeroData.description}
        images={agricultureHeroData.images}
      />

      {/* Connecting markets */}
      <ConnectingMarketsAnimated data={connectingMarketsData} />

      {/* Product showcase */}
      <AgriculturalProducts />

      {/* Why choose Kent */}
      <ConnectionsSection
        heading={
          <>
            {connectionsData.whyChooseHeadingPart1}
            <br />
            {connectionsData.whyChooseHeadingPart2}
          </>
        }
        hideDescription
        centerHeading
      />

      {/* Value proposition */}
      <ContactSection
        imageSrc="/contact-hero.png"
        imageAlt="Kent Commodities contact"
        title={`Support That\nDelivers Value`}
      />

      <Footer />
    </main>
  );
}