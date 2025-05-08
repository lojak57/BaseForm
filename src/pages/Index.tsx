
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
        title="Artisan Purses Handcrafted in Colorado"
        description="Each VC Sews creation combines beautiful fabrics, meticulous craftsmanship, and functional design. From elegant clutches to everyday totes, discover pieces that are as unique as you are."
        ctaText="Shop Now"
        ctaLink="/category/crossbody"
        image="/images/hero.jpg"
        imageAlt="Handcrafted leather purse"
      />

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Featured Products */}
      <CardGallery
        title="Our Best Sellers"
        subtitle="HANDCRAFTED WITH CARE"
        products={featuredProducts}
      />

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
            title: "Handcrafted Quality",
            description: "Every stitch placed with care by skilled hands, ensuring durability and beauty in every piece."
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mountain-snow">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"></path>
              </svg>
            ),
            title: "Colorado Inspired",
            description: "Designs inspired by the beauty and spirit of Colorado's mountains, bringing nature's elegance to your style."
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            ),
            title: "Sustainable Materials",
            description: "Premium fabrics and materials chosen for their quality and environmental impact for guilt-free luxury."
          }
        ]}
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
