// Font options for the demo
export const fontOptions = [
  { 
    name: "Modern", 
    fontFamily: "Raleway, sans-serif", 
    description: "Clean and contemporary",
    previewText: "Aa Bb Cc 123"
  },
  { 
    name: "Classic", 
    fontFamily: "Georgia, serif", 
    description: "Timeless and readable",
    previewText: "Aa Bb Cc 123" 
  },
  { 
    name: "Elegant", 
    fontFamily: "Playfair Display, serif", 
    description: "Sophisticated and refined",
    previewText: "Aa Bb Cc 123" 
  },
  { 
    name: "Playful", 
    fontFamily: "Poppins, sans-serif", 
    description: "Fun and energetic",
    previewText: "Aa Bb Cc 123" 
  },
  { 
    name: "Bold", 
    fontFamily: "Montserrat, sans-serif", 
    description: "Strong and impactful",
    previewText: "Aa Bb Cc 123" 
  },
  { 
    name: "Minimal", 
    fontFamily: "Inter, sans-serif", 
    description: "Simple and clean",
    previewText: "Aa Bb Cc 123" 
  }
];

// Store customization moods
export const storeMoods = [
  { id: "minimalist", name: "Minimalist", description: "Clean and simple design with focus on products", color: "#27272A", secondaryColor: "#71717A", accentColor: "#3B82F6", bgColor: "#FAFAFA", icon: "geometric" },
  { id: "bold", name: "Bold", description: "Eye-catching colors and dynamic elements", color: "#DC2626", secondaryColor: "#FBBF24", accentColor: "#2563EB", bgColor: "#FFFFFF", icon: "dynamic" },
  { id: "elegant", name: "Elegant", description: "Sophisticated design with refined typography", color: "#7E22CE", secondaryColor: "#E879F9", accentColor: "#F59E0B", bgColor: "#FAF5FF", icon: "luxury" },
  { id: "playful", name: "Playful", description: "Fun and energetic design with creative elements", color: "#06B6D4", secondaryColor: "#F97316", accentColor: "#8B5CF6", bgColor: "#ECFEFF", icon: "creative" },
  { id: "modern", name: "Modern", description: "Clean contemporary design with vibrant accents", color: "#10B981", secondaryColor: "#6366F1", accentColor: "#F43F5E", bgColor: "#F0FDF4", icon: "minimal" },
  { id: "vintage", name: "Vintage", description: "Retro aesthetics with nostalgic elements", color: "#A16207", secondaryColor: "#D97706", accentColor: "#92400E", bgColor: "#FFFBEB", icon: "retro" },
];

// Helpers for color selection
export const getSliderPosition = (color: string) => {
  const colors = [
    "#9333EA", "#A855F7", "#D946EF", "#EC4899", "#F43F5E", 
    "#F59E0B", "#FBBF24", "#A16207"
  ];
  const index = colors.findIndex(c => c.toLowerCase() === color.toLowerCase());
  if (index === -1) return 50; // default to middle if color not found
  return (index / (colors.length - 1)) * 100;
};

// Sample function to toggle preview
export const togglePreview = (currentState: boolean, setShowPreview: (state: boolean) => void) => {
  setShowPreview(!currentState);
  localStorage.setItem('demo-show-preview', String(!currentState));
};

// Helper functions for products and categories
export const editProduct = (
  product: any,
  setEditingProduct: (product: any) => void,
  setProductName: (name: string) => void,
  setProductDescription: (desc: string) => void,
  setProductCategory: (category: string) => void,
  setProductPrice: (price: string) => void,
  setComparePrice: (price: string) => void,
  setInventory: (inventory: string) => void,
  setProductImage: (image: string) => void,
  setSelectedSizes: (sizes: string[]) => void,
  setSelectedColors: (colors: any[]) => void
) => {
  setEditingProduct(product);
  setProductName(product.name);
  setProductDescription(product.description);
  setProductCategory(product.category);
  setProductPrice(product.price);
  setComparePrice(product.comparePrice || "");
  setInventory(product.inventory);
  setProductImage(product.image);
  setSelectedSizes([...product.sizes]);
  setSelectedColors([...product.colors]);
};

export const editCategory = (
  cat: any,
  setCategory: (category: any) => void,
  setCategoryName: (name: string) => void,
  setCategoryDescription: (desc: string) => void,
  setShowCategoryDialog: (show: boolean) => void
) => {
  setCategory(cat);
  setCategoryName(cat.name);
  setCategoryDescription(cat.description);
  setShowCategoryDialog(true);
};

export const deleteCategory = (
  categoryId: string,
  categories: any[],
  setCategories: (categories: any[]) => void
) => {
  if (confirm("Are you sure you want to delete this category?")) {
    setCategories(categories.filter(c => c.id !== categoryId));
  }
};

// Logo handling
export const handleLogoUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  setLogoFile: (file: File | null) => void,
  setLogoImage: (image: string) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLogoImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }
}; 