// Category definitions for the site
export const categories = [
  {
    id: "purses",
    slug: "purses",
    name: "Purses",
    description: "Elegant purses for every style and occasion.",
    image: "/images/categories/purses.jpg"
  },
  {
    id: "bags",
    slug: "bags",
    name: "Bags",
    description: "Versatile bags for everyday use and special occasions.",
    image: "/images/categories/bags.jpg"
  },
  {
    id: "wallets",
    slug: "wallets",
    name: "Wallets",
    description: "Stylish and functional wallets to keep your essentials organized.",
    image: "/images/categories/wallets.jpg"
  },
  {
    id: "other",
    slug: "other-products",
    name: "Other Products",
    description: "Explore our collection of specialty items and accessories.",
    image: "/images/categories/other.jpg"
  }
];

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string) => {
  return categories.find(category => category.slug === slug);
};

// Helper function to get category by ID
export const getCategoryById = (id: string) => {
  return categories.find(category => category.id === id);
}; 