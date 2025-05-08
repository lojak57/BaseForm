
import Layout from "@/components/layout/Layout";
import HeroSplit from "@/components/blocks/HeroSplit";
import FeatureRow from "@/components/blocks/FeatureRow";
import CategoryGrid from "@/components/blocks/CategoryGrid";
import CardGallery from "@/components/blocks/CardGallery";
import { products } from "@/data/products";

const Index = () => {
  // Select a few featured products
  const featuredProducts = products.slice(0, 3);
  
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSplit
        title="Hand-crafted purses, made just for you."
        ctaText="Shop Bags"
        ctaLink="/category/crossbody"
        image="/images/hero.jpg"
        imageAlt="Handcrafted leather purse on rustic table"
      />

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Features Section */}
      <FeatureRow
        title="Why Choose VC Sews"
        subtitle="OUR PROMISE"
        features={[
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-heart">
                <path d="M11 14V8a1 1 0 0 0-1-1v0a1 1 0 0 0-1 1v2.5"></path>
                <path d="M9 10.5V5a1 1 0 0 0-1-1v0a1 1 0 0 0-1 1v9"></path>
                <path d="M7 14V7a1 1 0 0 0-1-1v0a1 1 0 0 0-1 1v7"></path>
                <path d="M18 15v4a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-6"></path>
                <path d="m17.5 10.5 1.5-1.5 1.5 1.5L17.5 14l-3-3 1.5-1.5"></path>
              </svg>
            ),
            title: "Handmade",
            description: "Every stitch placed with care by skilled hands, ensuring durability and beauty in every piece."
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette">
                <circle cx="13.5" cy="6.5" r="2.5"></circle>
                <circle cx="19" cy="13" r="2.5"></circle>
                <circle cx="6" cy="12" r="2.5"></circle>
                <circle cx="10" cy="20" r="2.5"></circle>
                <path d="M10 8V2.5"></path>
                <path d="M14 13.5v6"></path>
                <path d="M9 11.5 4.5 7"></path>
                <path d="m16 15 2.5 3.5"></path>
              </svg>
            ),
            title: "Custom Fabric",
            description: "Choose from premium fabrics or bring your own for a truly personalized bag that matches your unique style."
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mountain-snow">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"></path>
              </svg>
            ),
            title: "Colorado Craftsmanship",
            description: "Proudly designed and handmade in Colorado, bringing the spirit of mountain craftsmanship to your everyday accessories."
          }
        ]}
      />

      {/* Featured Products */}
      <CardGallery
        title="Our Best Sellers"
        subtitle="HANDCRAFTED WITH CARE"
        products={featuredProducts}
      />

      {/* Testimonial Quote */}
      <div className="py-16 bg-threadGold/10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-quote mx-auto mb-6 text-threadGold">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
          </svg>
          <p className="font-playfair text-xl md:text-2xl italic mb-6">The quality of these bags is exceptional. I've had my Mountain Trail Crossbody for over a year now, and it still looks brand new despite daily use. The attention to detail in the stitching and design makes these purses truly special.</p>
          <p className="font-medium text-threadGold">— Sarah L., Boulder</p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
