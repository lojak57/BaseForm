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
  
  // Randomly show sale badge on some products (in a real app this would be based on actual data)
  const isSale = product.id.length % 3 === 0;
  
  // Randomly show new badge on some products (in a real app this would be based on actual data)
  const isNew = product.id.length % 4 === 0;
  
  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group block rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg relative border border-gray-100"
    >
      {/* Decorative corner accent using accent color */}
      <div className="absolute top-0 right-0 w-20 h-20 z-10 overflow-hidden">
        <div 
          className="absolute transform rotate-45 bg-accent text-white text-xs font-bold py-1 right-[-35px] top-[15px] w-[140px] flex items-center justify-center"
          style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
        >
          {isNew ? "NEW ARRIVAL" : isSale ? "SALE" : ""}
        </div>
      </div>
  
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
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="destructive">Not Available</Badge>
          </div>
        )}
        
        {/* Quick view button using secondary color */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div 
            className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium shadow-md flex items-center gap-2 hover:bg-secondary/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Quick View
          </div>
        </div>
      </div>
      
      <div className="p-5 bg-white relative">
        {/* Geometric decorative element using secondary color */}
        <div className="absolute -top-3 left-6 w-6 h-6 rotate-45 bg-secondary/10 rounded-sm"></div>
        
        <div className="flex flex-col space-y-2">
          <h3 className="font-playfair text-lg min-h-[3rem] leading-tight group-hover:text-threadGold transition-colors duration-300 line-clamp-2">{product.name}</h3>
          
          <div className="flex items-baseline gap-2">
            <p className="text-darkGray font-medium">{formatCurrency(product.price)}</p>
            {isSale && (
              <p className="text-sm line-through text-gray-400">{formatCurrency(product.price * 1.2)}</p>
            )}
          </div>
          
          {/* Show fabric options count if there are multiple fabrics */}
          {product.hasFabricSelection && product.fabrics && product.fabrics.length > 1 && (
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="inline-flex w-2 h-2 rounded-full" 
                style={{ backgroundColor: "var(--accent)" }}
              ></span>
              <p className="text-xs uppercase tracking-wider font-medium">
                {product.fabrics.length} fabric options
              </p>
            </div>
          )}
        </div>
        
        {/* Shop now indicator with gradient background using secondary and accent colors */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-darkGray">Shop now</span>
          <span 
            className="w-6 h-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300"
            style={{ 
              background: "linear-gradient(45deg, var(--secondary), var(--accent))",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 