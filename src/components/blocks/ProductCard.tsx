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
      className="group block rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg relative border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="h-full w-full group-hover:scale-105 transition-transform duration-300">
          <FallbackImage
            src={displayImage}
            alt={product.name}
            className="w-full h-full"
            centerCrop={true}
          />
        </div>
        
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {!isAvailable && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="destructive">Not Available</Badge>
          </div>
        )}
      </div>
      
      <div className="p-5 bg-white">
        <div className="flex flex-col space-y-2">
          <h3 className="font-playfair text-lg leading-tight group-hover:text-threadGold transition-colors duration-300">{product.name}</h3>
          <p className="text-darkGray font-medium">{formatCurrency(product.price)}</p>
          
          {/* Show fabric options count if there are multiple fabrics */}
          {product.hasFabricSelection && product.fabrics && product.fabrics.length > 1 && (
            <p className="text-xs uppercase tracking-wider text-threadGold mt-1 font-medium">
              {product.fabrics.length} fabric options
            </p>
          )}
        </div>
        
        {/* Shop now indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-darkGray">Shop now</span>
          <span className="w-5 h-5 rounded-full bg-threadGold/10 flex items-center justify-center group-hover:bg-threadGold transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-threadGold">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 