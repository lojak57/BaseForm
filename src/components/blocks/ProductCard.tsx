import { Link } from "react-router-dom";
import { Product } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import FallbackImage from "@/components/ui/FallbackImage";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Use the first image as the main display image
  const displayImage = product.defaultImages[0] || "/images/placeholder.jpg";
  
  // Check product availability based on fabric selection setting
  const isAvailable = product.hasFabricSelection === false || 
                     (product.fabrics && product.fabrics.length > 0);
  
  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group block rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <FallbackImage
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {!isAvailable && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">Not Available</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white">
        <h3 className="font-medium text-lg truncate">{product.name}</h3>
        <p className="text-darkGray text-sm">{formatCurrency(product.price)}</p>
        
        {/* Show fabric options count if there are multiple fabrics */}
        {product.hasFabricSelection && product.fabrics && product.fabrics.length > 1 && (
          <p className="text-xs text-threadGold mt-2">
            {product.fabrics.length} fabric options available
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard; 