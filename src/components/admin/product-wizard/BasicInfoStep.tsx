import { Product } from "@/context/CartContext";
import { categories } from "@/data/categories";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

interface BasicInfoStepProps {
  product: Partial<Product>;
  updateField: (field: keyof Product, value: any) => void;
}

export function BasicInfoStep({ product, updateField }: BasicInfoStepProps) {
  // Helper to check if product has fabric options
  const hasFabrics = product.fabrics && product.fabrics.length > 0;
  const hasFabricSelection = product.hasFabricSelection === true;

  // Set hasFabricSelection to false by default for new products
  useEffect(() => {
    // Only set default if it's a new product (doesn't have an id) and hasFabricSelection is undefined
    if (!product.id && product.hasFabricSelection === undefined) {
      updateField("hasFabricSelection", false);
    }
  }, [product.id, product.hasFabricSelection, updateField]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Product Details</h3>
          
          <div>
            <Label htmlFor="name">Product Name*</Label>
            <Input 
              id="name"
              value={product.name || ""}
              onChange={(e) => {
                updateField("name", e.target.value);
                // Auto-generate slug and ID whenever the name changes
                if (e.target.value) {
                  const slug = e.target.value
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_-]+/g, "-");
                  
                  updateField("slug", slug);
                }
              }}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              A unique identifier will be auto-generated from the product name
            </p>
          </div>
          
          <div>
            <Label htmlFor="category">Category*</Label>
            <Select 
              value={product.categoryId || ""} 
              onValueChange={(value) => updateField("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price* ($)</Label>
            <Input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={product.price || ""}
              onChange={(e) => updateField("price", parseFloat(e.target.value))}
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Product Options</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hasFabricSelection" 
              checked={hasFabricSelection}
              onCheckedChange={(checked) => updateField("hasFabricSelection", checked)}
            />
            <Label htmlFor="hasFabricSelection" className="cursor-pointer">
              Enable fabric selection for this product
            </Label>
          </div>
          
          {hasFabricSelection && !hasFabrics && (
            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Attention needed</AlertTitle>
              <AlertDescription>
                You've enabled fabric selection, but no fabric options have been added yet. 
                Make sure to add fabric options in step 3, or customers won't be able to purchase this product.
              </AlertDescription>
            </Alert>
          )}

          {!hasFabricSelection && (
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                A default fabric option will be automatically created for this product to ensure it can be purchased.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="description">Product Description*</Label>
          <span className="text-sm text-gray-500">
            Min. 20 characters
          </span>
        </div>
        <Textarea 
          id="description"
          rows={6}
          value={product.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          required
          className="min-h-[150px]"
        />
        <div className="mt-2 text-sm text-gray-500 flex items-start">
          <Info className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
          <p>
            Write a compelling description that highlights the features, materials, and benefits of your product.
            Good descriptions improve sales and help customers make informed decisions.
          </p>
        </div>
      </div>
    </div>
  );
} 