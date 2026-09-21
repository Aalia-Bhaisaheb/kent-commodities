import Navbar from "@/components/Navbar";
import Footer from "@/components/FooterSection";
import AboutHero from "@/components/AboutHero";
import VisionMissionSection from "@/components/VisionMissionSection";
import ClientAndValuesSection from "@/components/ClientAndValuesSection";
import ConnectingMarketsSection from "@/components/ConnectingMarketsSection";
import GlobalReachSection from "@/components/GlobalReachSection";
import ContactSection from "@/components/ContactSection";
import PageTransition from "@/components/PageTransition";
import { aboutData } from "@/data/about";

export const metadata = aboutData.metadata;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <Navbar />

        <AboutHero />
        <VisionMissionSection />
        <ClientAndValuesSection />
        <ConnectingMarketsSection />
        <GlobalReachSection />
        <ContactSection
        imageSrc="/contact-hero.png"
        imageAlt="Kent Commodities contact"
        title={`Support That\nDelivers Value`}
        />

      <Footer />
    </main>
  );
}