
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
              className="product-card group rounded-lg overflow-hidden"
            >
              <div className="relative h-80 md:h-96 overflow-hidden">
                <img 
                  src={product.defaultImages[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-playfair text-xl text-darkText">{product.name}</h3>
                <p className="text-threadGold font-medium mt-2">${product.price}</p>
              </div>
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
