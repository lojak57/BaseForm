import { Product } from "@/context/CartContext";
import { categories } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoStepProps {
  product: Partial<Product>;
  updateField: (field: keyof Product, value: any) => void;
}

export function BasicInfoStep({ product, updateField }: BasicInfoStepProps) {
  return (
    <div className="space-y-4">
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
              updateField("id", slug);
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
    </div>
  );
} 