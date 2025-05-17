import { Check } from "lucide-react";
import { CartItem } from "./CartModal";

interface OrderCompleteModalProps {
  orderComplete: boolean;
  primaryColor: string;
  secondaryColor: string;
  cartItems: CartItem[];
  calculateCartTotal: () => string;
  continueShopping: () => void;
}

const OrderCompleteModal = ({
  orderComplete,
  primaryColor,
  secondaryColor,
  cartItems,
  calculateCartTotal,
  continueShopping
}: OrderCompleteModalProps) => {
  if (!orderComplete) return null;

  const orderNumber = `WL${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-10 flex flex-col items-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Check className="h-8 w-8" style={{ color: primaryColor }} />
          </div>
          
          <h3 className="text-2xl font-medium mb-2 text-center">Order Confirmed!</h3>
          <p className="text-gray-500 mb-6 text-center">
            Thank you for your purchase. Your order has been received.
          </p>
          
          <div className="w-full bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Items:</span>
              <span className="font-medium">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium" style={{ color: primaryColor }}>${calculateCartTotal()}</span>
            </div>
          </div>
          
          <div className="w-full">
            <button 
              className="w-full p-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: primaryColor }}
              onClick={continueShopping}
            >
              Continue Shopping
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="w-full relative mt-8 pt-8 border-t border-gray-100">
            <div className="absolute top-0 left-1/4 w-32 h-1 rounded-full -translate-y-1/2" style={{ backgroundColor: `${secondaryColor}30` }}></div>
            <div className="absolute top-0 right-1/4 w-16 h-1 rounded-full -translate-y-1/2" style={{ backgroundColor: `${primaryColor}30` }}></div>
            
            <div className="text-center text-sm text-gray-500">
              <p>A confirmation email has been sent to your email address.</p>
              <p className="mt-1">You can track your order in your account dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompleteModal; 