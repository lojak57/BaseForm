
import { Link } from "react-router-dom";
import { Product } from "@/context/CartContext";

interface CardGalleryProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  category?: string;
}

const CardGallery = ({ title, subtitle, products, category }: CardGalleryProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && <p className="text-threadGold font-medium mb-2">{subtitle}</p>}
            {title && <h2 className="font-playfair text-3xl md:text-4xl">{title}</h2>}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link 
              key={product.id} 
              to={`/product/${product.slug}`}
              className="product-card group rounded-lg overflow-hidden hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={product.defaultImages[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-darkText/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                  <div className="bg-ivory/95 w-full text-center py-3 px-4 rounded-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="btn-text">View Details</span>
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-playfair text-xl text-darkText">{product.name}</h3>
                <p className="text-threadGold font-medium mt-2">${product.price}</p>
              </div>
              {/* Add subtle shadow effect on hover */}
              <div className="absolute inset-0 shadow-product opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Link>
          ))}
        </div>

        {category && (
          <div className="text-center mt-12">
            <Link to={`/category/${category}`} className="btn-secondary inline-block">
              View All
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CardGallery;
