// DEPRECATED - Using database products instead
// This file is kept for reference but no longer used in the application

import { Product } from "@/context/CartContext";

// No-op placeholder functions to avoid breaking imports before refactoring
export const getProductById = (_id: string): Product | undefined => undefined;
export const getProductsByCategory = (_categoryId: string): Product[] => [];
export const getProductBySlug = (_slug: string): Product | undefined => undefined;
export const products: Product[] = [];

export const categories = [
  {
    id: "crossbody",
    slug: "crossbody",
    name: "Crossbody Bags",
    description: "Perfect hands-free option for everyday adventures.",
    image: "/images/categories/crossbody.jpg"
  },
  {
    id: "tote",
    slug: "tote",
    name: "Tote Bags",
    description: "Spacious and stylish totes for work and travel.",
    image: "/images/categories/tote.jpg"
  },
  {
    id: "clutch",
    slug: "clutch",
    name: "Clutch Purses",
    description: "Elegant clutches for special occasions.",
    image: "/images/categories/clutch.jpg"
  },
  {
    id: "backpack",
    slug: "backpack",
    name: "Mini Backpacks",
    description: "Cute and functional mini backpacks for daily use.",
    image: "/images/categories/backpack.jpg"
  }
];

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string) => {
  return categories.find(category => category.slug === slug);
};
