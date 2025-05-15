import { Link } from "react-router-dom";
import { categories } from "@/data/categories";
import FallbackImage from "@/components/ui/FallbackImage";
import { useProducts } from "@/context/ProductContext";

const CategoryGrid = () => {
  const { getProductsByCategory, loading } = useProducts();

  // Function to get a product image for each category
  const getCategoryProductImage = (categoryId: string) => {
    // Get products for this category
    const categoryProducts = getProductsByCategory(categoryId);
    
    // If there are products with images, use the first product image
    if (categoryProducts.length > 0 && categoryProducts[0].defaultImages && categoryProducts[0].defaultImages.length > 0) {
      return categoryProducts[0].defaultImages[0];
    }
    
    // Look for a product with images from any category as backup if requested category has no products
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

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-threadGold font-medium mb-2">Our Collections</p>
          <h2 className="font-playfair text-3xl md:text-4xl">Shop by Category</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.slug}`}
              className="product-card group rounded-lg overflow-hidden relative shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Image section - top 50% */}
              <div className="relative h-48 overflow-hidden">
                {loading ? (
                  // Show loading skeleton while products are being loaded
                  <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                ) : (
                  <FallbackImage 
                    src={getCategoryProductImage(category.id)} 
                    alt={category.name}
                    fallbackSrc={category.image || '/images/placeholder.jpg'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              
              {/* Text section - bottom 50% */}
              <div className="bg-ivory p-4 text-center">
                <h3 className="font-playfair text-xl text-darkText">{category.name}</h3>
                <p className="text-darkGray text-sm mt-1">{category.description}</p>
              </div>
              
              {/* Stitched border effect on hover */}
              <div className="absolute inset-0 border-[3px] border-dashed border-threadGold/0 rounded-lg transition-all duration-300 group-hover:border-threadGold/50 pointer-events-none"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
