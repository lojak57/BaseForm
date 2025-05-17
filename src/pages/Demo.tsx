import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Plus, 
  Image, 
  Sparkles,
  CreditCard,
  DollarSign,
  Palette,
  Layout as LayoutIcon,
  Paintbrush,
  Layers,
  Compass,
  Search,
  User,
  ShoppingCart,
  Upload,
  Save,
  AlertCircle,
  Package,
  Calendar
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { categories as defaultCategories } from "@/data/categories";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { HexColorPicker } from "react-colorful";
import { useWindowSize } from "react-use";
import { storeImage, getImage, cleanupOldImages } from "@/lib/indexedDB";
import { setWithExpiry, getWithExpiry, cleanupExpiredItems } from "@/lib/storage";
import { 
  CartModal, 
  CheckoutModal, 
  OrderCompleteModal, 
  ProductDetail,
  type Product, 
  type ProductColor, 
  type CartItem,
  type CheckoutState,
  type Category
} from "@/components/demo";
import { generatePlaceholderImage } from "@/lib/utils";
import { 
  fontOptions,
  storeMoods,
  getSliderPosition,
  togglePreview as togglePreviewHelper,
  editProduct as editProductHelper,
  editCategory as editCategoryHelper,
  deleteCategory as deleteCategoryHelper,
  handleLogoUpload as handleLogoUploadHelper
} from "@/components/demo/helpers";
import ServiceOfferings, { Service, ServiceType } from "@/components/demo/ServiceOfferings";

// Local storage keys with TTL constants
const DEMO_STATE_KEY = 'webshop-demo-state';
const DEMO_STATE_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days
const DEMO_SCROLL_KEY = 'webshop-demo-scroll';

const Demo = () => {
  // For color picker debouncing
  const colorTimeoutRef = useRef<number | null>(null);
  const scrollPositionRef = useRef<Record<number, number>>({});
  const { width } = useWindowSize();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Clean up expired localStorage items and old images on component mount
    cleanupExpiredItems();
    cleanupOldImages();
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Interactive states for the demo
  const [storeName, setStoreName] = useState("Fashion Boutique");
  const [storeUrl, setStoreUrl] = useState("fashion-boutique");
  const [businessType, setBusinessType] = useState("Clothing & Apparel");
  const [currency, setCurrency] = useState("USD ($)");
  
  // Products state - will store actual products
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [productName, setProductName] = useState("Premium Denim Jacket");
  const [productDescription, setProductDescription] = useState("High-quality denim jacket with custom embroidery. Perfect for any casual outfit. Features premium stitching and durable materials that will last for years.");
  const [productCategory, setProductCategory] = useState("Outerwear");
  const [productPrice, setProductPrice] = useState("129.99");
  const [comparePrice, setComparePrice] = useState("159.99");
  const [inventory, setInventory] = useState("25");
  
  const [productImage, setProductImage] = useState("/placeholder-images/placeholder.jpg");
  const [hoveredSize, setHoveredSize] = useState("");
  const [hoveredColor, setHoveredColor] = useState("");
  const [selectedSizes, setSelectedSizes] = useState(["S", "M", "L", "XL"]);
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([
    { name: "Blue", hex: "#3B82F6" },
    { name: "Black", hex: "#000000" },
    { name: "Gray", hex: "#6B7280" }
  ]);
  
  // Category state
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  
  // Customization states
  const [logoImage, setLogoImage] = useState("/placeholder-images/logo-placeholder.png");
  const [logoImageId, setLogoImageId] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#0d3b66");
  const [tempPrimaryColor, setTempPrimaryColor] = useState("#0d3b66"); // For debounced color picker
  const [secondaryColor, setSecondaryColor] = useState("#18a77e");
  const [tempSecondaryColor, setTempSecondaryColor] = useState("#18a77e"); // For debounced color picker
  const [accentColor, setAccentColor] = useState("#18a77e");
  const [tempAccentColor, setTempAccentColor] = useState("#18a77e"); // For debounced color picker
  const [selectedFont, setSelectedFont] = useState("Modern");
  const [selectedMood, setSelectedMood] = useState("Minimalist");
  const [layoutStyle, setLayoutStyle] = useState("Standard");
  
  // File upload states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Conversion dialog
  const [showConversionDialog, setShowConversionDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  // Full preview state
  const [showPreview, setShowPreview] = useState(false);
  const [fullPreviewMode, setFullPreviewMode] = useState(false);
  
  // Add a new state variable to track category selection
  const [categorySelectionComplete, setCategorySelectionComplete] = useState(false);
  
  // Add selectedPreviewProduct state
  const [selectedPreviewProduct, setSelectedPreviewProduct] = useState<Product | null>(null);
  
  // Cart states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 1,
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
    paymentMethod: "credit-card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: ""
  });
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Add state for services
  const [services, setServices] = useState<Service[]>([]);
  
  // Function to handle product click in preview
  const handlePreviewProductClick = (product: Product) => {
    setSelectedPreviewProduct(product);
    // Reset selection when viewing a product
    setSelectedSize("");
    setSelectedColor(null);
  };
  
  // Function to handle back to products
  const handleBackToProducts = () => {
    setSelectedPreviewProduct(null);
  };
  
  // Save current scroll position
  const saveCurrentScrollPosition = () => {
    scrollPositionRef.current[currentStep] = window.scrollY;
    localStorage.setItem(DEMO_SCROLL_KEY, JSON.stringify(scrollPositionRef.current));
  };
  
  // Restore scroll position for a step
  const restoreScrollPosition = (step: number) => {
    const savedPositions = localStorage.getItem(DEMO_SCROLL_KEY);
    if (savedPositions) {
      const positions = JSON.parse(savedPositions);
      scrollPositionRef.current = positions;
      
      if (positions[step]) {
        setTimeout(() => {
          window.scrollTo(0, positions[step]);
        }, 100);
      }
    }
  };
  
  // Generate placeholder image function
  const genPlaceholderImage = (text: string, bgColor: string = primaryColor, textColor: string = 'FFFFFF') => {
    return generatePlaceholderImage(text, bgColor, textColor);
  };
  
  // Handle next step with state saving
  const nextStep = () => {
    if (currentStep < totalSteps) {
      saveCurrentScrollPosition();
      saveCurrentState();
      
      // For the first step, ensure some products exist
      if (currentStep === 1 && products.length === 0) {
        // Add a default product
        const newProduct: Product = {
          id: Date.now().toString(),
          name: productName,
          description: productDescription,
          category: productCategory,
          price: productPrice,
          comparePrice: comparePrice,
          inventory: inventory,
          image: productImage,
          sizes: [...selectedSizes],
          colors: [...selectedColors]
        };
        setProducts([newProduct]);
      }
      
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      restoreScrollPosition(newStep);
      
      // Maintain the preview setting when changing steps
      if (localStorage.getItem('demo-show-preview')) {
        setShowPreview(true);
      }
    }
  };
  
  // Handle previous step
  const prevStep = () => {
    if (currentStep > 1) {
      saveCurrentScrollPosition();
      saveCurrentState();
      
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      restoreScrollPosition(newStep);
      
      // Maintain the preview setting when changing steps
      if (localStorage.getItem('demo-show-preview')) {
        setShowPreview(true);
      }
    }
  };
  
  // Save the current state of the demo to localStorage with TTL
  const saveCurrentState = () => {
    // ... rest of the saveCurrentState function
  };
  
  // ... other functions from the existing demo component
  
  // Toggle store preview
  const togglePreview = () => {
    togglePreviewHelper(showPreview, setShowPreview);
  };
  
  // Toggle full preview mode
  const toggleFullPreview = () => {
    setFullPreviewMode(!fullPreviewMode);
    setShowPreview(true);
    localStorage.setItem('demo-show-preview', 'true');
  };
  
  // Wrapper functions for the helper functions
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleLogoUploadHelper(e, setLogoFile, setLogoImage);
  };
  
  const editCategory = (cat: Category) => {
    editCategoryHelper(cat, setCategory, setCategoryName, setCategoryDescription, setShowCategoryDialog);
  };
  
  const deleteCategory = (categoryId: string) => {
    deleteCategoryHelper(categoryId, categories, setCategories);
  };
  
  // Add or edit a category
  const saveCategory = () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }
    
    if (categories.length >= 1 && !category) {
      alert("You can only add 1 category in the demo");
      return;
    }
    
    const slug = categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const categoryToSave: Category = {
      id: category?.id || Date.now().toString(),
      slug,
      name: categoryName,
      description: categoryDescription
    };
    
    if (category) {
      // Update existing category
      setCategories(categories.map(c => c.id === category.id ? categoryToSave : c));
      setCategory(null);
    } else {
      // Add new category
      setCategories([...categories, categoryToSave]);
    }
    
    setCategoryName("");
    setCategoryDescription("");
    setShowCategoryDialog(false);
    
    // After saving a category, mark the category selection as complete
    // and update the product category field automatically
    setCategorySelectionComplete(true);
    if (categories.length === 0) {
      setProductCategory(categoryToSave.name);
    }
  };
  
  // Handle conversion to real store
  const convertToRealStore = () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Save all settings to localStorage for account creation
    const demoState = {
      storeName,
      storeUrl,
      businessType,
      currency,
      products,
      categories,
      logoImage,
      primaryColor,
      secondaryColor,
      accentColor,
      selectedFont,
      selectedMood,
      layoutStyle,
      email
    };
    
    localStorage.setItem('webshop-conversion', JSON.stringify(demoState));
    
    // Here you would normally create the account and store
    // For demo purposes we'll redirect to signup with data prefilled
    window.location.href = `/signup?demo=true`;
  };
  
  // This function is a simplified placeholder for the original functionality
  const deleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };
  
  // Reset the product form
  const resetProductForm = () => {
    setProductName("");
    setProductDescription("");
    setProductCategory(categories.length > 0 ? categories[0].name : "Outerwear");
    setProductPrice("");
    setComparePrice("");
    setInventory("0");
    setProductImage("/placeholder-images/placeholder.jpg");
    setSelectedSizes(["S", "M", "L", "XL"]);
    setSelectedColors([
      { name: "Blue", hex: "#3B82F6" },
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#6B7280" }
    ]);
    setProductImageFile(null);
  };
  
  // Size management functions
  const removeSize = (size: string) => {
    setSelectedSizes(selectedSizes.filter(s => s !== size));
  };
  
  const addSize = () => {
    const newSize = prompt("Enter size (e.g., XXL):");
    if (newSize && !selectedSizes.includes(newSize)) {
      setSelectedSizes([...selectedSizes, newSize]);
    }
  };
  
  // Color management functions
  const removeColor = (colorName: string) => {
    setSelectedColors(selectedColors.filter(c => c.name !== colorName));
  };
  
  const addColor = () => {
    const newColorName = prompt("Enter color name:");
    const newColorHex = prompt("Enter color hex code (e.g., #FF0000 for red):");
    if (newColorName && newColorHex && !selectedColors.find(c => c.name === newColorName)) {
      setSelectedColors([...selectedColors, { name: newColorName, hex: newColorHex }]);
    }
  };
  
  // Basic implementation of saveProduct
  const saveProduct = () => {
    if (!productName.trim()) {
      alert("Please enter a product name");
      return;
    }
    
    const productToSave: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: productName,
      description: productDescription,
      category: productCategory,
      price: productPrice,
      comparePrice: comparePrice || undefined,
      inventory: inventory,
      image: productImage,
      sizes: [...selectedSizes],
      colors: [...selectedColors]
    };
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === editingProduct.id ? productToSave : p));
      setEditingProduct(null);
    } else {
      // Add new product
      setProducts([...products, productToSave]);
    }
    
    // Reset form for next product
    resetProductForm();
  };
  
  // Simplified implementation of product image upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImageFile(file);
      setIsUploading(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Read the file as a data URL
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setProductImage(e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      }, 200);
    }
  };
  
  // Add a wrapper for editProduct
  const editProduct = (product: Product) => {
    editProductHelper(
      product, 
      setEditingProduct, 
      setProductName, 
      setProductDescription, 
      setProductCategory, 
      setProductPrice, 
      setComparePrice, 
      setInventory, 
      setProductImage, 
      setSelectedSizes, 
      setSelectedColors
    );
  };
  
  // Add to cart functionality
  const addToCart = () => {
    if (!selectedPreviewProduct) return;
    
    // Validate selection
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    if (selectedPreviewProduct.colors.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }
    
    // Create cart item
    const newItem: CartItem = {
      product: selectedPreviewProduct,
      quantity: 1,
      size: selectedSize,
      color: selectedColor || selectedPreviewProduct.colors[0] // Fallback if no color selection needed
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      item => 
        item.product.id === newItem.product.id && 
        item.size === newItem.size && 
        item.color.name === newItem.color.name
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, newItem]);
    }
    
    // Show confirmation and open cart
    setShowCart(true);
  };
  
  // Remove item from cart
  const removeFromCart = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
  };
  
  // Update quantity of item in cart
  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
  };
  
  // Calculate total price of items in cart
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0).toFixed(2);
  };
  
  // Handle checkout process
  const proceedToCheckout = () => {
    setShowCheckout(true);
    setShowCart(false);
  };
  
  // Go back from checkout to cart
  const backToCart = () => {
    setShowCheckout(false);
    setShowCart(true);
  };
  
  // Update checkout field
  const updateCheckoutField = (field: keyof CheckoutState, value: string) => {
    setCheckoutState({
      ...checkoutState,
      [field]: value
    });
  };
  
  // Go to next checkout step
  const nextCheckoutStep = () => {
    setCheckoutState({
      ...checkoutState,
      step: checkoutState.step + 1
    });
  };
  
  // Go to previous checkout step
  const prevCheckoutStep = () => {
    setCheckoutState({
      ...checkoutState,
      step: checkoutState.step - 1
    });
  };
  
  // Complete order
  const completeOrder = () => {
    setOrderComplete(true);
    setShowCheckout(false);
    // Clear cart after successful order
    setTimeout(() => {
      setCartItems([]);
    }, 500);
  };
  
  // Close order complete screen and continue shopping
  const continueShopping = () => {
    setOrderComplete(false);
    setSelectedPreviewProduct(null);
  };
  
  // Add service management functions
  const addService = (service: Service) => {
    setServices([...services, service]);
  };
  
  const editService = (id: string, updatedService: Service) => {
    setServices(services.map(service => 
      service.id === id ? updatedService : service
    ));
  };
  
  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <Layout>
      <div className="py-16 bg-gradient-to-r from-[#0d3b66]/5 to-[#0d3b66]/10">
        <div className="container mx-auto px-4">
          <Reveal animation="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                See How BaseForm Works
              </h1>
              <p className="text-lg text-darkText/70 mb-8">
                Follow this interactive demo to explore how easy it is to set up and manage your online store.
              </p>
            </div>
          </Reveal>

          <div className="max-w-5xl mx-auto mt-12">
            {/* Progress Steps */}
            <div className="mb-16">
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium transition-all ${
                      step === currentStep
                        ? "bg-[#18a77e] text-white shadow-lg"
                        : step < currentStep
                        ? "bg-[#18a77e]/80 text-white"
                        : "bg-white text-darkText border border-gray-200"
                    }`}
                  >
                    {step < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-sm font-medium">
                <div className="text-center">Store Setup</div>
                <div className="text-center">Customize Store</div>
                <div className="text-center">Add Products</div>
                <div className="text-center">Add Services</div>
                <div className="text-center">Go Live</div>
              </div>
            </div>
            
            {/* Preview Toggle Button */}
            <div className="text-right mb-4">
              <Button 
                variant={showPreview ? "default" : "outline"} 
                onClick={togglePreview}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
            
            <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-2' : ''} gap-6`}>
              {/* Step Content */}
              <div className="bg-white rounded-xl shadow-lg p-8 relative">
                {/* Step 1: Store Setup */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">1. Set Up Your Store</h2>
                    <p className="text-darkText/70">
                      Getting started is simple. Fill in your basic store information and you're ready to go.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                      <div>
                        <label className="block text-sm font-medium mb-2">Store Name</label>
                        <input 
                          type="text" 
                          placeholder="My Awesome Store" 
                          className="w-full p-3 border border-gray-200 rounded-md"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Business Type</label>
                        <select 
                          className="w-full p-3 border border-gray-200 rounded-md"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                        >
                          <option>Clothing & Apparel</option>
                          <option>Home Goods</option>
                          <option>Electronics</option>
                          <option>Beauty & Cosmetics</option>
                          <option>Food & Beverages</option>
                          <option>Art & Crafts</option>
                          <option>Jewelry & Accessories</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Store URL</label>
                        <div className="flex">
                          <span className="bg-gray-100 px-3 py-3 border border-r-0 border-gray-200 rounded-l-md text-gray-500">
                            https://
                          </span>
                          <input 
                            type="text" 
                            placeholder="mystore" 
                            className="flex-1 p-3 border border-gray-200 rounded-none"
                            value={storeUrl}
                            onChange={(e) => setStoreUrl(e.target.value)}
                          />
                          <span className="bg-gray-100 px-3 py-3 border border-l-0 border-gray-200 rounded-r-md text-gray-500">
                            .webshop.com
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Currency</label>
                        <select 
                          className="w-full p-3 border border-gray-200 rounded-md"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                        >
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                          <option>CAD ($)</option>
                          <option>AUD ($)</option>
                          <option>JPY (¥)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-700 font-medium">Look at how easy this is!</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Your store information is automatically saved as you go. No complex settings or technical knowledge required!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Customize Store */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">2. Customize Your Store</h2>
                    <p className="text-darkText/70">
                      Make your store unique with our easy customization tools. Choose colors, upload your logo, and select a mood that matches your brand.
                    </p>
                    
                    <div className="my-8">
                      <Tabs defaultValue="branding" className="mb-8">
                        <TabsList className="mb-6">
                          <TabsTrigger value="branding">Branding</TabsTrigger>
                          <TabsTrigger value="colors">Colors</TabsTrigger>
                          <TabsTrigger value="mood">Store Mood</TabsTrigger>
                          <TabsTrigger value="layout">Layout</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="branding" className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Store Logo</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                <div className="w-40 h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                                  {logoImage ? (
                                    <img 
                                      src={logoImage} 
                                      alt="Logo" 
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  ) : (
                                    <Image className="w-12 h-12 text-gray-300" />
                                  )}
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label 
                                    htmlFor="logo-upload" 
                                    className="cursor-pointer px-4 py-2 bg-[#0d3b66] text-white rounded-md hover:bg-[#0d3b66]/90 flex items-center justify-center gap-2 text-sm"
                                  >
                                    <Upload className="w-4 h-4" />
                                    Upload Logo
                                    <input 
                                      id="logo-upload"
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden"
                                      onChange={handleLogoUpload}
                                    />
                                  </label>
                                  {logoImage && logoImage !== "/placeholder-images/logo-placeholder.png" && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-500 border-red-200"
                                      onClick={() => setLogoImage("/placeholder-images/logo-placeholder.png")}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Font Style</label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                    {fontOptions.map((font) => (
                                      <div 
                                        key={font.name}
                                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                          selectedFont === font.name
                                            ? 'border-[#18a77e] bg-[#18a77e]/5 ring-1 ring-[#18a77e]'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setSelectedFont(font.name)}
                                      >
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <h3 className="font-medium text-sm">{font.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{font.description}</p>
                                          </div>
                                          {selectedFont === font.name && (
                                            <Check className="text-[#18a77e] w-4 h-4" />
                                          )}
                                        </div>
                                        <div 
                                          className="mt-2 p-2 bg-gray-50 rounded text-center text-lg"
                                          style={{ fontFamily: font.fontFamily }}
                                        >
                                          {font.previewText}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-2">Layout Style</label>
                                  <select 
                                    className="w-full p-3 border border-gray-200 rounded-md"
                                    value={layoutStyle}
                                    onChange={(e) => setLayoutStyle(e.target.value)}
                                  >
                                    <option>Standard</option>
                                    <option>Compact</option>
                                    <option>Spacious</option>
                                    <option>Grid-focused</option>
                                    <option>Storytelling</option>
                                  </select>
                                </div>
                                
                                <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                                  <p className="text-xs text-gray-600">
                                    Your selections are immediately applied to your store preview. Try different combinations to see what looks best!
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="colors" className="space-y-6">
                          <div className="mb-8">
                            <label className="block text-sm font-medium mb-2">Primary Color</label>
                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                              <HexColorPicker color={primaryColor} onChange={setPrimaryColor} className="w-full mb-3" />
                              <div className="flex items-center mt-2">
                                <div 
                                  className="w-12 h-12 rounded-lg mr-3 border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: primaryColor }}
                                ></div>
                                <input 
                                  type="text" 
                                  className="flex-1 p-2 border border-gray-200 rounded-md"
                                  value={primaryColor}
                                  onChange={(e) => setPrimaryColor(e.target.value)}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Used for buttons and primary elements
                            </p>
                          </div>
                          
                          <div className="mb-8">
                            <label className="block text-sm font-medium mb-2">Secondary Color</label>
                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                              <div className="flex flex-wrap gap-2 mb-3">
                                {[
                                  "#F59E0B", "#2563EB", "#6366F1", "#EC4899", "#10B981", 
                                  "#64748B", "#9333EA", "#16A34A", "#DC2626", "#475569"
                                ].map(color => (
                                  <button
                                    key={color}
                                    className="w-10 h-10 rounded-lg border border-gray-200 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#18a77e]"
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSecondaryColor(color)}
                                    aria-label={`Select color ${color}`}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center mt-2">
                                <div 
                                  className="w-12 h-12 rounded-lg mr-3 border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: secondaryColor }}
                                ></div>
                                <input 
                                  type="text" 
                                  className="flex-1 p-2 border border-gray-200 rounded-md"
                                  value={secondaryColor}
                                  onChange={(e) => setSecondaryColor(e.target.value)}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Used for highlights and secondary elements
                            </p>
                          </div>
                          
                          <div className="mb-8">
                            <label className="block text-sm font-medium mb-2">Accent Color</label>
                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                              <div className="h-8 w-full rounded-lg mb-3 relative overflow-hidden bg-gradient-to-r from-purple-600 via-red-500 to-yellow-500">
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    // Generate color based on slider position
                                    const pos = parseInt(e.target.value);
                                    const colors = [
                                      "#9333EA", "#A855F7", "#D946EF", "#EC4899", "#F43F5E", 
                                      "#F59E0B", "#FBBF24", "#A16207"
                                    ];
                                    const index = Math.floor((pos / 100) * (colors.length - 1));
                                    setAccentColor(colors[index]);
                                  }}
                                />
                                <div 
                                  className="absolute top-0 h-full w-3 border-2 border-white shadow-lg rounded-full transform -translate-x-1/2 pointer-events-none"
                                  style={{ left: `${getSliderPosition(accentColor)}%`, backgroundColor: accentColor }}
                                ></div>
                              </div>
                              <div className="flex items-center mt-2">
                                <div 
                                  className="w-12 h-12 rounded-lg mr-3 border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: accentColor }}
                                ></div>
                                <input 
                                  type="text" 
                                  className="flex-1 p-2 border border-gray-200 rounded-md"
                                  value={accentColor}
                                  onChange={(e) => setAccentColor(e.target.value)}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Used for accents and call-to-actions
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                            <h3 className="font-medium mb-3">Color Preview</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div 
                                className="p-4 rounded-lg flex items-center justify-center" 
                                style={{ backgroundColor: primaryColor }}
                              >
                                <button 
                                  className="px-4 py-2 rounded bg-white font-medium text-center"
                                  style={{ color: primaryColor }}
                                >
                                  Primary Button
                                </button>
                              </div>
                              <div 
                                className="p-4 rounded-lg flex items-center justify-center" 
                                style={{ backgroundColor: secondaryColor }}
                              >
                                <button 
                                  className="px-4 py-2 rounded bg-white font-medium text-center"
                                  style={{ color: secondaryColor }}
                                >
                                  Secondary Button
                                </button>
                              </div>
                              <div 
                                className="p-4 rounded-lg col-span-1 sm:col-span-2 text-center"
                                style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                              >
                                <span className="text-white font-medium">Gradient Background</span>
                              </div>
                              <div 
                                className="p-4 rounded-lg bg-white border border-gray-200 col-span-1 sm:col-span-2 flex justify-between items-center"
                              >
                                <span style={{ color: primaryColor }} className="font-bold">Primary Text</span>
                                <span style={{ color: secondaryColor }} className="font-medium">Secondary Text</span>
                                <button 
                                  className="px-3 py-1.5 rounded text-white text-sm" 
                                  style={{ backgroundColor: accentColor }}
                                >
                                  Accent Button
                                </button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="mood" className="space-y-6">
                          <p className="text-sm text-gray-600 mb-4">
                            Choose a mood that best represents your brand. Each mood comes with pre-configured colors, fonts, and styling that work perfectly together.
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {storeMoods.slice(0, 6).map((mood) => (
                              <div 
                                key={mood.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                  selectedMood === mood.name
                                    ? 'border-[#18a77e] bg-[#18a77e]/5 ring-1 ring-[#18a77e]'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedMood(mood.name)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start">
                                    <div 
                                      className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                                      style={{ backgroundColor: mood.color }}
                                    ></div>
                                    <div>
                                      <h3 className="font-medium">{mood.name}</h3>
                                      <p className="text-xs text-gray-600 mt-1">{mood.description}</p>
                                    </div>
                                  </div>
                                  {selectedMood === mood.name && (
                                    <Check className="text-[#18a77e] w-5 h-5" />
                                  )}
                                </div>
                                
                                <div className="mt-3 border-t border-gray-100 pt-3">
                                  <div 
                                    className="h-16 rounded overflow-hidden"
                                    style={{ 
                                      backgroundColor: mood.bgColor,
                                      boxShadow: mood.name === 'Bold' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                                      border: mood.name === 'Minimalist' ? `1px solid ${mood.color}20` : 'none'
                                    }}
                                  >
                                    <div className="flex items-center h-full px-3">
                                      {mood.name === 'Minimalist' && (
                                        <div className="w-full">
                                          <div className="h-1.5 bg-gray-200 rounded-full w-2/3 mb-1"></div>
                                          <div className="h-1.5 bg-gray-200 rounded-full w-1/2"></div>
                                        </div>
                                      )}
                                      {mood.name === 'Bold' && (
                                        <div className="w-full flex justify-between items-center">
                                          <div 
                                            className="w-8 h-8 rounded-full"
                                            style={{ backgroundColor: mood.color }}
                                          ></div>
                                          <div 
                                            className="px-3 py-1 rounded-full text-white text-xs"
                                            style={{ backgroundColor: mood.secondaryColor }}
                                          >Bold</div>
                                        </div>
                                      )}
                                      {mood.name === 'Elegant' && (
                                        <div className="w-full text-center">
                                          <div 
                                            className="text-xs font-serif tracking-wider uppercase"
                                            style={{ color: mood.color }}
                                          >Elegant Design</div>
                                        </div>
                                      )}
                                      {mood.name === 'Playful' && (
                                        <div className="w-full flex gap-2">
                                          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                          <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                      )}
                                      {mood.name === 'Modern' && (
                                        <div className="w-full">
                                          <div 
                                            className="h-1 rounded-full"
                                            style={{ backgroundColor: mood.color }}
                                          ></div>
                                          <div className="flex justify-between mt-2">
                                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                          </div>
                                        </div>
                                      )}
                                      {mood.name === 'Vintage' && (
                                        <div className="w-full text-center">
                                          <div 
                                            className="text-xs font-serif"
                                            style={{ color: mood.color }}
                                          >~ Est. 2023 ~                  </div>
                  
                  {/* Shopping Cart Modal */}
                  {showCart && (
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
                  )}
                  
                  {/* Checkout Flow */}
                  {showCheckout && (
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
                                      ? "bg-[#18a77e] text-white shadow-lg"
                                      : step < checkoutState.step
                                      ? "bg-[#18a77e]/80 text-white"
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
                                    className="w-full p-2 border border-gray-300 rounded"
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
                                      className="w-full p-2 border border-gray-300 rounded"
                                      value={checkoutState.firstName}
                                      onChange={(e) => updateCheckoutField('firstName', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Last Name</label>
                                    <input 
                                      type="text" 
                                      className="w-full p-2 border border-gray-300 rounded"
                                      value={checkoutState.lastName}
                                      onChange={(e) => updateCheckoutField('lastName', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Step 2: Shipping Information */}
                          {checkoutState.step === 2 && (
                            <div>
                              <h4 className="font-medium mb-4">Shipping Address</h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Address</label>
                                  <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={checkoutState.address}
                                    onChange={(e) => updateCheckoutField('address', e.target.value)}
                                    placeholder="123 Main St"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input 
                                      type="text" 
                                      className="w-full p-2 border border-gray-300 rounded"
                                      value={checkoutState.city}
                                      onChange={(e) => updateCheckoutField('city', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                                    <input 
                                      type="text" 
                                      className="w-full p-2 border border-gray-300 rounded"
                                      value={checkoutState.postalCode}
                                      onChange={(e) => updateCheckoutField('postalCode', e.target.value)}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">Country</label>
                                  <select 
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={checkoutState.country}
                                    onChange={(e) => updateCheckoutField('country', e.target.value)}
                                  >
                                    <option value="United States">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Australia">Australia</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Step 3: Payment Method */}
                          {checkoutState.step === 3 && (
                            <div>
                              <h4 className="font-medium mb-4">Payment Method</h4>
                              
                              <div className="space-y-4">
                                <div className="flex flex-col gap-3 mb-6">
                                  <div 
                                    className={`border rounded-lg p-3 flex gap-3 items-center cursor-pointer transition-colors ${
                                      checkoutState.paymentMethod === 'credit-card' 
                                        ? 'border-[#18a77e] bg-[#18a77e]/5' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{ borderColor: checkoutState.paymentMethod === 'credit-card' ? primaryColor : undefined }}
                                    onClick={() => updateCheckoutField('paymentMethod', 'credit-card')}
                                  >
                                    <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0">
                                      {checkoutState.paymentMethod === 'credit-card' && (
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">Credit Card</h5>
                                      <div className="flex items-center mt-1 gap-1">
                                        <div className="h-6 w-10 bg-blue-600 rounded"></div>
                                        <div className="h-6 w-10 bg-red-500 rounded"></div>
                                        <div className="h-6 w-10 bg-yellow-400 rounded"></div>
                                        <div className="h-6 w-10 bg-gray-800 rounded"></div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div 
                                    className={`border rounded-lg p-3 flex gap-3 items-center cursor-pointer transition-colors ${
                                      checkoutState.paymentMethod === 'paypal' 
                                        ? 'border-[#18a77e] bg-[#18a77e]/5' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{ borderColor: checkoutState.paymentMethod === 'paypal' ? primaryColor : undefined }}
                                    onClick={() => updateCheckoutField('paymentMethod', 'paypal')}
                                  >
                                    <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0">
                                      {checkoutState.paymentMethod === 'paypal' && (
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">PayPal</h5>
                                      <div className="h-6 w-16 bg-blue-600 rounded mt-1"></div>
                                    </div>
                                  </div>
                                  
                                  <div 
                                    className={`border rounded-lg p-3 flex gap-3 items-center cursor-pointer transition-colors ${
                                      checkoutState.paymentMethod === 'apple-pay' 
                                        ? 'border-[#18a77e] bg-[#18a77e]/5' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{ borderColor: checkoutState.paymentMethod === 'apple-pay' ? primaryColor : undefined }}
                                    onClick={() => updateCheckoutField('paymentMethod', 'apple-pay')}
                                  >
                                    <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0">
                                      {checkoutState.paymentMethod === 'apple-pay' && (
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">Apple Pay</h5>
                                      <div className="h-6 w-16 bg-black rounded mt-1"></div>
                                    </div>
                                  </div>
                                  
                                  <div 
                                    className={`border rounded-lg p-3 flex gap-3 items-center cursor-pointer transition-colors ${
                                      checkoutState.paymentMethod === 'crypto' 
                                        ? 'border-[#18a77e] bg-[#18a77e]/5' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{ borderColor: checkoutState.paymentMethod === 'crypto' ? primaryColor : undefined }}
                                    onClick={() => updateCheckoutField('paymentMethod', 'crypto')}
                                  >
                                    <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0">
                                      {checkoutState.paymentMethod === 'crypto' && (
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">Cryptocurrency</h5>
                                      <div className="flex items-center mt-1 gap-1">
                                        <div className="h-6 w-6 bg-orange-500 rounded-full"></div>
                                        <div className="h-6 w-6 bg-blue-400 rounded-full"></div>
                                        <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {checkoutState.paymentMethod === 'credit-card' && (
                                  <div className="space-y-4 pt-4 border-t">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Card Number</label>
                                      <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={checkoutState.cardNumber}
                                        onChange={(e) => updateCheckoutField('cardNumber', e.target.value)}
                                        placeholder="0000 0000 0000 0000"
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                        <input 
                                          type="text" 
                                          className="w-full p-2 border border-gray-300 rounded"
                                          value={checkoutState.cardExpiry}
                                          onChange={(e) => updateCheckoutField('cardExpiry', e.target.value)}
                                          placeholder="MM/YY"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium mb-1">CVC</label>
                                        <input 
                                          type="text" 
                                          className="w-full p-2 border border-gray-300 rounded"
                                          value={checkoutState.cardCvc}
                                          onChange={(e) => updateCheckoutField('cardCvc', e.target.value)}
                                          placeholder="000"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-6">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                  <div className="flex gap-2">
                                    <div className="text-green-500 mt-0.5">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-medium text-green-800">Secure Checkout</h5>
                                      <p className="text-xs text-green-600 mt-1">
                                        We use industry-standard encryption to protect your payment information.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-600">Subtotal</span>
                                  <span className="font-medium">${calculateCartTotal()}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-600">Shipping</span>
                                  <span className="font-medium">Free</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-200 mt-4">
                                  <span className="font-medium">Total</span>
                                  <span className="font-bold" style={{ color: primaryColor }}>
                                    ${calculateCartTotal()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 border-t flex justify-between">
                          {checkoutState.step > 1 ? (
                            <button 
                              className="px-4 py-2 border border-gray-300 rounded font-medium"
                              onClick={prevCheckoutStep}
                            >
                              Back
                            </button>
                          ) : (
                            <button 
                              className="px-4 py-2 border border-gray-300 rounded font-medium"
                              onClick={backToCart}
                            >
                              Return to Cart
                            </button>
                          )}
                          
                          {checkoutState.step < 3 ? (
                            <button 
                              className="px-4 py-2 rounded font-medium text-white"
                              style={{ backgroundColor: primaryColor }}
                              onClick={nextCheckoutStep}
                            >
                              Continue
                            </button>
                          ) : (
                            <button 
                              className="px-4 py-2 rounded font-medium text-white"
                              style={{ backgroundColor: primaryColor }}
                              onClick={completeOrder}
                            >
                              Place Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Order Complete Modal */}
                  {orderComplete && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
                        <div className="p-6 text-center">
                          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Order Complete!</h3>
                          <p className="text-gray-500 mb-6">
                            Thank you for your purchase. Your order has been received.
                          </p>
                          <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="text-sm text-gray-500 mb-2">Order summary</div>
                            <div className="font-medium text-lg">
                              ${calculateCartTotal()}
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                              Payment method: {
                                checkoutState.paymentMethod === 'credit-card' ? 'Credit Card' :
                                checkoutState.paymentMethod === 'paypal' ? 'PayPal' :
                                checkoutState.paymentMethod === 'apple-pay' ? 'Apple Pay' :
                                'Cryptocurrency'
                              }
                            </div>
                          </div>
                          <button 
                            className="px-4 py-2 rounded font-medium text-white w-full"
                            style={{ backgroundColor: primaryColor }}
                            onClick={continueShopping}
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3">
                            <Button variant="outline" size="sm" className="w-full">
                              Show More Moods
                            </Button>
                          </div>
                          
                          <div className="p-4 bg-green-50 rounded-lg border border-green-100 mt-4">
                            <div className="flex gap-2">
                              <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <p className="text-sm text-green-700 font-medium">Premium Feature</p>
                                <p className="text-xs text-green-600 mt-1">
                                  With our Premium plan, you get access to all 10 designer-crafted moods plus the ability to fully customize with your own brand colors.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="layout" className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div 
                              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                                layoutStyle === 'Standard'
                                  ? 'border-[#18a77e] bg-[#18a77e]/5 ring-1 ring-[#18a77e]'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setLayoutStyle('Standard')}
                            >
                              <div className="bg-gray-100 p-4 aspect-video flex flex-col">
                                <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  <div className="bg-gray-200 rounded"></div>
                                  <div className="bg-gray-200 rounded"></div>
                                  <div className="bg-gray-200 rounded"></div>
                                  <div className="bg-gray-200 rounded"></div>
                                </div>
                              </div>
                              <div className="p-3 text-center">
                                <h3 className="font-medium">Standard</h3>
                                <p className="text-xs text-gray-500 mt-1">Classic e-commerce layout</p>
                              </div>
                            </div>
                            
                            <div 
                              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                                layoutStyle === 'Compact'
                                  ? 'border-[#18a77e] bg-[#18a77e]/5 ring-1 ring-[#18a77e]'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setLayoutStyle('Compact')}
                            >
                              <div className="bg-gray-100 p-4 aspect-video flex flex-col">
                                <div className="h-2 bg-gray-300 rounded w-1/2 mb-2"></div>
                                <div className="flex-1 grid grid-cols-3 gap-1">
                                  <div className="bg-gray-200 rounded"></div>
                                  <div className="bg-gray-200 rounded"></div>
                                  <div className="bg-gray-200 rounded"></div>
                                  <div className="bg-gray-200 rounded"></div>
                                  <div className="bg-gray-200 rounded"></div>
                                  <div className="bg-gray-200 rounded"></div>
                                </div>
                              </div>
                              <div className="p-3 text-center">
                                <h3 className="font-medium">Compact</h3>
                                <p className="text-xs text-gray-500 mt-1">More products per view</p>
                              </div>
                            </div>
                            
                            <div 
                              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                                layoutStyle === 'Spacious'
                                  ? 'border-[#18a77e] bg-[#18a77e]/5 ring-1 ring-[#18a77e]'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setLayoutStyle('Spacious')}
                            >
                              <div className="bg-gray-100 p-4 aspect-video flex flex-col">
                                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                                <div className="flex-1 grid grid-cols-1 gap-4">
                                  <div className="bg-gray-200 rounded h-12"></div>
                                  <div className="bg-gray-200 rounded h-12"></div>
                                </div>
                              </div>
                              <div className="p-3 text-center">
                                <h3 className="font-medium">Spacious</h3>
                                <p className="text-xs text-gray-500 mt-1">Elegant with more whitespace</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 mt-6 pt-6">
                            <h3 className="font-medium mb-3">Premium Layouts</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative">
                                <div className="absolute top-3 right-3 bg-[#0d3b66]/90 text-white text-xs px-2 py-1 rounded-md">
                                  Premium
                                </div>
                                <div className="p-4 aspect-video flex flex-col">
                                  <div className="h-3 bg-gray-300 rounded-full w-3/4 mb-3"></div>
                                  <div className="flex-1 flex">
                                    <div className="w-1/3 bg-gray-200 mr-3 rounded"></div>
                                    <div className="flex-1 space-y-2">
                                      <div className="h-2 bg-gray-300 rounded-full w-full"></div>
                                      <div className="h-2 bg-gray-300 rounded-full w-2/3"></div>
                                      <div className="h-2 bg-gray-300 rounded-full w-5/6"></div>
                                      <div className="h-2 bg-gray-300 rounded-full w-1/2"></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h3 className="font-medium">Storytelling</h3>
                                  <p className="text-xs text-gray-500 mt-1">Narrative-driven product showcasing</p>
                                </div>
                              </div>
                              
                              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative">
                                <div className="absolute top-3 right-3 bg-[#0d3b66]/90 text-white text-xs px-2 py-1 rounded-md">
                                  Premium
                                </div>
                                <div className="p-4 aspect-video">
                                  <div className="h-full grid grid-cols-3 grid-rows-2 gap-1">
                                    <div className="col-span-2 row-span-2 bg-gray-200 rounded"></div>
                                    <div className="bg-gray-200 rounded"></div>
                                    <div className="bg-gray-200 rounded"></div>
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h3 className="font-medium">Grid-focused</h3>
                                  <p className="text-xs text-gray-500 mt-1">Gallery-style product presentation</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-700 font-medium">Watch your store transform in real-time!</p>
                          <p className="text-xs text-blue-600 mt-1">
                            All changes are instantly reflected in the preview. Try different combinations to find your perfect look.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Add Products */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">3. Add Products</h2>
                    <p className="text-darkText/70">
                      {categorySelectionComplete 
                        ? "Add your products to the selected category. Include images, descriptions, pricing and more."
                        : "First, create a category for your products."}
                    </p>
                    
                    {/* Category Selection UI */}
                    {!categorySelectionComplete && (
                      <div className="space-y-6">
                        <div className="mb-6 bg-[#f8f9fb] border-2 border-gray-200 rounded-xl overflow-hidden">
                          <div className="bg-[#0d3b66] text-white px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium flex items-center">
                              <Layers className="w-5 h-5 mr-2" />
                              Step 1: Create Product Categories
                            </h3>
                            <div className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                              Required
                            </div>
                          </div>
                          
                          <div className="p-6">
                            {categories.length > 0 ? (
                              <div className="space-y-4">
                                {categories.map(cat => (
                                  <div key={cat.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">{cat.name}</h4>
                                      <p className="text-sm text-gray-500 mt-1">{cat.description || "No description provided"}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => editCategory(cat)}
                                      >
                                        <Edit className="w-4 h-4 mr-1" /> Edit
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => deleteCategory(cat.id)}
                                      >
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                
                                <div className="flex flex-wrap gap-3 justify-between items-center pt-4 border-t border-gray-200 mt-4">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setShowCategoryDialog(true)}
                                    className="text-sm"
                                  >
                                    <Plus className="w-4 h-4 mr-1" /> Add Another Category
                                  </Button>
                                  <Button 
                                    className="bg-[#18a77e] hover:bg-[#18a77e]/90"
                                    onClick={() => setCategorySelectionComplete(true)}
                                  >
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    Continue to Add Products
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-[#0d3b66]/10 flex items-center justify-center mx-auto mb-4">
                                  <Layers className="w-8 h-8 text-[#0d3b66]" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">No Categories Created</h3>
                                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                                  Create a category to organize your products. This helps customers navigate your store.
                                </p>
                                <Button 
                                  onClick={() => setShowCategoryDialog(true)}
                                  className="bg-[#18a77e] hover:bg-[#18a77e]/90"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Category
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-sm text-blue-700 font-medium">Why are categories important?</p>
                              <p className="text-xs text-blue-600 mt-1">
                                Categories help organize your products and make it easier for customers to browse your store. They also improve search engine optimization (SEO).
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Product Creation UI - Only show when a category is selected */}
                    {categorySelectionComplete && (
                      <div className="space-y-6">
                        <div className="bg-[#f8f9fb] border-2 border-gray-200 rounded-xl overflow-hidden mb-6">
                          <div className="bg-[#0d3b66] text-white px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium flex items-center">
                              <Package className="w-5 h-5 mr-2" />
                              Step 2: Add Products to {categories[0]?.name || 'Store'}
                            </h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setCategorySelectionComplete(false)}
                              className="text-white hover:text-white hover:bg-white/20"
                            >
                              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Categories
                            </Button>
                          </div>
                          
                          <div className="p-6">
                            {/* Product List */}
                            {products.length > 0 && (
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="text-base font-medium">Your Products</h3>
                                  <div className="bg-[#0d3b66] text-white px-3 py-1 rounded-full text-xs">
                                    {products.length}/3 Added
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  {products.map(product => (
                                    <div key={product.id} className="border rounded-md overflow-hidden shadow-sm bg-white">
                                      <div className="aspect-square bg-gray-100 relative">
                                        <img 
                                          src={product.image || generatePlaceholderImage(product.name)} 
                                          alt={product.name}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-0 right-0 bg-black/50 p-1 flex gap-1">
                                          <button 
                                            onClick={() => editProduct(product)}
                                            className="p-1 text-white hover:text-blue-300 transition-colors"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => deleteProduct(product.id)}
                                            className="p-1 text-white hover:text-red-300 transition-colors"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="p-3">
                                        <h4 className="font-medium truncate">{product.name}</h4>
                                        <div className="flex items-baseline gap-2 mt-1">
                                          <span className="text-[#18a77e] font-semibold">${product.price}</span>
                                          {product.comparePrice && (
                                            <span className="text-gray-400 line-through text-sm">${product.comparePrice}</span>
                                          )}
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                          {product.category} • {product.inventory} in stock
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {products.length < 3 && (
                                    <div 
                                      className="border-2 border-dashed border-gray-200 rounded-md h-full min-h-[200px] flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                      onClick={() => {
                                        resetProductForm();
                                        setEditingProduct(null);
                                      }}
                                    >
                                      <div className="w-12 h-12 rounded-full bg-[#18a77e]/10 flex items-center justify-center mb-2">
                                        <Plus className="w-6 h-6 text-[#18a77e]" />
                                      </div>
                                      <p className="text-sm text-center text-gray-600">Add Product</p>
                                      <p className="text-xs text-center text-gray-400 mt-1">({3 - products.length} remaining)</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Product Form Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-5 mt-6">
                              <h4 className="font-medium text-lg mb-4 flex items-center">
                                {editingProduct ? 'Edit Product' : 'New Product'}
                                {editingProduct && (
                                  <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    Editing
                                  </span>
                                )}
                              </h4>
                              
                              <Tabs defaultValue="basic" className="my-4">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                  <TabsTrigger value="images">Images</TabsTrigger>
                                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="basic" className="space-y-4 pt-6">
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Product Name</label>
                                    <input 
                                      type="text" 
                                      placeholder="Product Name" 
                                      className="w-full p-3 border border-gray-200 rounded-md"
                                      value={productName}
                                      onChange={(e) => setProductName(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea 
                                      rows={4}
                                      placeholder="Describe your product" 
                                      className="w-full p-3 border border-gray-200 rounded-md"
                                      value={productDescription}
                                      onChange={(e) => setProductDescription(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select 
                                      className="w-full p-3 border border-gray-200 rounded-md"
                                      value={productCategory}
                                      onChange={(e) => setProductCategory(e.target.value)}
                                    >
                                      {categories.length > 0 ? (
                                        categories.map(cat => (
                                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))
                                      ) : (
                                        <>
                                          <option>Outerwear</option>
                                          <option>Tops</option>
                                          <option>Bottoms</option>
                                          <option>Accessories</option>
                                          <option>Footwear</option>
                                          <option>Dresses</option>
                                        </>
                                      )}
                                    </select>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>SEO fields, tags, and metadata options available in the Premium plan</span>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="images" className="space-y-4 pt-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                      <div className="relative w-full aspect-square mb-3">
                                        <img 
                                          src={productImage}
                                          alt="Product" 
                                          className="w-full h-full object-cover rounded"
                                        />
                                        
                                        {isUploading && (
                                          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                                            <div className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden">
                                              <div 
                                                className="h-full bg-[#18a77e]" 
                                                style={{ width: `${uploadProgress}%` }}
                                              ></div>
                                            </div>
                                            <p className="text-sm mt-2">Uploading... {uploadProgress}%</p>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <p className="text-sm text-gray-500 mb-3">Main Product Image</p>
                                      
                                      <div className="flex gap-2">
                                        <label 
                                          htmlFor="product-image-upload" 
                                          className="cursor-pointer px-4 py-2 bg-[#18a77e] text-white rounded-md hover:bg-[#18a77e]/90 flex items-center justify-center gap-2 text-sm"
                                        >
                                          <Upload className="w-4 h-4" />
                                          Upload Image
                                          <input 
                                            id="product-image-upload"
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden"
                                            onChange={handleProductImageUpload}
                                            disabled={isUploading}
                                          />
                                        </label>
                                        {productImage !== "/placeholder-images/placeholder.jpg" && (
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-red-500 border-red-200"
                                            onClick={() => setProductImage("/placeholder-images/placeholder.jpg")}
                                            disabled={isUploading}
                                          >
                                            Reset
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                    <div 
                                      className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                      <div className="p-3 rounded-full bg-gray-100 mb-3">
                                        <Image className="w-6 h-6 text-gray-400" />
                                      </div>
                                      <p className="text-sm text-gray-500">Add Additional Image</p>
                                      <p className="text-xs text-gray-400 mt-1">(Premium Feature)</p>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mt-4">
                                    <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                                      <Sparkles className="w-4 h-4" />
                                      Premium Feature Preview
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="bg-white rounded-md p-3 flex items-center gap-3 border border-blue-50">
                                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium">AI Background Removal</h5>
                                          <p className="text-xs text-gray-500">Premium plan feature</p>
                                        </div>
                                      </div>
                                      <div className="bg-white rounded-md p-3 flex items-center gap-3 border border-blue-50">
                                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium">Video Support</h5>
                                          <p className="text-xs text-gray-500">Premium plan feature</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-gray-500 mt-2">
                                    You can add up to 8 images per product in the premium plan. First image will be used as the featured image.
                                  </p>
                                </TabsContent>
                                
                                <TabsContent value="pricing" className="space-y-4 pt-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Price ($)</label>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                          <DollarSign className="w-4 h-4" />
                                        </span>
                                        <input 
                                          type="text" 
                                          placeholder="0.00" 
                                          className="w-full p-3 pl-8 border border-gray-200 rounded-md"
                                          value={productPrice}
                                          onChange={(e) => setProductPrice(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Compare at Price ($)</label>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                          <DollarSign className="w-4 h-4" />
                                        </span>
                                        <input 
                                          type="text" 
                                          placeholder="0.00" 
                                          className="w-full p-3 pl-8 border border-gray-200 rounded-md"
                                          value={comparePrice}
                                          onChange={(e) => setComparePrice(e.target.value)}
                                        />
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Shows as a crossed-out price to indicate a discount
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Inventory</label>
                                    <input 
                                      type="number" 
                                      placeholder="Quantity" 
                                      className="w-full p-3 border border-gray-200 rounded-md"
                                      value={inventory}
                                      onChange={(e) => setInventory(e.target.value)}
                                    />
                                  </div>
                                  
                                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 mt-4">
                                    <div className="flex gap-3">
                                      <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                                      <div>
                                        <p className="text-sm text-blue-700 font-medium">Payment Processing Fees:</p>
                                        <div className="mt-2 space-y-2">
                                          <div className="flex items-center justify-between p-2 bg-white rounded border border-blue-100">
                                            <div>
                                              <span className="text-sm font-medium">Basic Plan</span>
                                              <p className="text-xs text-gray-500">Standard rate</p>
                                            </div>
                                            <span className="text-sm font-bold text-[#18a77e]">3.9% + $0.30</span>
                                          </div>
                                          <div className="flex items-center justify-between p-2 bg-white rounded border border-blue-100">
                                            <div>
                                              <span className="text-sm font-medium">Premium Plan</span>
                                              <p className="text-xs text-gray-500">Discounted rate</p>
                                            </div>
                                            <span className="text-sm font-bold text-green-600">2.9% + $0.30</span>
                                          </div>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-3">
                                          Save on transaction fees with our Premium plan, potentially saving hundreds of dollars per month for busy stores.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                              
                              <div className="mt-8 flex justify-end gap-3">
                                {editingProduct ? (
                                  <>
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        resetProductForm();
                                        setEditingProduct(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      className="bg-[#18a77e] hover:bg-[#18a77e]/90"
                                      onClick={saveProduct}
                                    >
                                      <Save className="w-4 h-4 mr-2" />
                                      Update Product
                                    </Button>
                                  </>
                                ) : (
                                  <Button 
                                    className="bg-[#18a77e] hover:bg-[#18a77e]/90"
                                    onClick={saveProduct}
                                    disabled={products.length >= 3}
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Save Product
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {editingProduct ? (
                          <>
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Size Options for {editingProduct.name}</h3>
                                <div className="flex gap-2">
                                  <button 
                                    className="text-[#18a77e] text-sm flex items-center gap-1"
                                    onClick={addSize}
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add Size
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {selectedSizes.map(size => (
                                  <span 
                                    key={size}
                                    className={`px-4 py-2 border border-gray-200 ${hoveredSize === size ? 'bg-red-50' : 'bg-gray-50'} rounded-md text-sm flex items-center gap-1 group relative`}
                                    onMouseEnter={() => setHoveredSize(size)}
                                    onMouseLeave={() => setHoveredSize("")}
                                  >
                                    {size}
                                    {hoveredSize === size && (
                                      <button 
                                        className="ml-1 text-red-500"
                                        onClick={() => removeSize(size)}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Color Options for {editingProduct.name}</h3>
                                <div className="flex gap-2">
                                  <button 
                                    className="text-[#18a77e] text-sm flex items-center gap-1"
                                    onClick={addColor}
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add Color
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {selectedColors.map(color => (
                                  <span 
                                    key={color.name}
                                    className={`px-4 py-2 border border-gray-200 ${hoveredColor === color.name ? 'bg-red-50' : 'bg-gray-50'} rounded-md text-sm flex items-center gap-1 group`}
                                    onMouseEnter={() => setHoveredColor(color.name)}
                                    onMouseLeave={() => setHoveredColor("")}
                                  >
                                    <span 
                                      className="w-4 h-4 rounded-full mr-2"
                                      style={{ backgroundColor: color.hex }}
                                    ></span>
                                    {color.name}
                                    {hoveredColor === color.name && (
                                      <button 
                                        className="ml-1 text-red-500"
                                        onClick={() => removeColor(color.name)}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                              <Button 
                                className="bg-[#18a77e] hover:bg-[#18a77e]/90"
                                onClick={() => {
                                  // Update product with new options
                                  setProducts(products.map(p => 
                                    p.id === editingProduct.id 
                                      ? { ...p, sizes: [...selectedSizes], colors: [...selectedColors] }
                                      : p
                                  ));
                                  setEditingProduct(null);
                                }}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Options
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                            <h3 className="text-lg font-medium mb-2">Select a Product</h3>
                            <p className="text-gray-500 mb-4">Please select a product to configure its options</p>
                          </div>
                        )}
                      
                        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-r from-purple-50 to-pink-50">
                          <div className="flex gap-3">
                            <div>
                              <div className="w-10 h-10 bg-[#18a77e] rounded-full flex items-center justify-center mb-1">
                                <Sparkles className="w-5 h-5 text-[#18a77e]" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-[#18a77e] mb-1">Premium Plan Features</h3>
                              <p className="text-xs text-[#18a77e] mb-3">
                                Upgrade to Premium for advanced product options.
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-[#18a77e] mt-0.5" />
                                  <span className="text-xs">Conditional options that appear based on other selections</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-[#18a77e] mt-0.5" />
                                  <span className="text-xs">Price adjustments based on selected options</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-[#18a77e] mt-0.5" />
                                  <span className="text-xs">Inventory tracking per option combination</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-[#18a77e] mt-0.5" />
                                  <span className="text-xs">Option-specific images</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Did you know?</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Even in the Basic plan, your customers can select combinations of all the options you create. Options are immediately reflected in the preview.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Add Services */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">4. Add Service Offerings</h2>
                  <p className="text-darkText/70">
                    Expand your business by offering services alongside products. Add consultations, digital deliverables, courses, and more.
                  </p>
                  
                  <ServiceOfferings 
                    services={services}
                    onAddService={addService}
                    onEditService={editService}
                    onDeleteService={deleteService}
                    primaryColor="#0d3b66"
                    secondaryColor="#18a77e"
                  />
                  
                  <div className="mt-8 flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={prevStep}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-[#0d3b66] hover:bg-[#0d3b66]/90"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Go Live */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">5. Publish Your Store</h2>
                  <p className="text-darkText/70">
                    Review your store setup and hit publish when you're ready to go live!
                  </p>

                  <div className="bg-gray-50 p-6 rounded-lg my-8">
                    <h3 className="font-medium text-lg mb-4">Pre-Launch Checklist</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Store information completed</p>
                          <p className="text-sm text-gray-500">Store name, URL, and business details</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Store design customized</p>
                          <p className="text-sm text-gray-500">Colors, layout, and design mood selected</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Products added ({products.length}/3)</p>
                          <p className="text-sm text-gray-500">
                            {products.length > 0 
                              ? products.map(p => p.name).join(', ')
                              : "No products added yet"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Payment method connected</p>
                          <p className="text-sm text-gray-500">Stripe payments ready to accept orders</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-500">Shipping options (optional)</p>
                            <p className="text-sm text-gray-500">Configure shipping rates and delivery options</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <span className="w-6 h-6 bg-[#18a77e] text-white rounded-full inline-flex items-center justify-center text-xs mr-2">1</span>
                        Selected Plan
                      </h3>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Basic Plan</h4>
                            <p className="text-sm text-gray-500">$29/month after trial</p>
                          </div>
                          <Button variant="outline" size="sm">Change</Button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-700">Includes:</p>
                          <ul className="mt-1 space-y-1">
                            <li className="text-xs text-gray-600 flex items-start">
                              <Check className="w-3.5 h-3.5 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                              <span>Up to 100 products</span>
                            </li>
                            <li className="text-xs text-gray-600 flex items-start">
                              <Check className="w-3.5 h-3.5 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                              <span>3.9% + $0.30 payment processing</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <span className="w-6 h-6 bg-[#18a77e] text-white rounded-full inline-flex items-center justify-center text-xs mr-2">2</span>
                        Your Domain
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{storeUrl}.webshop.com</span>
                          <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Included free</span>
                        </div>
                        <div className="border border-dashed border-[#18a77e] rounded-lg p-3 bg-[#18a77e]/5">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-sm">Use your own domain</h4>
                              <p className="text-xs text-gray-500">Connect your existing domain or buy a new one</p>
                            </div>
                            <Button size="sm">Set Up</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                    <div className="mb-3">
                      <Sparkles className="w-10 h-10 text-green-600 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-green-800 mb-2">Ready to launch your store!</h3>
                    <p className="text-green-700 mb-6 max-w-lg mx-auto">
                      Your store is ready to go live. Once published, customers can visit your store and make purchases. You'll have a 14-day free trial to test everything.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        className="bg-[#18a77e] hover:bg-[#18a77e]/90"
                        onClick={() => setShowConversionDialog(true)}
                      >
                        Publish Store
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={toggleFullPreview}
                      >
                        Preview Store
                      </Button>
                    </div>
                    <p className="mt-4 text-xs text-green-600">
                      No credit card required today. You'll be asked for payment details after your 14-day trial.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button 
                    onClick={nextStep} 
                    className="flex items-center"
                    disabled={currentStep === 3 && products.length === 0}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={toggleFullPreview}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview Store
                    </Button>
                    <Button 
                      className="bg-[#18a77e] hover:bg-[#18a77e]/90"
                      onClick={() => setShowConversionDialog(true)}
                    >
                      Launch Your Store
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Live Preview */}
            {showPreview && (
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${fullPreviewMode ? 'fixed inset-4 z-50' : ''} relative`}>
                {/* Decorative geometric elements */}
                <div className="absolute top-0 right-0 w-24 h-24 -z-10 overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full opacity-20" style={{ backgroundColor: accentColor }}></div>
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24 -z-10 overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-48 h-48 rounded-tr-full opacity-20" style={{ backgroundColor: secondaryColor }}></div>
                </div>
                <div className="absolute top-1/4 left-10 w-12 h-12 rounded-full opacity-10 blur-xl" style={{ backgroundColor: secondaryColor }}></div>
                <div className="absolute bottom-1/4 right-10 w-12 h-12 rounded-full opacity-10 blur-xl" style={{ backgroundColor: accentColor }}></div>
                
                {/* Floating particles */}
                <div className="absolute top-[30%] right-[20%] w-3 h-3 rounded-full opacity-20 animate-float-slow" style={{ backgroundColor: secondaryColor }}></div>
                <div className="absolute top-[60%] left-[15%] w-4 h-4 rounded-full opacity-20 animate-float" style={{ backgroundColor: accentColor }}></div>
                <div className="absolute top-[40%] left-[30%] w-6 h-2 rounded-full opacity-10 rotate-45 animate-pulse" style={{ backgroundColor: secondaryColor }}></div>
                
                {/* Rainbow gradient line at top */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${accentColor})` }}></div>
                
                <div className="bg-blue-600 text-white p-3 flex justify-between items-center relative">
                  {/* Browser controls with subtle glow */}
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 relative">
                      <span className="absolute inset-0 rounded-full animate-ping opacity-70 bg-red-400" style={{ animationDuration: '3s' }}></span>
                    </span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  
                  <div className="px-4 py-1 bg-blue-700 rounded-md text-xs font-medium relative overflow-hidden">
                    {/* Animated shimmer effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                    https://{storeUrl}.webshop.com
                  </div>
                  
                  <div className="flex gap-2">
                    {fullPreviewMode && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-blue-700"
                        onClick={toggleFullPreview}
                      >
                        Close Preview
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className={`${fullPreviewMode ? 'h-[calc(100%-3rem)] overflow-y-auto' : 'h-[600px] overflow-y-auto'} relative bg-gradient-to-br from-white to-gray-50`}>
                  {/* Background patterns and decorative elements */}
                  <div className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-5" style={{ backgroundColor: secondaryColor }}></div>
                  <div className="absolute bottom-40 left-10 w-60 h-60 rounded-full opacity-5" style={{ backgroundColor: accentColor }}></div>
                  <div className="absolute top-1/3 left-1/4 w-12 h-12 rounded rotate-45 opacity-10" style={{ backgroundColor: secondaryColor }}></div>
                  
                  {/* Diagonal stripes in the background */}
                  <div className="absolute inset-0 opacity-5 overflow-hidden">
                    <div className="absolute -right-1/4 top-0 w-full h-full bg-pattern-diagonal" style={{ 
                      backgroundImage: `repeating-linear-gradient(45deg, ${secondaryColor}, ${secondaryColor} 2px, transparent 2px, transparent 10px)` 
                    }}></div>
                  </div>
                  
                  <header 
                    className="p-4 border-b sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4 relative">
                      <div className="flex items-center">
                        {logoImage ? (
                          <div className="relative">
                            {/* Logo glow effect */}
                            <div className="absolute inset-0 rounded-full opacity-75" style={{ 
                              backgroundColor: `${accentColor}20`, 
                              filter: 'blur(8px)', 
                              transform: 'scale(1.2)'
                            }}></div>
                            <img 
                              src={logoImage} 
                              alt={storeName}
                              className="h-10 mr-3 relative z-10" 
                            />
                          </div>
                        ) : (
                          <div 
                            className="w-10 h-10 rounded-md flex items-center justify-center mr-3 relative overflow-hidden group"
                            style={{ backgroundColor: primaryColor + '15' }}
                          >
                            {/* Animated accent corner */}
                            <div className="absolute -right-4 -bottom-4 w-8 h-8 transform rotate-45 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${secondaryColor}40` }}></div>
                            <span 
                              className="text-lg font-bold relative z-10"
                              style={{ color: primaryColor }}
                            >
                              {storeName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <h1 
                          className="text-xl font-medium relative"
                          style={{ 
                            color: primaryColor,
                            fontFamily: `var(--preview-font)` 
                          }}
                        >
                          {/* Animated underline on hover */}
                          <span className="relative inline-block group">
                            {storeName}
                            <span 
                              className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" 
                              style={{ 
                                background: `linear-gradient(to right, ${secondaryColor}, ${accentColor})`,
                                transformOrigin: 'left'
                              }}
                            ></span>
                          </span>
                        </h1>
                      </div>
                      
                      <nav className="hidden md:flex items-center space-x-6">
                        <a 
                          href="#" 
                          className="font-medium py-2 border-b-2 border-[#18a77e]"
                          style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                          Home
                        </a>
                        {categories.map(cat => (
                          <a 
                            key={cat.id}
                            href="#" 
                            className="font-medium text-gray-600 py-2 border-b-2 border-transparent hover:text-[#18a77e] hover:border-[#18a77e] transition-colors relative group"
                            style={{ 
                              "--hover-color": primaryColor 
                            } as React.CSSProperties}
                          >
                            {/* Add hover highlight with secondary color */}
                            <span className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 rounded transition-colors"></span>
                            <span className="relative z-10">{cat.name}</span>
                          </a>
                        ))}
                        {categories.length === 0 && (
                          <>
                            <a href="#" className="font-medium text-gray-600 py-2 border-b-2 border-transparent relative group">
                              <span className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 rounded transition-colors"></span>
                              <span className="relative z-10">Products</span>
                            </a>
                            <a href="#" className="font-medium text-gray-600 py-2 border-b-2 border-transparent relative group">
                              <span className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 rounded transition-colors"></span>
                              <span className="relative z-10">About</span>
                            </a>
                          </>
                        )}
                        <a href="#" className="font-medium text-gray-600 py-2 border-b-2 border-transparent relative group">
                          <span className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 rounded transition-colors"></span>
                          <span className="relative z-10">Contact</span>
                        </a>
                      </nav>
                      
                      <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-600 relative overflow-hidden group">
                          {/* Add animated accent circle on hover */}
                          <span className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" style={{ backgroundColor: `${accentColor}20` }}></span>
                          <Search className="w-5 h-5 relative z-10" />
                        </button>
                        <button 
                          className="p-2 text-gray-600 relative overflow-hidden group"
                          onClick={() => setShowCart(true)}
                        >
                          <span className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" style={{ backgroundColor: `${secondaryColor}20` }}></span>
                                                          <div className="relative">
                            <ShoppingCart className="w-5 h-5 relative z-10" />
                            {cartItems.length > 0 && (
                              <span 
                                className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white"
                                style={{ backgroundColor: accentColor }}
                              >
                                {cartItems.reduce((total, item) => total + item.quantity, 0)}
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative mt-4 md:hidden">
                      <Input 
                        type="search"
                        placeholder="Search products..."
                        className="w-full pr-10 text-sm rounded-full border-gray-200"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      {/* Add secondary-colored gradient effect around input on focus */}
                      <div className="absolute inset-0 rounded-full opacity-0 focus-within:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to right, ${secondaryColor}20, ${accentColor}20)`, filter: 'blur(4px)', zIndex: -1 }}></div>
                    </div>
                  </header>
                  
                  <main className="p-4 md:p-6 relative">
                    {/* Add background decorative elements */}
                    <div className="absolute top-[20%] right-[10%] w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: `${secondaryColor}30` }}></div>
                    <div className="absolute bottom-[30%] left-[5%] w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: `${accentColor}20` }}></div>
                    <div className="absolute top-[40%] left-[30%] w-6 h-24 rounded-full opacity-20 rotate-45" style={{ backgroundColor: `${secondaryColor}40` }}></div>
                    <div className="absolute bottom-[20%] right-[20%] w-24 h-6 rounded-full opacity-20 -rotate-12" style={{ backgroundColor: `${accentColor}40` }}></div>
                    
                    {/* Product detail view */}
                    {selectedPreviewProduct ? (
                      <div className="mb-8 relative">
                        {/* Back button */}
                        <button 
                          className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                          onClick={handleBackToProducts}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                          </svg>
                          Back to Products
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Product image with decorative elements */}
                          <div className="relative">
                            {/* Decorative corner elements */}
                            <div className="absolute top-0 left-0 w-16 h-16 -z-10 overflow-hidden">
                              <div className="absolute top-0 left-0 w-24 h-24 rounded-br-full opacity-20" style={{ backgroundColor: secondaryColor }}></div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-16 h-16 -z-10 overflow-hidden">
                              <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-20" style={{ backgroundColor: accentColor }}></div>
                            </div>
                            
                            {/* Image wrapper */}
                            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
                              <img 
                                src={selectedPreviewProduct.image || generatePlaceholderImage(selectedPreviewProduct.name)} 
                                alt={selectedPreviewProduct.name}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Sale or New tag */}
                              {selectedPreviewProduct.id.length % 3 === 0 && (
                                <div 
                                  className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white shadow-md rounded-md"
                                  style={{ backgroundColor: secondaryColor }}
                                >
                                  SALE
                                </div>
                              )}
                              {selectedPreviewProduct.id.length % 4 === 0 && !(selectedPreviewProduct.id.length % 3 === 0) && (
                                <div 
                                  className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white shadow-md rounded-md"
                                  style={{ backgroundColor: accentColor }}
                                >
                                  NEW
                                </div>
                              )}
                            </div>
                            
                            {/* Thumbnail images */}
                            <div className="grid grid-cols-4 gap-2 mt-4">
                              <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border-2 relative" style={{ borderColor: primaryColor }}>
                                <img 
                                  src={selectedPreviewProduct.image || generatePlaceholderImage(selectedPreviewProduct.name)} 
                                  alt={selectedPreviewProduct.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden relative opacity-70 hover:opacity-100 transition-opacity">
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                                    Image {i+1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Product info */}
                          <div>
                            {/* Title with decorative accent */}
                            <div className="relative">
                              <div 
                                className="absolute left-0 top-0 w-1.5 h-8 rounded-full -translate-x-4" 
                                style={{ backgroundColor: secondaryColor }}
                              ></div>
                              <h1 
                                className="text-2xl font-medium mb-2"
                                style={{ fontFamily: `var(--preview-font)` }}
                              >
                                {selectedPreviewProduct.name}
                              </h1>
                            </div>
                            
                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-4">
                              <span 
                                className="text-xl font-bold"
                                style={{ color: primaryColor }}
                              >
                                ${selectedPreviewProduct.price}
                              </span>
                              {selectedPreviewProduct.comparePrice && (
                                <span className="text-sm line-through text-gray-400">
                                  ${selectedPreviewProduct.comparePrice}
                                </span>
                              )}
                              {/* Savings badge */}
                              {selectedPreviewProduct.comparePrice && (
                                <span 
                                  className="ml-2 px-2 py-0.5 text-xs font-medium text-white rounded-full"
                                  style={{ backgroundColor: accentColor }}
                                >
                                  Save ${(parseFloat(selectedPreviewProduct.comparePrice) - parseFloat(selectedPreviewProduct.price)).toFixed(2)}
                                </span>
                              )}
                            </div>
                            
                            {/* Description */}
                            <div className="mb-6">
                              <p className="text-gray-600 mb-3 leading-relaxed">
                                {selectedPreviewProduct.description || "No description available for this product."}
                              </p>
                              
                              {/* Inventory */}
                              <div className="flex items-center gap-2 text-sm mt-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: parseInt(selectedPreviewProduct.inventory) > 10 ? 'green' : 'orange' }}
                                ></div>
                                <span className="text-gray-500">
                                  {parseInt(selectedPreviewProduct.inventory) > 0 
                                    ? `${selectedPreviewProduct.inventory} in stock` 
                                    : "Out of stock"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Size selection */}
                            <div className="mb-6">
                              <h3 className="font-medium mb-2 flex items-center gap-1.5">
                                <span>Size</span>
                                <span 
                                  className="text-xs px-1.5 rounded"
                                  style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor }}
                                >
                                  Required
                                </span>
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedPreviewProduct.sizes.map(size => (
                                  <div 
                                    key={size}
                                    className={`py-2 px-3 border ${selectedSize === size ? 'border-2' : 'border'} rounded-md text-sm text-center cursor-pointer transition-colors relative group flex-1 max-w-16 ${
                                      selectedSize === size 
                                        ? 'border-primary shadow-sm' 
                                        : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                    style={{ 
                                      borderColor: selectedSize === size ? primaryColor : undefined,
                                      color: selectedSize === size ? primaryColor : undefined
                                    }}
                                    onClick={() => setSelectedSize(size)}
                                  >
                                    {size}
                                    {/* Hover effect with accent color */}
                                    <span 
                                      className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-md transition-opacity"
                                      style={{ backgroundColor: primaryColor }}
                                    ></span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Color selection */}
                            {selectedPreviewProduct.colors.length > 0 && (
                              <div className="mb-6">
                                <h3 className="font-medium mb-2 flex items-center gap-1.5">
                                  <span>Color</span>
                                  <span 
                                    className="text-xs px-1.5 rounded"
                                    style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor }}
                                  >
                                    Required
                                  </span>
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                  {selectedPreviewProduct.colors.map(color => (
                                    <div 
                                      key={color.name}
                                      className="relative group cursor-pointer"
                                      onClick={() => setSelectedColor(color)}
                                    >
                                      <div 
                                        className={`w-8 h-8 rounded-full ${selectedColor?.name === color.name ? 'scale-110' : 'border-2 border-white'} shadow-sm group-hover:shadow-md transition-all`}
                                        style={{ 
                                          backgroundColor: color.hex,
                                          ...(selectedColor?.name === color.name ? { boxShadow: `0 0 0 2px ${primaryColor}` } : {})
                                        }}
                                      ></div>
                                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {color.name}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Add to cart button - update to use addToCart function */}
                            <div className="flex flex-col space-y-3">
                              <button 
                                className="w-full py-3 px-4 rounded-lg text-white font-medium relative overflow-hidden group"
                                style={{ backgroundColor: primaryColor }}
                                onClick={addToCart}
                              >
                                {/* Animated gradient overlay on hover */}
                                <span 
                                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" 
                                  style={{ 
                                    background: `linear-gradient(45deg, ${secondaryColor}, ${accentColor})` 
                                  }}
                                ></span>
                                <span className="relative flex items-center justify-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                  </svg>
                                  Add to Cart
                                </span>
                              </button>
                              
                              <button 
                                className="w-full py-3 px-4 rounded-lg border font-medium bg-white transition-colors relative overflow-hidden group"
                                style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
                                onClick={() => {
                                  addToCart();
                                  proceedToCheckout();
                                }}
                              >
                                {/* Subtle hover effect */}
                                <span 
                                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                                  style={{ backgroundColor: primaryColor }}
                                ></span>
                                <span className="relative">Buy Now</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Product tabs - simplified version */}
                        <div className="mt-12">
                          <div className="border-b border-gray-200 flex space-x-8">
                            <div className="py-2 px-1 border-b-2 font-medium text-sm" style={{ borderColor: primaryColor, color: primaryColor }}>
                              Description
                            </div>
                            <div className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                              Details
                            </div>
                            <div className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                              Reviews
                            </div>
                          </div>
                          
                          <div className="py-4">
                            <p className="text-gray-600 leading-relaxed">
                              {selectedPreviewProduct.description || "No description available for this product."}
                              {!selectedPreviewProduct.description && 
                                " This premium product from our collection features high-quality materials and exceptional craftsmanship. Perfect for everyday use or special occasions."}
                            </p>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2">Features</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  <li className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }}></span>
                                    Premium quality materials
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }}></span>
                                    Durable and long-lasting
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }}></span>
                                    Modern design
                                  </li>
                                </ul>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2">Specifications</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  <li className="flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full mt-1.5" style={{ backgroundColor: secondaryColor }}></span>
                                    Category: {selectedPreviewProduct.category}
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full mt-1.5" style={{ backgroundColor: secondaryColor }}></span>
                                    Available sizes: {selectedPreviewProduct.sizes.join(', ')}
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full mt-1.5" style={{ backgroundColor: secondaryColor }}></span>
                                    Available colors: {selectedPreviewProduct.colors.map(c => c.name).join(', ')}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Hero Section */}
                        <div 
                          className="rounded-lg overflow-hidden mb-8 relative" 
                          style={{ 
                            background: selectedMood === 'Minimalist' ? 'white' : 
                                       selectedMood === 'Bold' ? `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` :
                                       selectedMood === 'Elegant' ? '#f8f5ff' :
                                       selectedMood === 'Playful' ? `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` :
                                       selectedMood === 'Modern' ? '#f1f7eb' : '#fff',
                            border: selectedMood === 'Minimalist' ? `1px solid ${primaryColor}30` : 'none',
                            padding: layoutStyle === 'Spacious' ? '2rem' : '1.5rem',
                          }}
                        >
                          {/* Add decorative geometric shapes */}
                          <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden opacity-10">
                            <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
                          </div>
                          <div className="absolute bottom-0 left-0 w-40 h-40 overflow-hidden opacity-10">
                            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{ backgroundColor: accentColor }}></div>
                          </div>
                          
                          {/* Add floating decorative elements */}
                          <div className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full opacity-20 animate-float-slow" style={{ backgroundColor: secondaryColor }}></div>
                          <div className="absolute bottom-1/4 left-1/3 w-8 h-8 rounded-full opacity-20 animate-float" style={{ backgroundColor: accentColor }}></div>
                          
                          {/* Add zigzag pattern */}
                          <div className="absolute right-10 top-10 opacity-20">
                            <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0L10 12L20 0L30 12L40 0L50 12L60 0" stroke={accentColor} strokeWidth="2"/>
                            </svg>
                          </div>
                          
                          <div className="p-4 sm:p-6 relative z-10">
                            {/* Minimalist mood elements */}
                            {selectedMood === 'Minimalist' && (
                              <div className="flex flex-col items-start">
                                <h2 
                                  className="text-2xl sm:text-3xl font-medium mb-3"
                                  style={{ 
                                    color: primaryColor,
                                    fontFamily: `var(--preview-font)`
                                  }}
                                >
                                  {/* Add gradient text effect */}
                                  <span className="relative">
                                    Welcome to <span className="relative">
                                      <span className="relative z-10">{storeName}</span>
                                      <span className="absolute bottom-0 left-0 w-full h-1 opacity-50" style={{ backgroundColor: accentColor }}></span>
                                    </span>
                                  </span>
                                </h2>
                                <p className="text-sm sm:text-base mb-4 text-gray-600 relative">
                                  {/* Add highlight effect on a word */}
                                  Discover our <span className="relative inline-block px-1">
                                    <span className="relative z-10">curated</span>
                                    <span className="absolute inset-0 -skew-x-6" style={{ backgroundColor: `${secondaryColor}25` }}></span>
                                  </span> collection of premium products
                                </p>
                                <button 
                                  className="px-4 py-2 rounded text-white mt-2 relative overflow-hidden group"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  {/* Add button animation effect */}
                                  <span className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-30 transition-opacity duration-300" style={{ 
                                    background: `linear-gradient(45deg, ${secondaryColor}, ${accentColor})` 
                                  }}></span>
                                  <span className="relative z-10 flex items-center gap-2">
                                    Shop Now 
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </span>
                                </button>
                              </div>
                            )}
                            
                            {/* Bold mood elements */}
                            {selectedMood === 'Bold' && (
                              <div className="flex flex-col items-center text-center">
                                <div 
                                  className="w-16 h-16 rounded-full mb-4 flex items-center justify-center border-4 border-white"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  {storeName.charAt(0)}
                                </div>
                                <h2 
                                  className="text-3xl sm:text-4xl font-bold mb-3 uppercase tracking-wider"
                                  style={{ 
                                    color: 'white',
                                    fontFamily: `var(--preview-font)`,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                                  }}
                                >
                                  {storeName}
                                </h2>
                                <p className="text-sm sm:text-base mb-4 text-white">
                                  Bold designs for bold personalities
                                </p>
                                <button 
                                  className="px-6 py-3 rounded-full text-black bg-white font-bold mt-2 shadow-lg"
                                >
                                  EXPLORE NOW
                                </button>
                              </div>
                            )}
                            
                            {/* Elegant mood elements */}
                            {selectedMood === 'Elegant' && (
                              <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-1 bg-[#18a77e] mb-6"></div>
                                <h2 
                                  className="text-2xl sm:text-3xl font-medium mb-3"
                                  style={{ 
                                    color: primaryColor,
                                    fontFamily: `var(--preview-font)`,
                                    letterSpacing: '1px'
                                  }}
                                >
                                  {storeName}
                                </h2>
                                <p 
                                  className="text-sm italic mb-4"
                                  style={{ color: primaryColor + 'aa' }}
                                >
                                  Refined elegance for the discerning customer
                                </p>
                                <button 
                                  className="px-6 py-2 border-2 mt-2 bg-transparent"
                                  style={{ borderColor: primaryColor, color: primaryColor }}
                                >
                                  Discover
                                </button>
                                <div className="w-16 h-1 bg-[#18a77e] mt-6"></div>
                              </div>
                            )}
                            
                            {/* Playful mood elements */}
                            {selectedMood === 'Playful' && (
                              <div className="relative">
                                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full" style={{ backgroundColor: primaryColor + '50' }}></div>
                                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full" style={{ backgroundColor: secondaryColor + '50' }}></div>
                                <div className="relative">
                                  <h2 
                                    className="text-2xl sm:text-3xl font-bold mb-3"
                                    style={{ 
                                      color: primaryColor,
                                      fontFamily: `var(--preview-font)`,
                                    }}
                                  >
                                    Welcome to {storeName}! ✨
                                  </h2>
                                  <p className="text-sm sm:text-base mb-4 text-gray-600">
                                    Fun and vibrant finds for everyday joy!
                                  </p>
                                  <button 
                                    className="px-4 py-2 rounded-full text-white mt-2"
                                    style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                                  >
                                    Let's Go! 🚀
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {/* Modern mood elements */}
                            {selectedMood === 'Modern' && (
                              <div className="flex flex-col">
                                <div className="w-20 h-1.5 mb-4" style={{ backgroundColor: primaryColor }}></div>
                                <h2 
                                  className="text-2xl sm:text-3xl font-medium mb-3"
                                  style={{ 
                                    color: primaryColor,
                                    fontFamily: `var(--preview-font)`
                                  }}
                                >
                                  {storeName}
                                </h2>
                                <p className="text-sm sm:text-base mb-4 text-gray-600">
                                  Contemporary designs for modern living
                                </p>
                                <button 
                                  className="px-4 py-2 mt-2 border-0 text-white flex items-center w-fit"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  <span>Explore Collections</span>
                                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            )}
                            
                            {/* Default for other moods */}
                            {!['Minimalist', 'Bold', 'Elegant', 'Playful', 'Modern'].includes(selectedMood) && (
                              <div>
                                <h2 
                                  className="text-2xl sm:text-3xl font-medium mb-3"
                                  style={{ 
                                    color: primaryColor,
                                    fontFamily: `var(--preview-font)`
                                  }}
                                >
                                  Welcome to {storeName}
                                </h2>
                                <p className="text-sm sm:text-base mb-4">
                                  Discover our curated collection of premium products
                                </p>
                                <button 
                                  className="px-4 py-2 rounded text-white"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  Shop Now
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Products Section with enhanced visuals */}
                        <div className="mb-12 relative">
                          {/* Add decorative shapes */}
                          <div className="absolute -top-10 right-20 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: secondaryColor }}></div>
                          <div className="absolute -bottom-10 left-10 w-16 h-16 rounded-lg opacity-10 rotate-12" style={{ backgroundColor: accentColor }}></div>
                          
                          <h3 
                            className="text-xl font-medium mb-6 relative inline-flex items-center"
                            style={{ color: primaryColor }}
                          >
                            {/* Decorative accent element */}
                            <span 
                              className="inline-block w-6 h-6 mr-2 rounded opacity-20"
                              style={{ backgroundColor: secondaryColor }}
                            ></span>
                            Featured Products
                            {/* Gradient line that extends from the text */}
                            <span 
                              className="ml-4 h-0.5 w-12 opacity-70 hidden md:block" 
                              style={{ background: `linear-gradient(to right, ${primaryColor}, transparent)` }}
                            ></span>
                          </h3>
                          
                          {products.length > 0 ? (
                            <div className={`grid ${
                              layoutStyle === 'Compact' ? 'grid-cols-2 md:grid-cols-4 gap-3' : 
                              layoutStyle === 'Spacious' ? 'grid-cols-1 md:grid-cols-3 gap-6' : 
                              'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
                            } relative`}>
                              {/* Decorative background grid */}
                              <div className="absolute inset-0 bg-grid opacity-5" style={{ 
                                backgroundImage: `radial-gradient(${secondaryColor}20 1px, transparent 1px)`,
                                backgroundSize: '20px 20px'
                              }}></div>
                              
                              {products.map((product, idx) => (
                                <div 
                                  key={product.id} 
                                  className={`${
                                    layoutStyle === 'Compact' ? 'border border-gray-100' :
                                    layoutStyle === 'Spacious' ? 'border-0 shadow-sm' :
                                    'border border-gray-100 hover:shadow-md'
                                  } rounded-lg overflow-hidden transition-all duration-300 relative group hover:-translate-y-1 cursor-pointer`}
                                  onClick={() => handlePreviewProductClick(product)}
                                >
                                  {/* Corner accent decorations */}
                                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden z-10">
                                    <div 
                                      className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-70 transform origin-top-right transition-transform duration-300 group-hover:scale-110" 
                                      style={{ backgroundColor: idx % 2 === 0 ? `${accentColor}30` : `${secondaryColor}30` }}
                                    ></div>
                                  </div>
                                  
                                  {/* Sale tag or "New" tag with accent colors */}
                                  {product.id.length % 3 === 0 && (
                                    <div 
                                      className="absolute top-3 left-0 z-10 px-2 py-1 text-xs font-bold text-white shadow-md"
                                      style={{ backgroundColor: secondaryColor }}
                                    >
                                      SALE
                                    </div>
                                  )}
                                  {product.id.length % 4 === 0 && !(product.id.length % 3 === 0) && (
                                    <div 
                                      className="absolute top-3 left-0 z-10 px-2 py-1 text-xs font-bold text-white shadow-md"
                                      style={{ backgroundColor: accentColor }}
                                    >
                                      NEW
                                    </div>
                                  )}
                                
                                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                    <img 
                                      src={product.image || generatePlaceholderImage(product.name)} 
                                      alt={product.name}
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                    />
                                    
                                    {/* Gradient overlay on hover */}
                                    <div 
                                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                      style={{ background: `linear-gradient(to top, rgba(0,0,0,0.3), transparent)` }}
                                    ></div>
                                    
                                    {/* Quick view button with accent gradient */}
                                    <div className="absolute bottom-4 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
                                      <div 
                                        className="px-4 py-2 rounded-full text-white text-sm shadow-lg flex items-center gap-2"
                                        style={{ background: `linear-gradient(to right, ${secondaryColor}, ${accentColor})` }}
                                      >
                                        <Eye className="w-4 h-4" />
                                        Quick View
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="p-3 bg-white relative">
                                    {/* Diagonal decorative accent */}
                                    <div className="absolute -top-2 left-1/4 w-0.5 h-4 transform -rotate-45 opacity-30" style={{ backgroundColor: accentColor }}></div>
                                    
                                    <h4 className="font-medium truncate" style={{ fontFamily: `var(--preview-font)` }}>
                                      {product.name}
                                    </h4>
                                    
                                    <div className="flex items-baseline mt-1">
                                      <span className="font-medium" style={{ color: primaryColor }}>
                                        ${product.price}
                                      </span>
                                      {product.comparePrice && (
                                        <span className="ml-2 text-xs line-through text-gray-400">
                                          ${product.comparePrice}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Color options indicators with accent-colored dots */}
                                    {product.colors && product.colors.length > 0 && (
                                      <div className="flex mt-2 gap-1">
                                        {product.colors.slice(0, 4).map((color, i) => (
                                          <div 
                                            key={i} 
                                            className="w-3 h-3 rounded-full border border-white shadow-sm"
                                            style={{ backgroundColor: color.hex }}
                                          ></div>
                                        ))}
                                        {product.colors.length > 4 && (
                                          <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                                        )}
                                      </div>
                                    )}
                                    
                                    {/* Add to cart icon with gradient */}
                                    <div className="absolute bottom-3 right-3">
                                      <div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                                        style={{ background: `linear-gradient(45deg, ${secondaryColor}, ${accentColor})` }}
                                      >
                                        <ShoppingCart className="w-4 h-4 text-white" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                              {[1, 2, 3, 4, 5, 6].map(i => (
                                <div 
                                  key={i} 
                                  className="border border-gray-100 rounded-lg overflow-hidden bg-gray-50 relative group hover:shadow-md transition-all duration-300"
                                >
                                  {/* Placeholder decorative corner */}
                                  <div className="absolute top-0 right-0 w-10 h-10 overflow-hidden">
                                    <div 
                                      className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-20"
                                      style={{ backgroundColor: i % 2 === 0 ? accentColor : secondaryColor }}
                                    ></div>
                                  </div>
                                  
                                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                                    {/* Animated loading gradient */}
                                    <div 
                                      className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] animate-shimmer"
                                    ></div>
                                  </div>
                                  <div className="p-3">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 relative overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] animate-shimmer"></div>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4 relative overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] animate-shimmer"></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Categories Section */}
                        {categories.length > 0 && (
                          <div className="mb-12 relative z-10">
                            <h3 
                              className="text-xl font-medium mb-6 relative inline-block"
                              style={{ color: primaryColor }}
                            >
                              {/* Add decorative accent bar */}
                              <div 
                                className="absolute -left-4 top-0 bottom-0 w-1.5 rounded-full" 
                                style={{ 
                                  background: `linear-gradient(to bottom, ${secondaryColor}, ${accentColor})` 
                                }}
                              ></div>
                              <span className="ml-1">Shop By Category</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {categories.map(cat => (
                                <div 
                                  key={cat.id}
                                  className="border border-gray-100 rounded-lg overflow-hidden h-40 relative bg-gray-100 group"
                                >
                                  {/* Decorative corner elements */}
                                  <div className="absolute top-0 left-0 w-8 h-8 opacity-60 rounded-br-xl z-10" style={{ backgroundColor: `${secondaryColor}30` }}></div>
                                  <div className="absolute bottom-0 right-0 w-8 h-8 opacity-60 rounded-tl-xl z-10" style={{ backgroundColor: `${accentColor}30` }}></div>
                                  
                                  <div 
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                                  >
                                    {/* Add decorative gradient line */}
                                    <div className="absolute left-4 right-4 h-px group-hover:h-0.5 transition-all" style={{ background: `linear-gradient(to right, ${secondaryColor}80, ${accentColor}80)` }}></div>
                                    
                                    <h4 
                                      className="text-xl font-medium text-white"
                                      style={{ fontFamily: `var(--preview-font)` }}
                                    >
                                      {cat.name}
                                    </h4>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Footer */}
                        <footer className="mt-16 pt-8 border-t border-gray-100 relative">
                          {/* Add decorative elements */}
                          <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, ${secondaryColor}50, ${accentColor}50, ${primaryColor}50)` }}></div>
                          <div className="absolute top-0 left-[20%] w-16 h-16 rounded-full -translate-y-1/2 blur-2xl opacity-30" style={{ backgroundColor: secondaryColor }}></div>
                          <div className="absolute top-0 right-[20%] w-16 h-16 rounded-full -translate-y-1/2 blur-2xl opacity-30" style={{ backgroundColor: accentColor }}></div>
                        
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="relative">
                              {/* Add decorative corner element */}
                              <div className="absolute -top-2 -left-2 w-8 h-8 rounded opacity-10" style={{ backgroundColor: secondaryColor }}></div>
                            
                              <h4 
                                className="font-medium mb-4 relative inline-block"
                                style={{ color: primaryColor }}
                              >
                                {/* Add underline animation effect */}
                                <span className="relative">
                                  {storeName}
                                  <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: accentColor }}></span>
                                </span>
                              </h4>
                              <p className="text-sm text-gray-500">
                                Providing high-quality products since 2023
                              </p>
                              
                              {/* Add social media icons with hover effects */}
                              <div className="flex gap-3 mt-4">
                                {['facebook', 'twitter', 'instagram'].map((social, i) => (
                                  <a 
                                    key={social} 
                                    href="#" 
                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                    style={{ 
                                      backgroundColor: i === 0 ? `${primaryColor}15` : 
                                                      i === 1 ? `${secondaryColor}15` : 
                                                      `${accentColor}15`,
                                      color: i === 0 ? primaryColor : 
                                             i === 1 ? secondaryColor : 
                                             accentColor
                                    }}
                                  >
                                    <span className="text-xs">{social[0].toUpperCase()}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-4 relative inline-block">
                                <span className="relative group">
                                  Shop
                                  <span className="absolute -bottom-1 left-0 w-full h-px transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ backgroundColor: secondaryColor, transformOrigin: 'left' }}></span>
                                </span>
                              </h4>
                              <ul className="space-y-2 text-sm">
                                {categories.map(cat => (
                                  <li key={cat.id}>
                                    <a href="#" className="text-gray-500 hover:text-[#18a77e] inline-block relative group">
                                      <span className="relative z-10">{cat.name}</span>
                                      <span className="absolute inset-0 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" style={{ backgroundColor: `${accentColor}10` }}></span>
                                    </a>
                                  </li>
                                ))}
                                {categories.length === 0 && (
                                  <>
                                    <li><a href="#" className="text-gray-500 hover:text-[#18a77e] inline-block relative group">
                                      <span className="relative z-10">All Products</span>
                                      <span className="absolute inset-0 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" style={{ backgroundColor: `${accentColor}10` }}></span>
                                    </a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-[#18a77e] inline-block relative group">
                                      <span className="relative z-10">Featured</span>
                                      <span className="absolute inset-0 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" style={{ backgroundColor: `${accentColor}10` }}></span>
                                    </a></li>
                                  </>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-4 relative inline-block">
                                <span className="relative group">
                                  Company
                                  <span className="absolute -bottom-1 left-0 w-full h-px transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ backgroundColor: secondaryColor, transformOrigin: 'left' }}></span>
                                </span>
                              </h4>
                              <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-500 hover:text-[#18a77e] inline-block relative group">
                                  <span className="relative z-10">About Us</span>
                                  <span className="absolute inset-0 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" style={{ backgroundColor: `${secondaryColor}10` }}></span>
                                </a></li>
                                <li><a href="#" className="text-gray-500 hover:text-[#18a77e] inline-block relative group">
                                  <span className="relative z-10">Contact</span>
                                  <span className="absolute inset-0 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" style={{ backgroundColor: `${secondaryColor}10` }}></span>
                                </a></li>
                                <li><a href="#" className="text-gray-500 hover:text-[#18a77e] inline-block relative group">
                                  <span className="relative z-10">Blog</span>
                                  <span className="absolute inset-0 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" style={{ backgroundColor: `${secondaryColor}10` }}></span>
                                </a></li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-4 relative inline-block">
                                <span className="relative group">
                                  Newsletter
                                  <span className="absolute -bottom-1 left-0 w-full h-px transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ backgroundColor: secondaryColor, transformOrigin: 'left' }}></span>
                                </span>
                              </h4>
                              <p className="text-sm text-gray-500 mb-3">Stay up to date with our latest products and offers.</p>
                              
                              <div className="flex relative">
                                <input 
                                  type="email" 
                                  placeholder="Your email" 
                                  className="w-full rounded-l-md border border-gray-200 focus:ring-0 focus:border-gray-300 text-sm py-2 px-3 bg-gray-50"
                                />
                                <button 
                                  className="rounded-r-md px-3 flex items-center justify-center"
                                  style={{ backgroundColor: accentColor }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                                  </svg>
                                </button>
                                
                                {/* Add focus effect */}
                                <div className="absolute -inset-0.5 rounded-md opacity-0 focus-within:opacity-100 transition-opacity" style={{ background: `linear-gradient(45deg, ${secondaryColor}40, ${accentColor}40)`, filter: 'blur(4px)' }}></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Add copyright section with decorative divider */}
                          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                            <div className="mb-4 sm:mb-0 flex items-center">
                              <div className="w-3 h-3 rounded-sm mr-2" style={{ background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})` }}></div>
                              <p>© 2023 {storeName}. All rights reserved.</p>
                            </div>
                            <div className="flex gap-4">
                              <a href="#" className="hover:text-[#18a77e] transition-colors">Privacy</a>
                              <a href="#" className="hover:text-[#18a77e] transition-colors">Terms</a>
                              <a href="#" className="hover:text-[#18a77e] transition-colors">Sitemap</a>
                            </div>
                          </div>
                        </footer>
                      </>
                    )}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              Create a category to organize your products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input 
                id="category-name" 
                placeholder="e.g., Clothing, Electronics" 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description (Optional)</Label>
              <Input 
                id="category-description" 
                placeholder="Describe your category" 
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={saveCategory}>
              {category ? 'Save Changes' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Conversion Dialog */}
      <Dialog open={showConversionDialog} onOpenChange={setShowConversionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
            <DialogDescription>
              To publish your store, please create an account or sign in
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowConversionDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={convertToRealStore}>
              Create Account & Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cart Modals */}
      <CartModal 
        showCart={showCart}
        setShowCart={setShowCart}
        cartItems={cartItems}
        primaryColor={primaryColor}
        removeFromCart={removeFromCart}
        updateCartItemQuantity={updateCartItemQuantity}
        calculateCartTotal={calculateCartTotal}
        proceedToCheckout={proceedToCheckout}
        setSelectedPreviewProduct={setSelectedPreviewProduct}
        generatePlaceholderImage={genPlaceholderImage}
      />
      
      <CheckoutModal 
        showCheckout={showCheckout}
        checkoutState={checkoutState}
        primaryColor={primaryColor}
        cartItems={cartItems}
        backToCart={backToCart}
        updateCheckoutField={updateCheckoutField}
        nextCheckoutStep={nextCheckoutStep}
        prevCheckoutStep={prevCheckoutStep}
        completeOrder={completeOrder}
        calculateCartTotal={calculateCartTotal}
      />
      
      <OrderCompleteModal 
        orderComplete={orderComplete}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        cartItems={cartItems}
        calculateCartTotal={calculateCartTotal}
        continueShopping={continueShopping}
      />
      
      {/* Product detail view */}
      {selectedPreviewProduct && fullPreviewMode && (
        <ProductDetail 
          product={selectedPreviewProduct}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          addToCart={addToCart}
          handleBackToProducts={handleBackToProducts}
          generatePlaceholderImage={genPlaceholderImage}
        />
      )}
    </Layout>
  );
};

export default Demo; 