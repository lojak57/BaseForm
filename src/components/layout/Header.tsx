import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Default theme settings if not customized
const DEFAULT_SETTINGS = {
  logoUrl: '/lovable-uploads/463dd640-f9c6-4abf-aa5f-4e6927af1de5.png',
  primaryColor: '#D4AF37', // threadGold
  textColor: '#1F1E1D',   // darkText
  bgColor: '#FDFCF7'      // ivory
};

const Header = () => {
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [themeSettings, setThemeSettings] = useState(DEFAULT_SETTINGS);
  const navigate = useNavigate();

  // Load theme settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('vcsews-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setThemeSettings({
          logoUrl: parsedSettings.logoUrl || DEFAULT_SETTINGS.logoUrl,
          primaryColor: parsedSettings.primaryColor || DEFAULT_SETTINGS.primaryColor,
          textColor: parsedSettings.textColor || DEFAULT_SETTINGS.textColor,
          bgColor: parsedSettings.bgColor || DEFAULT_SETTINGS.bgColor
        });
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, []);
  
  // Apply CSS variables for theme colors
  useEffect(() => {
    // Set CSS variables at the document root level for global access
    document.documentElement.style.setProperty('--thread-gold', themeSettings.primaryColor);
    document.documentElement.style.setProperty('--dark-text', themeSettings.textColor);
    document.documentElement.style.setProperty('--ivory', themeSettings.bgColor);
  }, [themeSettings]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md py-2" : "py-4"
      }`}
      style={{ backgroundColor: isScrolled ? themeSettings.bgColor : `${themeSettings.bgColor}E6` }} // E6 = 90% opacity
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={themeSettings.logoUrl} 
            alt="Store Logo" 
            className="h-[100px] md:h-[140px] w-auto object-contain transition-all duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_SETTINGS.logoUrl;
            }}
          />
        </Link>

        {/* Search bar - desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium text-darkText hover:text-threadGold stitch-hover">
            Home
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="font-medium text-darkText hover:text-threadGold stitch-hover"
            >
              {category.name}
            </Link>
          ))}
          <Link to="/contact" className="font-medium text-darkText hover:text-threadGold stitch-hover">
            Contact
          </Link>
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center">
          <Link 
            to="/cart" 
            className="relative p-2 ml-4"
          >
            <ShoppingCart className="h-6 w-6 text-darkText hover:text-threadGold transition-colors" />
            {cartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-threadGold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount()}
              </span>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-ivory">
              <div className="flex flex-col space-y-4 mt-8">
                <Link 
                  to="/" 
                  className="font-medium text-lg text-darkText hover:text-threadGold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="font-medium text-lg text-darkText hover:text-threadGold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link 
                  to="/contact" 
                  className="font-medium text-lg text-darkText hover:text-threadGold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link 
                  to="/cart" 
                  className="font-medium text-lg text-darkText hover:text-threadGold flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cart ({cartCount()})
                </Link>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-6 mb-6">
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
