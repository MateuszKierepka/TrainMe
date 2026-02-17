import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import MotivationSection from "@/components/home/MotivationSection";
import WhyUs from "@/components/home/WhyUs";
import Footer from "@/components/layout/Footer";
import SectionScroll from "@/components/home/SectionScroll";

export default function Home() {
  return (
    <SectionScroll>
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
