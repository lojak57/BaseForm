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
  logoUrl: '/images/logo.jpg',
  primaryColor: '#18a77e', // green from BaseForm logo
  textColor: '#0d3b66',   // navy blue from BaseForm logo
  bgColor: '#FFFFFF'      // white background
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
        isScrolled ? "shadow-md py-1.5" : "py-2"
      }`}
      style={{ 
        backgroundColor: isScrolled 
          ? `${themeSettings.bgColor}F8` 
          : `${themeSettings.bgColor}F0`,
        borderBottom: isScrolled ? '1px solid rgba(13, 59, 102, 0.1)' : 'none'
      }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo section removed */}

        {/* Desktop Navigation - enhanced styling */}
        <nav className="hidden md:flex items-center space-x-1 mx-auto">
          {[
            { path: '/', label: 'Home' },
            { path: '/demo', label: 'Demo' },
            { path: '/features', label: 'Features' },
            { path: '/pricing', label: 'Pricing' },
            { path: '/contact', label: 'Contact' }
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`font-medium text-base px-6 py-2.5 rounded-md transition-all ${
                isActive(item.path) 
                  ? 'bg-[#18a77e] text-white shadow-sm' 
                  : 'text-[#0d3b66] hover:bg-[#0d3b66]/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User actions */}
        <div className="flex items-center space-x-2">
          {/* Only keep the mobile menu trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-[#0d3b66]/10 transition-colors"
              >
                <Menu className="h-[18px] w-[18px] text-[#0d3b66]" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <div className="flex flex-col space-y-1 mt-8">
                {[
                  { path: '/', label: 'Home' },
                  { path: '/demo', label: 'Demo' },
                  { path: '/features', label: 'Features' },
                  { path: '/pricing', label: 'Pricing' },
                  { path: '/contact', label: 'Contact' }
                ].map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`font-medium text-base px-4 py-3 rounded-md ${
                      isActive(item.path) 
                        ? 'bg-[#18a77e] text-white' 
                        : 'text-[#0d3b66] hover:bg-[#0d3b66]/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
