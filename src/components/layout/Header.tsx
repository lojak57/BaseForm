import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header = () => {
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
        isScrolled ? "bg-ivory shadow-md py-2" : "bg-ivory/90 py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/463dd640-f9c6-4abf-aa5f-4e6927af1de5.png" 
            alt="VC Sews" 
            className="h-[100px] md:h-[140px] w-auto object-contain transition-all duration-300"
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
