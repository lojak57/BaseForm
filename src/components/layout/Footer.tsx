import { Link } from "react-router-dom";
import { categories } from "@/data/categories";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0d3b66] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Column */}
          <div>
            <h3 className="font-playfair text-xl mb-4">About BaseForm</h3>
            <p className="text-gray-300 mb-4">
              A fully customizable e-commerce template with multi-tenant support.
              Build beautiful online stores with comprehensive product management
              and seamless checkout experiences.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#18a77e]">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#18a77e]">
                <span className="sr-only">Pinterest</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin">
                  <line x1="12" x2="12" y1="17" y2="22"></line>
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#18a77e]">
                <span className="sr-only">Facebook</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/demo" className="text-gray-300 hover:text-[#18a77e] transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-300 hover:text-[#18a77e] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-[#18a77e] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#18a77e] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Contact</h3>
            <address className="not-italic text-gray-300">
              <p className="mb-2">BaseForm</p>
              <p className="mb-4">
                <a href="tel:+17207716088" className="hover:text-[#18a77e] transition-colors">
                  (720) 771-6088
                </a>
              </p>
              <p>
                <a href="mailto:info@baseform.com" className="hover:text-[#18a77e] transition-colors">
                  info@baseform.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} BaseForm. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <Link to="/privacy" className="hover:text-[#18a77e] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#18a77e] transition-colors">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-[#18a77e] transition-colors">Shipping & Returns</Link>
            <Link to="/admin/login" className="hover:text-[#18a77e] transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
