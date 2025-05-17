import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Fabric } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, ChevronLeftIcon, ShoppingCartIcon, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FallbackImage from "@/components/ui/FallbackImage";
// Fix import path or suppress TypeScript error
// @ts-ignore - ProductCard exists but TypeScript is having trouble finding it
import ProductCard from "@/components/blocks/ProductCard";
import { getCategoryById } from "@/data/categories";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, loading, error, getProductsByCategory } = useProducts();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = getProductBySlug(slug || "");
  
  const [quantity, setQuantity] = useState(1);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check if product should have fabric selection
  const shouldShowFabricSelection = product?.hasFabricSelection && product?.fabrics?.length > 0;

  useEffect(() => {
    if (product && product.fabrics && product.fabrics.length > 0) {
      // Only set default fabric if product has fabric selection enabled
      if (product.hasFabricSelection) {
        setSelectedFabric(product.fabrics[0]);
      } else {
        // For products without fabric selection, still set a default fabric for cart purposes
        setSelectedFabric(product.fabrics[0]);
      }
    }
  }, [product]);
  
  // Setup fabric zoom functionality
  useEffect(() => {
    const setupFabricZoom = () => {
      const swatches = document.querySelectorAll('.fabric-swatch-container');
      
      swatches.forEach(swatch => {
        const preview = swatch.querySelector('.fabric-zoom-preview');
        const img = preview?.querySelector('img');
        
        swatch.addEventListener('mousemove', (e: MouseEvent) => {
          if (preview && img) {
            // Position the zoom preview
            const rect = swatch.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate scale factors for zoom effect
            const scaleX = preview.clientWidth / swatch.clientWidth;
            const scaleY = preview.clientHeight / swatch.clientHeight;
            
            // Apply transformations to the zoom preview image
            img.style.transformOrigin = `${x}px ${y}px`;
            img.style.transform = `scale(${Math.max(scaleX, scaleY) * 1.5})`;
          }
        });
      });
    };
    
    if (product && shouldShowFabricSelection) {
      // Use setTimeout to ensure DOM elements are rendered
      setTimeout(setupFabricZoom, 100);
    }
    
    return () => {
      // Clean up event listeners if needed
      const swatches = document.querySelectorAll('.fabric-swatch-container');
      swatches.forEach(swatch => {
        swatch.replaceWith(swatch.cloneNode(true));
      });
    };
  }, [product, selectedFabric, shouldShowFabricSelection]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Handle loading and error states
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 flex justify-center items-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-threadGold" />
          <span>Loading product...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-16">
          <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-6">
            Error loading product. Please try again later.
          </div>
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            <ChevronLeftIcon className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-16">
          <h1 className="text-3xl font-playfair mb-6">Product Not Found</h1>
          <p className="mb-6">Sorry, the product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")} variant="default">
            Back to Home
          </Button>
        </div>
      </Layout>
    );
  }

  // Related products (from the same category)
  const relatedProducts = getProductsByCategory(product.categoryId).filter(p => p.id !== product.id);

  // Products with hasFabricSelection=false should always be buyable
  // Products with hasFabricSelection=true need to have at least one fabric option
  const canAddToCart = !product.hasFabricSelection || (product.fabrics && product.fabrics.length > 0);

  // Check if product has any fabrics
  const hasFabrics = product.fabrics && product.fabrics.length > 0;

  // Helper to determine which images to show
  const displayImages = shouldShowFabricSelection && selectedFabric && selectedFabric.imgOverride && selectedFabric.imgOverride.length > 0
    ? selectedFabric.imgOverride
    : product.defaultImages;

  // Determine final price with fabric upcharge (only if fabric selection is enabled)
  const finalPrice = product.price + (shouldShowFabricSelection ? (selectedFabric?.upcharge || 0) : 0);

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    // For products without fabric selection, we just use a dummy fabric code
    if (!product.hasFabricSelection) {
      addToCart(product, quantity, "default");
      return;
    }
    
    // Check if the product has any fabrics at all (only for products with fabric selection)
    if (shouldShowFabricSelection && (!product.fabrics || product.fabrics.length === 0)) {
      toast.error("This product cannot be added to cart (no fabric options available)");
      return;
    }

    // Only validate fabric selection if product requires it
    if (shouldShowFabricSelection && !selectedFabric) {
      toast.error("Please select a fabric option");
      return;
    }

    // For products with fabric selection, use the selected fabric
    const fabricCode = shouldShowFabricSelection 
      ? (selectedFabric?.code || product.fabrics[0].code)
      : "default";
      
    addToCart(product, quantity, fabricCode);
  };

  const category = getCategoryById(product.categoryId);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex flex-wrap space-x-2 text-sm text-darkGray">
            <li>
              <Link to="/" className="hover:text-threadGold transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            {category && (
              <>
                <li>
                  <Link 
                    to={`/category/${category.slug}`} 
                    className="hover:text-threadGold transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
                <li>/</li>
              </>
            )}
            <li className="text-darkText font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product images */}
          <div className="mb-8 lg:mb-0 lg:sticky lg:top-4">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <Swiper
                modules={[Pagination, Navigation]}
                pagination={{ clickable: true }}
                navigation
                onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                className="product-gallery"
              >
                {displayImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative aspect-square bg-white">
                      <FallbackImage
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full"
                        centerCrop={true}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            
            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex space-x-2 mt-4 justify-center">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 rounded overflow-hidden relative ${
                      currentImageIndex === index ? "ring-2 ring-threadGold" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <FallbackImage
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full"
                      centerCrop={true}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info - this now starts cleanly after images on mobile */}
          <div className="mt-2 lg:mt-0">
            <h1 className="text-3xl md:text-4xl font-playfair mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <span className="text-xl font-medium">{formatCurrency(finalPrice)}</span>
              {shouldShowFabricSelection && selectedFabric && selectedFabric.upcharge > 0 && (
                <span className="ml-2 text-sm text-darkGray">
                  (Includes {formatCurrency(selectedFabric.upcharge)} fabric upcharge)
                </span>
              )}
            </div>
            
            <div className="mb-8 prose max-w-none">
              <p>{product.description}</p>
            </div>
            
            {shouldShowFabricSelection && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Select Fabric</h3>
                <RadioGroup 
                  value={selectedFabric?.code || ""} 
                  onValueChange={(value) => {
                    const fabric = product.fabrics.find(f => f.code === value);
                    if (fabric) setSelectedFabric(fabric);
                  }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {product.fabrics.map((fabric) => (
                    <div key={fabric.code} className="relative">
                      <RadioGroupItem
                        value={fabric.code}
                        id={fabric.code}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={fabric.code}
                        className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-2 peer-data-[state=checked]:border-threadGold hover:border-threadGold/50 cursor-pointer transition-all"
                      >
                        <div className="w-full aspect-square overflow-hidden rounded-md bg-gray-100 relative fabric-swatch-container">
                          <FallbackImage
                            src={fabric.swatch}
                            alt={fabric.label}
                            className="w-full h-full object-cover fabric-swatch-image"
                          />
                          {/* Zoomed fabric preview that shows on hover */}
                          <div className="fabric-zoom-preview opacity-0 pointer-events-none fixed z-50 rounded-md overflow-hidden transition-all duration-300 shadow-xl">
                            <img
                              src={fabric.swatch}
                              alt={fabric.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{fabric.label}</div>
                          {fabric.upcharge > 0 && (
                            <div className="text-xs text-darkGray">
                              +{formatCurrency(fabric.upcharge)}
                            </div>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            
            {/* Quantity selector */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Quantity</h3>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={increaseQuantity}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to cart button */}
            {!canAddToCart ? (
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg mb-4 text-red-700 text-center">
                This product is currently unavailable (no fabric options)
              </div>
            ) : (
              <Button 
                onClick={handleAddToCart}
                className="w-full mb-4 bg-threadGold hover:bg-threadGold/90 text-darkText"
                size="lg"
              >
                <ShoppingCartIcon className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-playfair mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
