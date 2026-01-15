import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CoursesPreview from "@/components/CoursesPreview";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import ProductsSection from "@/components/ProductsSection";
import BlogPreview from "@/components/BlogPreview";

import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO
        title="الرئيسية"
        description="بيت الخط العربي: المنصة الأولى عالمياً لتعليم فن الخط العربي. دورات احترافية، أدوات، ومجتمع نابض بالحياة."
      />
      <Navbar />
      <Hero />
      <Features />
      <CoursesPreview />
      <ProductsSection />
      <BlogPreview />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
