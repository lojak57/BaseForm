import { Product, ProductColor } from "./CartModal";
import { generatePlaceholderImage } from "@/lib/utils";

interface ProductDetailProps {
  product: Product;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: ProductColor | null;
  setSelectedColor: (color: ProductColor | null) => void;
  addToCart: () => void;
  handleBackToProducts: () => void;
  generatePlaceholderImage: (text: string, bgColor?: string, textColor?: string) => string;
}

const ProductDetail = ({
  product,
  primaryColor,
  secondaryColor,
  accentColor,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  addToCart,
  handleBackToProducts,
  generatePlaceholderImage
}: ProductDetailProps) => {
  return (
    <div className="mb-8 relative">
      {/* Back button */}
      <button 
        className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        onClick={handleBackToProducts}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back to Products
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product image with decorative elements */}
        <div className="relative">
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-16 h-16 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 rounded-br-full opacity-20" style={{ backgroundColor: secondaryColor }}></div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 -z-10 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-20" style={{ backgroundColor: accentColor }}></div>
          </div>
          
          {/* Image wrapper */}
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
            <img 
              src={product.image || generatePlaceholderImage(product.name)} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Sale or New tag */}
            {product.id.length % 3 === 0 && (
              <div 
                className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white shadow-md rounded-md"
                style={{ backgroundColor: secondaryColor }}
              >
                SALE
              </div>
            )}
            {product.id.length % 4 === 0 && !(product.id.length % 3 === 0) && (
              <div 
                className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white shadow-md rounded-md"
                style={{ backgroundColor: accentColor }}
              >
                NEW
              </div>
            )}
          </div>
          
          {/* Thumbnail images */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border-2 relative" style={{ borderColor: primaryColor }}>
              <img 
                src={product.image || generatePlaceholderImage(product.name)} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden relative opacity-70 hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                  Image {i+1}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Product info */}
        <div>
          {/* Title with decorative accent */}
          <div className="relative">
            <div 
              className="absolute left-0 top-0 w-1.5 h-8 rounded-full -translate-x-4" 
              style={{ backgroundColor: secondaryColor }}
            ></div>
            <h1 
              className="text-2xl font-medium mb-2"
              style={{ fontFamily: `var(--preview-font)` }}
            >
              {product.name}
            </h1>
          </div>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span 
              className="text-xl font-bold"
              style={{ color: primaryColor }}
            >
              ${product.price}
            </span>
            {product.comparePrice && (
              <span className="text-sm line-through text-gray-400">
                ${product.comparePrice}
              </span>
            )}
            {/* Savings badge */}
            {product.comparePrice && (
              <span 
                className="ml-2 px-2 py-0.5 text-xs font-medium text-white rounded-full"
                style={{ backgroundColor: accentColor }}
              >
                Save ${(parseFloat(product.comparePrice) - parseFloat(product.price)).toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600 mb-3 leading-relaxed">
              {product.description || "No description available for this product."}
            </p>
            
            {/* Inventory */}
            <div className="flex items-center gap-2 text-sm mt-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: parseInt(product.inventory) > 10 ? 'green' : 'orange' }}
              ></div>
              <span className="text-gray-500">
                {parseInt(product.inventory) > 0 
                  ? `${product.inventory} in stock` 
                  : "Out of stock"}
              </span>
            </div>
          </div>
          
          {/* Size selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 flex items-center gap-1.5">
              <span>Size</span>
              <span 
                className="text-xs px-1.5 rounded"
                style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor }}
              >
                Required
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <div 
                  key={size}
                  className={`py-2 px-3 border ${selectedSize === size ? 'border-2' : 'border'} rounded-md text-sm text-center cursor-pointer transition-colors relative group flex-1 max-w-16 ${
                    selectedSize === size 
                      ? 'border-primary shadow-sm' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ 
                    borderColor: selectedSize === size ? primaryColor : undefined,
                    color: selectedSize === size ? primaryColor : undefined
                  }}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                  {/* Hover effect with accent color */}
                  <span 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-md"
                    style={{ backgroundColor: accentColor }}  
                  ></span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Color selection if available */}
          {product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium mb-2 flex items-center gap-1.5">
                <span>Color</span>
                <span 
                  className="text-xs px-1.5 rounded"
                  style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor }}
                >
                  Required
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <div 
                    key={color.name}
                    className={`w-12 h-12 rounded-full cursor-pointer transition-transform ${
                      selectedColor?.name === color.name 
                        ? 'ring-2 ring-offset-2 scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: color.hex,
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Add to cart button */}
          <div className="flex gap-4">
            <button 
              className="flex-1 py-3 px-6 rounded-lg text-white font-medium relative overflow-hidden group"
              style={{ backgroundColor: primaryColor }}
              onClick={addToCart}
            >
              <span className="absolute inset-0 w-full h-full transition-all ease-out duration-300 scale-0 group-hover:scale-100 group-hover:bg-white/10 rounded-lg"></span>
              <span className="relative">Add to Cart</span>
            </button>
          </div>
          
          {/* Extra info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Free Shipping</h4>
                <p className="text-gray-500">On orders over $50</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Easy Returns</h4>
                <p className="text-gray-500">30 day return policy</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Secure Checkout</h4>
                <p className="text-gray-500">SSL encrypted payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 