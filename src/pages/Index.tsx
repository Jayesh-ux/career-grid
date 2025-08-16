import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedJobs from "@/components/FeaturedJobs";
import CompanyShowcase from "@/components/CompanyShowcase";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedJobs />
        <CompanyShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
