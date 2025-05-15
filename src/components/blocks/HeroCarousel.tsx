import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FallbackImage from "@/components/ui/FallbackImage";

interface HeroCarouselProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
}

// Define slide types
type ProductSlide = {
  type: "product";
  imageUrl: string;
  alt: string;
  productSlug: string;
};

type MashupSlide = {
  type: "mashup";
  images: string[];
  alt: string;
};

type Slide = ProductSlide | MashupSlide;

const HeroCarousel: React.FC<HeroCarouselProps> = ({ title, subtitle, ctaText, ctaLink }) => {
  const { products } = useProducts();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Create an array of slides that includes only product images
  const createSlides = (): Slide[] => {
    const productList = products
      .filter(product => product.defaultImages && product.defaultImages.length > 0);

    // Get up to 4 product images for the mashup
    const mashupImages = productList
      .slice(0, 4)
      .map(product => product.defaultImages[0]);

    const slides: Slide[] = [];

    // Add a product mashup slide if we have enough products
    if (mashupImages.length >= 2) {
      slides.push({
        type: "mashup",
        images: mashupImages,
        alt: "Product Collection"
      });
    }

    // Add individual product highlights
    const productHighlights: ProductSlide[] = productList
      .slice(0, 4) // Show more individual products
      .map(product => ({
        type: "product",
        imageUrl: product.defaultImages[0],
        alt: product.name,
        productSlug: product.slug
      }));

    return [...slides, ...productHighlights];
  };

  const slides = createSlides();

  // Auto advance carousel
  useEffect(() => {
    if (isPaused || isTransitioning) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSlide, isPaused, isTransitioning]);

  const goToNextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToPrevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleSlideClick = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // If the swipe is significant (more than 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left (next)
        goToNextSlide();
      } else {
        // Swipe right (prev)
        goToPrevSlide();
      }
    }
    
    setTouchStart(null);
  };

  // Display message if no slides are available
  if (slides.length === 0) {
    return (
      <div className="relative overflow-hidden h-[70vh] sm:h-[65vh] md:h-[70vh] bg-darkText">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-playfair mb-4">No product images available</h2>
            <p>Product images will appear here once they are added</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden h-[70vh] sm:h-[65vh] md:h-[70vh] bg-darkText"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel slides */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={`slide-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Single product image */}
            {slide.type !== "mashup" && (
              <div className="absolute inset-0">
                <FallbackImage
                  src={slide.imageUrl}
                  alt={slide.alt}
                  className="w-full h-full"
                  centerCrop={true}
                />
              </div>
            )}
            
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-darkText/40"></div>

            {/* Special handling for mashup slide */}
            {slide.type === "mashup" && (
              <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
                {slide.images.map((img, imgIndex) => (
                  <div 
                    key={`mashup-${imgIndex}`} 
                    className="relative overflow-hidden"
                    style={{
                      animation: `fadein ${0.5 + imgIndex * 0.2}s ease-out forwards`
                    }}
                  >
                    <FallbackImage 
                      src={img} 
                      alt={`Product ${imgIndex + 1}`}
                      className="w-full h-full" 
                      centerCrop={true}
                    />
                    <div className="absolute inset-0 bg-darkText/20"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hero content */}
      <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair text-white mb-2 sm:mb-4 drop-shadow-lg animate-fadein">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-8 drop-shadow-md animate-fadein" 
               style={{ animationDelay: '0.2s' }}>
              {subtitle}
            </p>
          )}
          
          <Link 
            to={ctaLink} 
            className="inline-block bg-threadGold hover:bg-threadGold/90 text-darkText font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-md transition-colors animate-fadein"
            style={{ animationDelay: '0.4s' }}
          >
            {ctaText}
          </Link>
        </div>
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={goToPrevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-2 focus:outline-none transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button 
        onClick={goToNextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-2 focus:outline-none transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => handleSlideClick(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full focus:outline-none transition-colors ${
              activeSlide === index ? "bg-threadGold" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel; 