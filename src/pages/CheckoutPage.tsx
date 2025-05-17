import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeftIcon, ShoppingCart, AlertCircle } from "lucide-react";
import FallbackImage from "@/components/ui/FallbackImage";
import StripeCheckout from "@/components/checkout/StripeCheckout";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const location = useLocation();
  
  // Basic Info
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  
  // Shipping Address
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  
  // Order Notes
  const [orderNotes, setOrderNotes] = useState("");

  // Check if payment was canceled
  const canceled = new URLSearchParams(location.search).get("canceled") === "true";
  
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const regex = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
    return phone === "" || regex.test(phone);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setCustomerEmail(email);
    setIsValidEmail(email === "" || validateEmail(email));
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setCustomerPhone(phone);
    setIsValidPhone(validatePhone(phone));
  };

  const isFormValid = () => {
    return customerName !== "" && 
           customerEmail !== "" && 
           isValidEmail && 
           isValidPhone &&
           streetAddress !== "" && 
           city !== "" && 
           state !== "" && 
           zipCode !== "";
  };

  if (cart.length === 0 && !canceled) {
    return (
      <Layout>
        <div className="container mx-auto py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-threadGold" />
            <h1 className="text-3xl font-playfair mb-4">Your Cart is Empty</h1>
            <p className="text-darkGray mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild className="bg-threadGold hover:bg-threadGold/90 text-darkText">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Checkout form */}
          <div className="flex-1">
            <div className="flex items-center mb-6">
              <Link to="/cart" className="mr-4">
                <ChevronLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-playfair">Checkout</h1>
            </div>

            {canceled && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Payment Canceled</p>
                  <p className="text-amber-700">
                    Your payment was canceled. You can try again or continue shopping.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-medium mb-4">Customer Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name<span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    placeholder="Your full name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address<span className="text-red-500">*</span></Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={customerEmail}
                      onChange={handleEmailChange}
                      className={!isValidEmail ? "border-red-500" : ""}
                      required
                    />
                    {!isValidEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="(123) 456-7890" 
                      value={customerPhone}
                      onChange={handlePhoneChange}
                      className={!isValidPhone ? "border-red-500" : ""}
                    />
                    {!isValidPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        Please enter a valid phone number
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-medium mb-4">Shipping Address</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address<span className="text-red-500">*</span></Label>
                  <Input 
                    id="street" 
                    placeholder="123 Main St" 
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input 
                    id="apartment" 
                    placeholder="Apt #, Suite, etc." 
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City<span className="text-red-500">*</span></Label>
                    <Input 
                      id="city" 
                      placeholder="San Francisco" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State<span className="text-red-500">*</span></Label>
                    <Input 
                      id="state" 
                      placeholder="CA" 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zipcode">ZIP Code<span className="text-red-500">*</span></Label>
                    <Input 
                      id="zipcode" 
                      placeholder="94103" 
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country">Country<span className="text-red-500">*</span></Label>
                  <Input 
                    id="country" 
                    placeholder="United States" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Order Notes (optional)</Label>
                  <textarea 
                    id="notes"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-threadGold focus:border-threadGold"
                    placeholder="Special instructions for your order, delivery preferences, etc."
                    rows={3}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.fabricCode}`} className="py-4 flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      <FallbackImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-darkGray">Fabric: {item.fabricLabel}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.productId, item.fabricCode, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <span className="sr-only">Decrease</span>
                          <span>-</span>
                        </Button>
                        <span className="text-sm">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.productId, item.fabricCode, item.quantity + 1)}
                        >
                          <span className="sr-only">Increase</span>
                          <span>+</span>
                        </Button>
                        
                        <button
                          onClick={() => removeFromCart(item.productId, item.fabricCode)}
                          className="ml-auto text-sm text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-medium">{formatCurrency(item.price)}</span>
                      <p className="text-sm text-darkGray">
                        {item.quantity > 1 && `${formatCurrency(item.price)} each`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-darkGray">Subtotal</span>
                  <span className="font-medium">{formatCurrency(cartTotal())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-darkGray">Shipping</span>
                  <span className="font-medium">Details provided upon receipt</span>
                </div>
                <div className="text-sm text-darkGray/80 italic ml-2 mb-2">
                  <span>Currently offering local handoffs. Shipping arrangements will be communicated by owner after order placement.</span>
                </div>
                <div className="flex justify-between text-lg mt-4 pt-4 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">{formatCurrency(cartTotal())}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order summary for larger screens */}
          <div className="md:w-96">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <h2 className="text-xl font-medium mb-4">Payment</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-darkGray">Order Total</span>
                  <span className="font-medium">{formatCurrency(cartTotal())}</span>
                </div>
              </div>
              
              <StripeCheckout 
                customerName={customerName}
                customerEmail={customerEmail}
                customerPhone={customerPhone}
                customerAddress={{
                  street: streetAddress,
                  apartment: apartment,
                  city: city,
                  state: state,
                  zipCode: zipCode,
                  country: country
                }}
                orderNotes={orderNotes}
                buttonText="Proceed to Payment"
                disabled={!isFormValid()}
                onSuccess={() => {
                  console.log("Payment initiated successfully");
                }}
                onError={(error) => {
                  console.error("Payment error:", error);
                }}
              />
              
              {/* Payment Method Logos */}
              <div className="mt-6 flex justify-center gap-4">
                <img 
                  src="/images/payment/visa.svg" 
                  alt="Visa" 
                  className="h-8" 
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/payment/visa.png" }}
                />
                <img 
                  src="/images/payment/mastercard.svg" 
                  alt="Mastercard" 
                  className="h-8" 
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/payment/mastercard.png" }}
                />
                <img 
                  src="/images/payment/amex.svg" 
                  alt="American Express" 
                  className="h-8" 
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/payment/amex.png" }}
                />
                <img 
                  src="/images/payment/apple-pay.svg" 
                  alt="Apple Pay" 
                  className="h-8" 
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/payment/apple-pay.png" }}
                />
              </div>
              
              <div className="mt-6 text-center text-sm text-darkGray">
                <p>By completing your order, you agree to our</p>
                <div className="flex justify-center gap-2">
                  <Link to="/terms" className="text-threadGold hover:underline">
                    Terms of Service
                  </Link>
                  <span>&</span>
                  <Link to="/privacy" className="text-threadGold hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
