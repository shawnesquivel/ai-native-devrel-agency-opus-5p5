import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Offers from "@/components/Offers";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Work from "@/components/Work";
import { FAQ, SITE } from "@/lib/site";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    slogan: SITE.tagline,
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Problem />
      <HowItWorks />
      <Services />
      <Offers />
      <Team />
      <Work />
      <Faq />
      <FinalCta />
    </>
  );
}
