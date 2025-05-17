import { ShoppingCart } from "lucide-react";
import { generatePlaceholderImage } from "@/lib/utils";

// Types
export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  comparePrice?: string;
  inventory: string;
  image: string;
  imageId?: string;
  sizes: string[];
  colors: ProductColor[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: ProductColor;
}

interface CartModalProps {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  cartItems: CartItem[];
  primaryColor: string;
  removeFromCart: (index: number) => void;
  updateCartItemQuantity: (index: number, newQuantity: number) => void;
  calculateCartTotal: () => string;
  proceedToCheckout: () => void;
  setSelectedPreviewProduct: (product: Product | null) => void;
  generatePlaceholderImage: (text: string, bgColor?: string, textColor?: string) => string;
}

const CartModal = ({
  showCart,
  setShowCart,
  cartItems,
  primaryColor,
  removeFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  proceedToCheckout,
  setSelectedPreviewProduct,
  generatePlaceholderImage
}: CartModalProps) => {
  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
          </h3>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => setShowCart(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Your cart is empty</p>
              <button 
                className="mt-4 text-sm text-primary font-medium"
                style={{ color: primaryColor }}
                onClick={() => {
                  setShowCart(false);
                  setSelectedPreviewProduct(null);
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 py-4 border-b">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image || generatePlaceholderImage(item.product.name)} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <button 
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => removeFromCart(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span 
                          className="inline-block w-3 h-3 rounded-full mr-1"
                          style={{ backgroundColor: item.color.hex }}
                        ></span>
                        {item.color.name} / Size: {item.size}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button 
                            className="w-8 h-8 flex items-center justify-center bg-gray-100"
                            onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center bg-gray-100"
                            onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="font-medium" style={{ color: primaryColor }}>
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateCartTotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-lg font-bold" style={{ color: primaryColor }}>
                    ${calculateCartTotal()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-4 border-t flex gap-3">
            <button 
              className="flex-1 p-3 rounded-lg border border-gray-300 font-medium"
              onClick={() => setShowCart(false)}
            >
              Continue Shopping
            </button>
            <button 
              className="flex-1 p-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: primaryColor }}
              onClick={proceedToCheckout}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal; 