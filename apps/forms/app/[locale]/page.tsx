import HeroSection from "../../sections/HeroSection";
import FeaturesSection from "../../sections/FeaturesSection";
import AboutSection from "../../sections/AboutSection";
import TestimonialsSection from "../../sections/TestimonialsSection";
import CTASection from "../../sections/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
