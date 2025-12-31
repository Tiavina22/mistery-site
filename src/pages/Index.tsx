import { useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ConceptSection from '@/components/ConceptSection';
import FeaturedStories from '@/components/FeaturedStories';
import FeaturesSection from '@/components/FeaturesSection';
import AccessSection from '@/components/AccessSection';
import CreatorsSection from '@/components/CreatorsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Set page title and meta
    document.title = 'APPISTERY - Streaming d\'histoires vraies de Madagascar';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ConceptSection />
        <FeaturedStories />
        <FeaturesSection />
        <AccessSection />
        <CreatorsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
