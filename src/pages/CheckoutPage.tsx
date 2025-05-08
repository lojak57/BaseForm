
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PaymentStripe from "@/components/blocks/PaymentStripe";
import { useCart } from "@/context/CartContext";

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Redirect to cart if cart is empty
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-3xl md:text-4xl mb-8 text-center">Checkout</h1>
          
          <PaymentStripe />
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
