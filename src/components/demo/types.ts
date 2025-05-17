import { Product, ProductColor, CartItem } from './CartModal';
import { CheckoutState } from './CheckoutModal';

// Additional types for demo components
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export type { 
  Product, 
  ProductColor, 
  CartItem, 
  CheckoutState 
}; 