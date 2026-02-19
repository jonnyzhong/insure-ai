import { SkipLink } from "@/components/common/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { TrustBar } from "@/components/landing/TrustBar";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <FeaturesGrid />
        <TrustBar />
      </main>
      <Footer />
    </div>
  );
}
