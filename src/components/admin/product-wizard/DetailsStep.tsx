import { Product } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DetailsStepProps {
  product: Partial<Product>;
  updateField: (field: keyof Product, value: any) => void;
}

export function DetailsStep({ product, updateField }: DetailsStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="price">Base Price* ($)</Label>
        <Input 
          id="price"
          type="number"
          min="0"
          value={product.price || ""}
          onChange={(e) => updateField("price", Number(e.target.value))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Product Description*</Label>
        <Textarea 
          id="description"
          rows={6}
          value={product.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hasFabricSelection"
          checked={product.hasFabricSelection}
          onChange={(e) => updateField("hasFabricSelection", e.target.checked)}
        />
        <Label htmlFor="hasFabricSelection">This product has fabric selection options</Label>
      </div>
    </div>
  );
} 