
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductManagement } from "@/context/ProductManagementContext";
import { Product, Fabric } from "@/context/CartContext";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

// Wizard Steps
import { WizardSteps } from "@/components/admin/product-wizard/WizardSteps";
import { BasicInfoStep } from "@/components/admin/product-wizard/BasicInfoStep";
import { DetailsStep } from "@/components/admin/product-wizard/DetailsStep";
import { ImagesStep } from "@/components/admin/product-wizard/ImagesStep";
import { FabricStep } from "@/components/admin/product-wizard/FabricStep";

const STEP_TITLES = [
  "Basic Information",
  "Product Details",
  "Product Images",
  "Fabric Options"
];

export default function ProductWizard() {
  const { addProduct, updateProduct, products, loading } = useProductManagement();
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditing = !!productId;
  
  // Basic product state
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState<Partial<Product>>({
    id: "",
    slug: "",
    name: "",
    price: 0,
    description: "",
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
  
  const updateField = (field: keyof Product, value: any) => {
    setProduct(prev => ({ ...prev, [field]: value }));
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
        if (!product.name || !product.slug || !product.categoryId) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 2:
        if (!product.price || !product.description) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 3:
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
      setStep(prev => prev + 1);
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
      if (!isEditing && !product.id) {
        product.id = crypto.randomUUID();
      }
      
      // Cast to full Product type since we've validated all fields
      if (isEditing) {
        await updateProduct(product as Product);
      } else {
        await addProduct(product as Product);
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error("Error saving product");
      console.error(error);
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
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold font-playfair mb-6">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h1>
      
      <WizardSteps
        currentStep={step}
        stepTitles={STEP_TITLES}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLastStep={step === STEP_TITLES.length}
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
        <DetailsStep
          product={product}
          updateField={updateField}
        />
      )}
      
      {step === 3 && (
        <ImagesStep
          product={product}
          updateField={updateField}
        />
      )}
      
      {step === 4 && (
        <FabricStep
          product={product}
          addFabric={addFabric}
          removeFabric={removeFabric}
        />
      )}
      
      <div className="mt-10">
        <WizardSteps
          currentStep={step}
          stepTitles={STEP_TITLES}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isLastStep={step === STEP_TITLES.length}
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
        
        {isSubmitting && (
          <div className="flex justify-center items-center mt-4">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Saving product...</span>
          </div>
        )}
      </div>
    </div>
  );
}
