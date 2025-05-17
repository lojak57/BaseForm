import { CreditCard } from "lucide-react";
import { type Product, type CartItem } from "./CartModal";

export interface CheckoutState {
  step: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

interface CheckoutModalProps {
  showCheckout: boolean;
  checkoutState: CheckoutState;
  primaryColor: string;
  cartItems: CartItem[];
  backToCart: () => void;
  updateCheckoutField: (field: keyof CheckoutState, value: string) => void;
  nextCheckoutStep: () => void;
  prevCheckoutStep: () => void;
  completeOrder: () => void;
  calculateCartTotal: () => string;
}

const CheckoutModal = ({
  showCheckout,
  checkoutState,
  primaryColor,
  cartItems,
  backToCart,
  updateCheckoutField,
  nextCheckoutStep,
  prevCheckoutStep,
  completeOrder,
  calculateCartTotal
}: CheckoutModalProps) => {
  if (!showCheckout) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Checkout
          </h3>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={backToCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {/* Checkout Steps */}
          <div className="mb-6">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
              
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
                    step === checkoutState.step
                      ? "bg-primary text-white shadow-lg"
                      : step < checkoutState.step
                      ? "bg-primary/80 text-white"
                      : "bg-white text-gray-400 border border-gray-200"
                  }`}
                  style={{ 
                    backgroundColor: step <= checkoutState.step ? primaryColor : undefined
                  }}
                >
                  {step}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <div className="text-center">Information</div>
              <div className="text-center">Shipping</div>
              <div className="text-center">Payment</div>
            </div>
          </div>
          
          {/* Step 1: Customer Information */}
          {checkoutState.step === 1 && (
            <div>
              <h4 className="font-medium mb-4">Contact Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={checkoutState.email}
                    onChange={(e) => updateCheckoutField('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={checkoutState.firstName}
                      onChange={(e) => updateCheckoutField('firstName', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={checkoutState.lastName}
                      onChange={(e) => updateCheckoutField('lastName', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={checkoutState.address}
                    onChange={(e) => updateCheckoutField('address', e.target.value)}
                    placeholder="123 Main St."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={checkoutState.city}
                      onChange={(e) => updateCheckoutField('city', e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={checkoutState.postalCode}
                      onChange={(e) => updateCheckoutField('postalCode', e.target.value)}
                      placeholder="10001"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    value={checkoutState.country}
                    onChange={(e) => updateCheckoutField('country', e.target.value)}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Shipping Method */}
          {checkoutState.step === 2 && (
            <div>
              <h4 className="font-medium mb-4">Shipping Method</h4>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4 bg-white hover:border-gray-300 cursor-pointer">
                  <div className="flex items-center">
                    <input type="radio" id="standard" name="shipping" checked className="mr-3" />
                    <div>
                      <label htmlFor="standard" className="block font-medium">Standard Shipping</label>
                      <p className="text-sm text-gray-500">Delivery in 5-7 business days</p>
                    </div>
                    <div className="ml-auto font-medium">Free</div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4 bg-white hover:border-gray-300 cursor-pointer">
                  <div className="flex items-center">
                    <input type="radio" id="express" name="shipping" className="mr-3" disabled />
                    <div>
                      <label htmlFor="express" className="block font-medium text-gray-400">Express Shipping</label>
                      <p className="text-sm text-gray-400">Delivery in 2-3 business days</p>
                    </div>
                    <div className="ml-auto font-medium text-gray-400">$12.99</div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4 bg-white hover:border-gray-300 cursor-pointer">
                  <div className="flex items-center">
                    <input type="radio" id="overnight" name="shipping" className="mr-3" disabled />
                    <div>
                      <label htmlFor="overnight" className="block font-medium text-gray-400">Overnight Shipping</label>
                      <p className="text-sm text-gray-400">Next business day delivery</p>
                    </div>
                    <div className="ml-auto font-medium text-gray-400">$24.99</div>
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h5 className="font-medium mb-2">Order Summary</h5>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
                    <span>${calculateCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span style={{ color: primaryColor }}>${calculateCartTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Payment Method */}
          {checkoutState.step === 3 && (
            <div>
              <h4 className="font-medium mb-4">Payment Method</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className={`p-3 border rounded-md cursor-pointer ${
                      checkoutState.paymentMethod === 'credit-card' 
                        ? 'border-2' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ borderColor: checkoutState.paymentMethod === 'credit-card' ? primaryColor : undefined }}
                    onClick={() => updateCheckoutField('paymentMethod', 'credit-card')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div 
                    className={`p-3 border rounded-md cursor-pointer ${
                      checkoutState.paymentMethod === 'paypal' 
                        ? 'border-2' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ borderColor: checkoutState.paymentMethod === 'paypal' ? primaryColor : undefined }}
                    onClick={() => updateCheckoutField('paymentMethod', 'paypal')}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 5.25H4.5C3.675 5.25 3 5.925 3 6.75V17.25C3 18.075 3.675 18.75 4.5 18.75H19.5C20.325 18.75 21 18.075 21 17.25V6.75C21 5.925 20.325 5.25 19.5 5.25Z" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.5 14.25C8.32843 14.25 9 13.5784 9 12.75C9 11.9216 8.32843 11.25 7.5 11.25C6.67157 11.25 6 11.9216 6 12.75C6 13.5784 6.67157 14.25 7.5 14.25Z" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.5 14.25C17.3284 14.25 18 13.5784 18 12.75C18 11.9216 17.3284 11.25 16.5 11.25C15.6716 11.25 15 11.9216 15 12.75C15 13.5784 15.6716 14.25 16.5 14.25Z" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11.25V14.25" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.75 12.75H14.25" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div 
                    className={`p-3 border rounded-md cursor-pointer ${
                      checkoutState.paymentMethod === 'apple-pay' 
                        ? 'border-2' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ borderColor: checkoutState.paymentMethod === 'apple-pay' ? primaryColor : undefined }}
                    onClick={() => updateCheckoutField('paymentMethod', 'apple-pay')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div 
                    className={`p-3 border rounded-md cursor-pointer ${
                      checkoutState.paymentMethod === 'crypto' 
                        ? 'border-2' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ borderColor: checkoutState.paymentMethod === 'crypto' ? primaryColor : undefined }}
                    onClick={() => updateCheckoutField('paymentMethod', 'crypto')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                {checkoutState.paymentMethod === 'credit-card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={checkoutState.cardNumber}
                        onChange={(e) => updateCheckoutField('cardNumber', e.target.value)}
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={checkoutState.cardExpiry}
                          onChange={(e) => updateCheckoutField('cardExpiry', e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVC</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={checkoutState.cardCvc}
                          onChange={(e) => updateCheckoutField('cardCvc', e.target.value)}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {checkoutState.paymentMethod === 'paypal' && (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    <p className="mb-2">You will be redirected to PayPal to complete your payment.</p>
                    <p className="text-sm text-gray-500">Click "Complete Order" to continue.</p>
                  </div>
                )}
                
                {checkoutState.paymentMethod === 'apple-pay' && (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    <p className="mb-2">You will complete your payment using Apple Pay.</p>
                    <p className="text-sm text-gray-500">Click "Complete Order" to continue.</p>
                  </div>
                )}
                
                {checkoutState.paymentMethod === 'crypto' && (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    <p className="mb-2">You will be redirected to complete your payment using cryptocurrency.</p>
                    <p className="text-sm text-gray-500">Click "Complete Order" to continue.</p>
                  </div>
                )}
                
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h5 className="font-medium mb-2">Order Summary</h5>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
                    <span>${calculateCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span style={{ color: primaryColor }}>${calculateCartTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex gap-4">
          {checkoutState.step > 1 && (
            <button 
              className="flex-1 p-3 rounded-lg border border-gray-300 font-medium"
              onClick={prevCheckoutStep}
            >
              Back
            </button>
          )}
          
          {checkoutState.step < 3 ? (
            <button 
              className="flex-1 p-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: primaryColor }}
              onClick={nextCheckoutStep}
            >
              Continue to {checkoutState.step === 1 ? 'Shipping' : 'Payment'}
            </button>
          ) : (
            <button 
              className="flex-1 p-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: primaryColor }}
              onClick={completeOrder}
            >
              Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal; 