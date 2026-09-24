import About from "@/components/About";
import ApiSection from "@/components/ApiSection";
import Comparison from "@/components/Comparison";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LogoMarquee from "@/components/LogoMarquee";
import Services from "@/components/Services";
import WorkPreview from "@/components/WorkPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <HowItWorks />
      <Services />
      <ApiSection />
      <Comparison />
      <WorkPreview />
      <About />
      <Faq />
      <FinalCta />
    </>
  );
}
