import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { ShoppingCart, Menu, Search, User, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";

// Default theme settings if not customized
const DEFAULT_SETTINGS = {
  logoUrl: '/placeholder-images/placeholder-logo.svg',
  primaryColor: '#3B82F6', // blue
  textColor: '#1E293B',   // slate-800
  bgColor: '#F1F5F9'      // slate-100
};

const Header = () => {
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [themeSettings, setThemeSettings] = useState(DEFAULT_SETTINGS);
  const navigate = useNavigate();
  const location = useLocation();

  // Get logo from localStorage settings if available
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  
  // Load theme settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('webshop-settings');
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

  // Check if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 backdrop-blur-sm transition-all duration-300 ${
        isScrolled ? "shadow-sm py-1.5" : "py-2"
      }`}
      style={{ 
        backgroundColor: isScrolled 
          ? `${themeSettings.bgColor}F0` 
          : `${themeSettings.bgColor}E0`,
        borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : 'none'
      }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={themeSettings.logoUrl} 
            alt="Store Logo" 
            className="h-[40px] md:h-[48px] w-auto object-contain transition-all duration-300"
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
              className="w-full pr-10 py-1.5 rounded-full border-gray-200 bg-white/90 focus:bg-white focus:border-threadGold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-threadGold transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-5">
          <Link 
            to="/" 
            className={`font-medium text-sm text-darkText hover:text-threadGold transition-colors py-1.5 border-b-2 ${
              isActive('/') ? 'border-threadGold text-threadGold' : 'border-transparent'
            }`}
          >
            Home
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className={`font-medium text-sm text-darkText hover:text-threadGold transition-colors py-1.5 border-b-2 ${
                isActive(`/category/${category.slug}`) ? 'border-threadGold text-threadGold' : 'border-transparent'
              }`}
            >
              {category.name}
            </Link>
          ))}
          <Link 
            to="/contact" 
            className={`font-medium text-sm text-darkText hover:text-threadGold transition-colors py-1.5 border-b-2 ${
              isActive('/contact') ? 'border-threadGold text-threadGold' : 'border-transparent'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* User actions */}
        <div className="flex items-center space-x-2">
          {/* Wishlist - desktop only */}
          <Link 
            to="/wishlist" 
            className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-gray-100/80 transition-colors"
          >
            <Heart className="h-[18px] w-[18px] text-darkText hover:text-threadGold transition-colors" />
          </Link>
          
          {/* Account - desktop only */}
          <Link 
            to="/account" 
            className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-gray-100/80 transition-colors"
          >
            <User className="h-[18px] w-[18px] text-darkText hover:text-threadGold transition-colors" />
          </Link>

        {/* Cart Icon */}
          <Link 
            to="/cart" 
            className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100/80 transition-colors"
          >
            <ShoppingCart className="h-[18px] w-[18px] text-darkText hover:text-threadGold transition-colors" />
            {cartCount() > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-threadGold text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center"
                style={{ boxShadow: '0 0 0 2px white' }}
              >
                {cartCount()}
              </span>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100/80 transition-colors"
              >
                <Menu className="h-[18px] w-[18px] text-darkText" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-ivory">
              <div className="flex flex-col space-y-4 mt-8">
                <Link 
                  to="/" 
                  className={`font-medium text-base px-2 py-2 rounded ${
                    isActive('/') ? 'bg-threadGold/10 text-threadGold' : 'text-darkText'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className={`font-medium text-base px-2 py-2 rounded ${
                      isActive(`/category/${category.slug}`) ? 'bg-threadGold/10 text-threadGold' : 'text-darkText'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link 
                  to="/contact" 
                  className={`font-medium text-base px-2 py-2 rounded ${
                    isActive('/contact') ? 'bg-threadGold/10 text-threadGold' : 'text-darkText'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                <div className="border-t border-gray-100 my-2 pt-2"></div>
                
                <Link 
                  to="/wishlist" 
                  className="font-medium text-base text-darkText hover:text-threadGold flex items-center gap-2 px-2 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                </Link>
                
                <Link 
                  to="/account" 
                  className="font-medium text-base text-darkText hover:text-threadGold flex items-center gap-2 px-2 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Account
                </Link>
                
                <Link 
                  to="/cart" 
                  className="font-medium text-base text-darkText hover:text-threadGold flex items-center gap-2 px-2 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({cartCount()})
                </Link>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-6 mb-6">
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pr-10 rounded-full py-1.5 border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-threadGold transition-colors"
                  >
                    <Search className="h-4 w-4" />
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
