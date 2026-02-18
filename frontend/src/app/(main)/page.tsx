import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";
import SectionScroll from "@/components/home/SectionScroll";
import FlashToastInitializer from "@/components/ui/FlashToastInitializer";
import { getFlashToast } from "@/lib/flash-toast";

const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"));
const MotivationSection = dynamic(() => import("@/components/home/MotivationSection"));
const WhyUs = dynamic(() => import("@/components/home/WhyUs"));
const Footer = dynamic(() => import("@/components/layout/Footer"));

export default async function Home() {
  const flash = await getFlashToast();

  return (
    <SectionScroll>
      {flash && <FlashToastInitializer type={flash.type} message={flash.message} />}
      <HeroSection />
      <HowItWorks />
      <MotivationSection />
      <div className="h-screen flex flex-col pt-24 bg-gray-100">
        <WhyUs />
        <Footer />
      </div>
    </SectionScroll>
  );
}
