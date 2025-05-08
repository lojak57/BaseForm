
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";

const ThankYouPage = () => {
  const { clearCart } = useCart();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Clear the cart on successful order
    clearCart();
  }, [clearCart]);

  return (
    <Layout>
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="mb-8 text-threadGold">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle mx-auto">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="font-playfair text-3xl md:text-5xl mb-6">Thank You for Your Order!</h1>
          <p className="text-darkGray text-lg mb-8">
            Your order has been received and is being processed. A confirmation email has been sent to your email address.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="font-playfair text-xl mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-darkGray mb-1">Order Number</p>
                <p className="font-medium">VC-12345</p>
              </div>
              <div>
                <p className="text-darkGray mb-1">Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-darkGray mb-1">Email</p>
                <p className="font-medium">customer@example.com</p>
              </div>
              <div>
                <p className="text-darkGray mb-1">Total</p>
                <p className="font-medium">$149.95</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-playfair text-xl mb-3">What Happens Next?</h3>
            <p className="text-darkGray mb-4">
              We'll start crafting your handmade item right away. Since each piece is made to order, please allow 3-5 business days for production before shipping.
            </p>
            <p className="text-darkGray">
              You'll receive a shipping confirmation email with tracking information once your order is on its way.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/" className="btn-primary">
              Continue Shopping
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThankYouPage;
