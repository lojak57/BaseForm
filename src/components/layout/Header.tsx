
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";

const Header = () => {
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            className="h-[80px] md:h-[120px] object-contain"
          />
        </Link>

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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag text-darkText hover:text-threadGold transition-colors">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-threadGold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount()}
              </span>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
