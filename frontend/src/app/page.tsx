import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import WhyUs from "@/components/home/WhyUs";
import Footer from "@/components/layout/Footer";
import SectionScroll from "@/components/home/SectionScroll";

export default function Home() {
  return (
    <>
      <Navbar />
      <SectionScroll>
        <HeroSection />
        <HowItWorks />
        <div className="h-screen flex flex-col pt-24 bg-gray-100">
          <WhyUs />
          <Footer />
        </div>
      </SectionScroll>
    </>
  );
}