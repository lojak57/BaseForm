
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/sonner";

const PaymentStripe = () => {
  const { cart, cartTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    if (cart.length === 0) {
      window.location.href = "/cart";
    }
  }, [cart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      window.location.href = "/thank-you";
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="font-playfair text-xl mb-4">Order Summary</h3>
        <div className="border-t border-b py-4 mb-4">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.fabricCode}`} className="flex justify-between mb-2">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-darkGray ml-2">({item.fabricLabel})</span>
                <span className="text-darkGray ml-2">x {item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>${cartTotal().toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="font-playfair text-xl mb-4">Shipping Information</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-darkText mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={shippingInfo.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-darkText mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-darkText mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-darkText mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="block text-darkText mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                  required
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-darkText mb-1">
                  ZIP
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={shippingInfo.zip}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="font-playfair text-xl mb-4">Payment Information</h3>
            <div className="p-4 border rounded-md bg-gray-50 flex items-center justify-center text-center">
              <div>
                <p className="mb-2">Stripe payment form would be integrated here</p>
                <p className="text-sm text-darkGray mb-4">Test mode is active - no real charges will be made</p>
                <div className="flex justify-center space-x-4">
                  <img src="/images/visa.svg" alt="Visa" className="h-8" />
                  <img src="/images/mastercard.svg" alt="Mastercard" className="h-8" />
                  <img src="/images/amex.svg" alt="American Express" className="h-8" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : `Pay $${cartTotal().toFixed(2)}`}
          </button>

          <p className="text-xs text-center text-darkGray mt-4">
            By completing your purchase, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentStripe;
