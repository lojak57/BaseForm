
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ImageCarousel from "@/components/blocks/ImageCarousel";
import VariantSelector from "@/components/blocks/VariantSelector";
import CardGallery from "@/components/blocks/CardGallery";
import { getProductBySlug, getProductsByCategory } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedFabric, setSelectedFabric] = useState("");
  const [price, setPrice] = useState(0);
  const [fabricImage, setFabricImage] = useState("");
  
  // Get related products (same category, excluding current product)
  const relatedProducts = product 
    ? getProductsByCategory(product.categoryId).filter(p => p.id !== product.id).slice(0, 3) 
    : [];
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (product) {
      // Initialize with first fabric
      const initialFabric = product.fabrics[0];
      setSelectedFabric(initialFabric.code);
      setPrice(product.price + initialFabric.upcharge);
      setFabricImage(initialFabric.imgOverride?.[0] || product.defaultImages[0]);
    }
  }, [product]);

  const handleFabricSelect = (fabricCode: string, newPrice: number) => {
    setSelectedFabric(fabricCode);
    setPrice(newPrice);
    
    // Update fabric image if available
    const selectedFabricObj = product?.fabrics.find(f => f.code === fabricCode);
    if (selectedFabricObj?.imgOverride?.[0]) {
      setFabricImage(selectedFabricObj.imgOverride[0]);
    } else if (product) {
      setFabricImage(product.defaultImages[0]);
    }
  };

  const handleAddToCart = () => {
    if (product && selectedFabric) {
      addToCart(product, quantity, selectedFabric);
    }
  };

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl mb-6">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex space-x-2 text-sm text-darkGray">
              <li>
                <Link to="/" className="hover:text-threadGold transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link 
                  to={`/category/${product.categoryId}`} 
                  className="hover:text-threadGold transition-colors"
                >
                  {product.categoryId.charAt(0).toUpperCase() + product.categoryId.slice(1)}
                </Link>
              </li>
              <li>/</li>
              <li className="text-darkText">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <ImageCarousel 
                images={product.defaultImages}
                alt={product.name}
                selectedFabricImage={fabricImage}
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl mb-2">{product.name}</h1>
              <p className="text-threadGold text-xl mb-6">${price.toFixed(2)}</p>

              <div className="prose mb-8">
                <p className="whitespace-pre-line">{product.description}</p>
              </div>

              {/* Fabric Selection */}
              <div className="mb-8">
                <VariantSelector 
                  fabrics={product.fabrics}
                  basePrice={product.price}
                  onSelect={handleFabricSelect}
                  defaultSelected={selectedFabric}
                />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-8">
                <label htmlFor="quantity" className="text-darkText font-medium block mb-2">
                  Quantity
                </label>
                <div className="flex items-center mb-6">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center border-t border-b border-gray-300"
                  />
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck mr-3 text-threadGold">
                    <path d="M10 17h4V5H2v12h3"></path>
                    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"></path>
                    <path d="M14 17h1"></path>
                    <circle cx="7.5" cy="17.5" r="2.5"></circle>
                    <circle cx="17.5" cy="17.5" r="2.5"></circle>
                  </svg>
                  <p className="text-sm">Free shipping on orders over $100</p>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-heart mr-3 text-threadGold">
                    <path d="M11 14V8a1 1 0 0 0-1-1v0a1 1 0 0 0-1 1v2.5"></path>
                    <path d="M9 10.5V5a1 1 0 0 0-1-1v0a1 1 0 0 0-1 1v9"></path>
                    <path d="M7 14V7a1 1 0 0 0-1-1v0a1 1 0 0 0-1 1v7"></path>
                    <path d="M18 15v4a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-6"></path>
                    <path d="m17.5 10.5 1.5-1.5 1.5 1.5L17.5 14l-3-3 1.5-1.5"></path>
                  </svg>
                  <p className="text-sm">Handmade with love in Colorado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-playfair text-2xl md:text-3xl mb-8">You May Also Like</h2>
              <CardGallery products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
