
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CartTable = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  
  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="font-playfair text-2xl mb-4">Your Cart is Empty</h2>
        <p className="text-darkGray mb-8">Add some beautiful handmade items to your cart!</p>
        <Link to="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="text-left py-4 px-2 font-medium">Product</th>
            <th className="text-left py-4 px-2 font-medium">Price</th>
            <th className="text-left py-4 px-2 font-medium">Quantity</th>
            <th className="text-left py-4 px-2 font-medium">Total</th>
            <th className="py-4 px-2 font-medium"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cart.map((item) => (
            <tr key={`${item.productId}-${item.fabricCode}`} className="hover:bg-gray-50">
              <td className="py-4 px-2">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-darkGray">Fabric: {item.fabricLabel}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-2">${item.price.toFixed(2)}</td>
              <td className="py-4 px-2">
                <div className="flex items-center border rounded-md max-w-[120px]">
                  <button
                    className="px-3 py-1 border-r text-lg"
                    onClick={() => updateQuantity(item.productId, item.fabricCode, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <div className="px-4 py-1 text-center flex-grow">{item.quantity}</div>
                  <button
                    className="px-3 py-1 border-l text-lg"
                    onClick={() => updateQuantity(item.productId, item.fabricCode, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-4 px-2 font-medium">${(item.price * item.quantity).toFixed(2)}</td>
              <td className="py-4 px-2 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.productId, item.fabricCode)}
                  className="text-darkGray hover:text-red-500 hover:bg-transparent"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200">
            <td colSpan={3} className="py-4 px-2 text-right font-medium">Subtotal</td>
            <td className="py-4 px-2 font-medium">${cartTotal().toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CartTable;
