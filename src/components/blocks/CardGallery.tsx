import { Product } from "@/context/CartContext";
import ProductCard from "@/components/blocks/ProductCard";

interface CardGalleryProps {
  products: Product[];
}

const CardGallery = ({ products }: CardGalleryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
      {products.map((product) => (
        <div key={product.id} className="transform transition-all duration-300 hover:-translate-y-1">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default CardGallery;
