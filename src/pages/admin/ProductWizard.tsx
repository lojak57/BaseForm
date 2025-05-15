import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductManagement } from "@/context/ProductManagementContext";
import { Product, Fabric } from "@/context/CartContext";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Wizard Steps
import { WizardSteps } from "@/components/admin/product-wizard/WizardSteps";
import { BasicInfoStep } from "@/components/admin/product-wizard/BasicInfoStep";
import { ImagesStep } from "@/components/admin/product-wizard/ImagesStep";
import { FabricStep } from "@/components/admin/product-wizard/FabricStep";

const STEP_TITLES = [
  "Basic Information",
  "Product Images",
  "Fabric Options"
];

// Helper function to create URL-friendly slugs
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
};

export default function ProductWizard() {
  const { addProduct, updateProduct, products, loading } = useProductManagement();
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditing = !!productId;
  
  // Default product description template
  const defaultDescription = "Handcrafted with care and attention to detail. This premium quality item is designed to be both functional and stylish. Made with high-quality materials that ensure durability and long-lasting performance.";
  
  // Basic product state
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState<Partial<Product>>({
    id: "",
    slug: "",
    name: "",
    price: 0,
    description: defaultDescription,
    categoryId: "",
    defaultImages: ["", "", ""],
    fabrics: [],
    hasFabricSelection: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load product data if editing
  useEffect(() => {
    if (isEditing && productId && products.length > 0) {
      const existingProduct = products.find(p => p.id === productId);
      if (existingProduct) {
        setProduct(existingProduct);
      } else {
        toast.error("Product not found");
        navigate("/admin/products");
      }
    }
  }, [isEditing, productId, products, navigate]);
  
  // Auto-generate slug when name changes
  useEffect(() => {
    if (product.name && !isEditing && !product.slug) {
      setProduct(prev => ({
        ...prev,
        slug: slugify(prev.name || '')
      }));
    }
  }, [product.name, isEditing]);
  
  const updateField = (field: keyof Product, value: any) => {
    setProduct(prev => ({ ...prev, [field]: value }));
    
    // If updating the name field, also update the slug (for new products only)
    if (field === 'name' && !isEditing) {
      setProduct(prev => ({
        ...prev,
        slug: slugify(value || '')
      }));
    }
  };
  
  const addFabric = (fabric: Fabric) => {
    setProduct(prev => ({
      ...prev,
      fabrics: [...(prev.fabrics || []), fabric]
    }));
    
    toast.success(`Added ${fabric.label} fabric option`);
  };
  
  const removeFabric = (code: string) => {
    setProduct(prev => ({
      ...prev,
      fabrics: (prev.fabrics || []).filter(f => f.code !== code)
    }));
  };
  
  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!product.name || !product.slug || !product.categoryId || !product.price || !product.description) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 2:
        if (!product.defaultImages?.length || 
            !product.defaultImages[0]) {
          toast.error("Please provide at least one product image");
          return false;
        }
        return true;
      default:
        return true;
    }
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      // If we're on the images step (step 2) and fabric selection is disabled,
      // skip step 3 (Fabric Options) and go straight to submission
      if (step === 2 && product.hasFabricSelection === false) {
        handleSubmit();
      } else {
        setStep(prev => prev + 1);
      }
    }
  };
  
  const handlePrevious = () => {
    setStep(prev => Math.max(1, prev - 1));
  };
  
  const handleSubmit = async () => {
    // Make sure we have all required data
    if (!product.name || !product.slug || 
        !product.categoryId || !product.price || 
        !product.description || !product.defaultImages?.length) {
      toast.error("Please complete all required fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Generate a UUID for new products if one doesn't exist already
      const productId = isEditing ? product.id : uuidv4();
      
      // Clean up the defaultImages array to remove empty strings
      const cleanedImages = product.defaultImages?.filter(img => img) || [];
      
      // Ensure hasFabricSelection is set correctly based on fabrics and user choice
      const hasFabrics = product.fabrics && product.fabrics.length > 0;
      
      // Prepare the final product object
      const finalProduct: Product = {
        id: productId!,
        name: product.name!,
        slug: slugify(product.slug || product.name || ''),
        categoryId: product.categoryId!,
        price: product.price!,
        description: product.description!,
        defaultImages: cleanedImages,
        fabrics: product.hasFabricSelection ? (product.fabrics || []) : [],
        hasFabricSelection: !!product.hasFabricSelection,
        source: product.source
      };
      
      // Submit to backend
      if (isEditing) {
        await updateProduct(finalProduct);
        toast.success("Product updated successfully");
      } else {
        await addProduct(finalProduct);
        toast.success("Product created successfully");
      }
      
      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state while fetching product data in edit mode
  if (isEditing && loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-threadGold" />
        <span className="ml-2">Loading product data...</span>
      </div>
    );
  }
  
  // Check if we should show the Fabric step based on product settings
  const showFabricStep = product.hasFabricSelection !== false;
  
  // Determine if current step is the last step
  const isLastStep = showFabricStep ? step === STEP_TITLES.length : step === 2;
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold font-playfair mb-6">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h1>
      
      <WizardSteps
        currentStep={step}
        stepTitles={showFabricStep ? STEP_TITLES : STEP_TITLES.slice(0, 2)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLastStep={isLastStep}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />
      
      {/* Step content */}
      {step === 1 && (
        <BasicInfoStep 
          product={product} 
          updateField={updateField}
        />
      )}
      
      {step === 2 && (
        <ImagesStep
          product={product}
          updateField={updateField}
        />
      )}
      
      {step === 3 && showFabricStep && (
        <FabricStep
          product={product}
          addFabric={addFabric}
          removeFabric={removeFabric}
          updateField={updateField}
        />
      )}
    </div>
  );
}
