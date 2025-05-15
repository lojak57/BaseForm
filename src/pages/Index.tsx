import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HeroCarousel from "@/components/blocks/HeroCarousel";
import CardGallery from "@/components/blocks/CardGallery";
import { categories } from "@/data/categories";
import { useProducts } from "@/context/ProductContext";
import { checkProducts } from "@/lib/product-debug";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import FallbackImage from "@/components/ui/FallbackImage";
import { Reveal } from "@/components/ui/reveal";

export default function Index() {
  const { products, loading, refreshProducts, getProductsByCategory } = useProducts();
  const [isChecking, setIsChecking] = useState(false);
  
  // Get featured products (limit to 4)
  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to get a product image for each category
  const getCategoryProductImage = (categoryId: string) => {
    // Get products for this category
    const categoryProducts = getProductsByCategory(categoryId);
    
    // If there are products with images, use the first product image
    if (categoryProducts.length > 0 && categoryProducts[0].defaultImages && categoryProducts[0].defaultImages.length > 0) {
      return categoryProducts[0].defaultImages[0];
    }
    
    // Look for a product with images from any category as backup
    if (categoryId === 'other') {
      const allProducts = [
        ...getProductsByCategory('purses'),
        ...getProductsByCategory('bags'),
        ...getProductsByCategory('wallets')
      ];
      
      const productWithImage = allProducts.find(p => p.defaultImages && p.defaultImages.length > 0);
      if (productWithImage) {
        return productWithImage.defaultImages[0];
      }
    }
    
    // Fall back to the static category image if no product images are available
    const category = categories.find(cat => cat.id === categoryId);
    return category?.image || '/images/placeholder.jpg';
  };

  const handleCheckProducts = async () => {
    setIsChecking(true);
    try {
      await checkProducts();
      toast.info("Product check complete. Check browser console for details.");
      // Refresh products after checking
      await refreshProducts();
    } catch (error) {
      console.error("Error checking products:", error);
      toast.error("Error checking products");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section with Rotating Images */}
      <HeroCarousel 
        title="Handcrafted Bags & Purses"
        subtitle="Made with love in Colorado"
        ctaText="Shop Now"
        ctaLink="/category/purses"
      />

      {/* Featured Products Section */}
      <Reveal animation="fade-up">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Reveal animation="fade-up" duration="fast">
              <div className="text-center mb-12">
                <p className="text-threadGold font-medium mb-2">Our Collection</p>
                <h2 className="font-playfair text-3xl md:text-4xl">Featured Products</h2>
              </div>
            </Reveal>
            
            {loading ? (
              <div className="text-center py-12">
                <p>Loading products...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <CardGallery products={featuredProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="mb-6">No products available yet.</p>
                <div className="flex flex-col gap-4 items-center">
                  <Link to="/admin/products/new" className="btn-primary">
                    Add Your First Product
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleCheckProducts}
                    disabled={isChecking}
                  >
                    {isChecking ? "Checking products..." : "Check for Products"}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    If you've already added products but they're not showing, click the button above to check the database.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* Categories Section */}
      <Reveal animation="fade-up">
        <section className="py-16 bg-ivory">
          <div className="container mx-auto px-4">
            <Reveal animation="fade-up" duration="fast">
              <div className="text-center mb-12">
                <p className="text-threadGold font-medium mb-2">Browse By</p>
                <h2 className="font-playfair text-3xl md:text-4xl">Categories</h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Reveal 
                  key={category.id}
                  animation="fade-up" 
                  delay={index * 100} 
                  duration="fast"
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <div className="aspect-square">
                      {loading ? (
                        // Show loading skeleton while products are being loaded
                        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                      ) : (
                        <FallbackImage
                          src={getCategoryProductImage(category.id)}
                          alt={category.name}
                          fallbackSrc={category.image}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-darkText/40 flex items-center justify-center">
                        <div className="text-center p-4">
                          <h3 className="text-white font-playfair text-2xl mb-2">{category.name}</h3>
                          <span className="inline-block bg-threadGold text-darkText px-4 py-2 rounded-full text-sm font-medium">
                            View Products
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* About Section */}
      <Reveal animation="fade-up">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <Reveal animation="fade-right" duration="fast">
                <div className="flex justify-center items-center">
                  <img
                    src="/lovable-uploads/463dd640-f9c6-4abf-aa5f-4e6927af1de5.png"
                    alt="VC Sews Logo"
                    className="max-w-full max-h-[300px] lg:max-h-[400px] object-contain rounded-lg shadow-md bg-ivory p-8"
                  />
                </div>
              </Reveal>
              <Reveal animation="fade-left" duration="fast">
                <div>
                  <p className="text-threadGold font-medium mb-2">Our Story</p>
                  <h2 className="font-playfair text-3xl md:text-4xl mb-6">Handcrafted with Love</h2>
                  <div className="prose max-w-none mb-8">
                    <p>
                      At VC Sews, every stitch tells a story. Our handcrafted bags and purses are
                      carefully designed and sewn with attention to detail and quality.
                    </p>
                    <p>
                      Using premium fabrics and materials, we create functional pieces that stand
                      the test of time while maintaining a unique Colorado aesthetic.
                    </p>
                  </div>
                  <Link to="/contact" className="btn-secondary">
                    Learn More
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </Reveal>
    </Layout>
  );
}
