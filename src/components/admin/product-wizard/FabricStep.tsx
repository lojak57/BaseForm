import { Fabric, Product } from "@/context/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FabricForm } from "./FabricForm";
import { FabricList } from "./FabricList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface FabricStepProps {
  product: Partial<Product>;
  addFabric: (fabric: Fabric) => void;
  removeFabric: (code: string) => void;
  updateField: (field: keyof Product, value: any) => void;
}

export function FabricStep({ product, addFabric, removeFabric, updateField }: FabricStepProps) {
  const hasFabricSelection = product.hasFabricSelection === true;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="fabricSelectionToggle" 
          checked={hasFabricSelection}
          onCheckedChange={(checked) => updateField("hasFabricSelection", checked)}
        />
        <Label htmlFor="fabricSelectionToggle" className="cursor-pointer">
          Enable fabric selection for this product
        </Label>
      </div>
      
      {!hasFabricSelection && (
        <Alert className="bg-blue-50 text-blue-800 border-blue-200 mb-4">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>
            Fabric selection is disabled for this product. A default fabric option will be created automatically.
          </AlertDescription>
        </Alert>
      )}
      
      {hasFabricSelection && (
        <Tabs defaultValue="view">
          <TabsList className="mb-4">
            <TabsTrigger value="view">View Fabrics</TabsTrigger>
            <TabsTrigger value="add">Add Fabric</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view">
            <FabricList 
              fabrics={product.fabrics || []} 
              removeFabric={removeFabric} 
            />
          </TabsContent>
          
          <TabsContent value="add">
            <FabricForm addFabric={addFabric} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 