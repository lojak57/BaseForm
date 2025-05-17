import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CartTable from "@/components/blocks/CartTable";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

const CartPage = () => {
  const { cart, cartTotal } = useCart();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-3xl md:text-4xl mb-8 text-center">Shopping Cart</h1>
          
          <div className="max-w-6xl mx-auto">
            <CartTable />
            
            {cart.length > 0 && (
              <div className="mt-8 flex flex-col md:flex-row justify-between items-start">
                {/* Coupon Code (inactive for now) */}
                <div className="w-full md:w-auto mb-4 md:mb-0">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                      disabled
                    />
                    <button
                      className="bg-gray-200 text-darkGray px-4 py-2 rounded-r-md"
                      disabled
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                {/* Cart Totals */}
                <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="font-playfair text-xl mb-4">Cart Total</h2>
                  <div className="border-t border-gray-100 py-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>{formatCurrency(cartTotal())}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping</span>
                      <span className="text-darkGray">Details at checkout</span>
                    </div>
                    <div className="text-xs text-darkGray/80 italic mb-2">
                      Currently offering local handoffs. Shipping options will be communicated after purchase.
                    </div>
                  </div>
                  <div className="border-t border-gray-100 py-4">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(cartTotal())}</span>
                    </div>
                  </div>
                  <Link to="/checkout" className="btn-primary w-full text-center mt-4">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
