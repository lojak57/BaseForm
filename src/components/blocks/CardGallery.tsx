import { Product } from "@/context/CartContext";
import ProductCard from "@/components/blocks/ProductCard";

interface CardGalleryProps {
  products: Product[];
}

const CardGallery = ({ products }: CardGalleryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CardGallery;
