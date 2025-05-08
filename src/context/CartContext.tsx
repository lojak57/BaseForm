
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";

export type Fabric = {
  code: string;
  label: string;
  upcharge: number;
  swatch: string;
  imgOverride?: string[];
};

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  defaultImages: string[];
  fabrics: Fabric[];
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  fabricCode: string;
  fabricLabel: string;
  image: string;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, fabricCode: string) => void;
  removeFromCart: (productId: string, fabricCode: string) => void;
  updateQuantity: (productId: string, fabricCode: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("vcsews-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vcsews-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, fabricCode: string) => {
    setCart((prevCart) => {
      // Find the selected fabric
      const selectedFabric = product.fabrics.find((f) => f.code === fabricCode);
      if (!selectedFabric) return prevCart;

      // Calculate price with fabric upcharge
      const finalPrice = product.price + selectedFabric.upcharge;

      // Determine image to use
      const image = selectedFabric.imgOverride?.[0] || product.defaultImages[0];

      // Check if the item with the same product ID and fabric is already in the cart
      const existingItemIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.fabricCode === fabricCode
      );

      if (existingItemIndex > -1) {
        // Item exists, update the quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        toast.success("Item quantity updated in your cart");
        return newCart;
      } else {
        // Item doesn't exist, add it
        toast.success("Item added to your cart");
        return [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: finalPrice,
            quantity,
            fabricCode: selectedFabric.code,
            fabricLabel: selectedFabric.label,
            image
          }
        ];
      }
    });
  };

  const removeFromCart = (productId: string, fabricCode: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter(
        (item) => !(item.productId === productId && item.fabricCode === fabricCode)
      );
      if (newCart.length < prevCart.length) {
        toast.info("Item removed from cart");
      }
      return newCart;
    });
  };

  const updateQuantity = (productId: string, fabricCode: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter(
          (item) => !(item.productId === productId && item.fabricCode === fabricCode)
        );
      }

      return prevCart.map((item) => {
        if (item.productId === productId && item.fabricCode === fabricCode) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Cart has been cleared");
  };

  const cartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const cartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
