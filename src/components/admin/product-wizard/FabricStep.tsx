import { Fabric, Product } from "@/context/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FabricForm } from "./FabricForm";
import { FabricList } from "./FabricList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FabricStepProps {
  product: Partial<Product>;
  addFabric: (fabric: Fabric) => void;
  removeFabric: (code: string) => void;
  updateField: (field: keyof Product, value: any) => void;
}

export function FabricStep({ product, addFabric, removeFabric, updateField }: FabricStepProps) {
  const hasFabricSelection = product.hasFabricSelection === true;
  const fabricCount = product.fabrics?.length || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="fabricSelectionToggle" 
            checked={hasFabricSelection}
            onCheckedChange={(checked) => updateField("hasFabricSelection", checked)}
          />
          <Label htmlFor="fabricSelectionToggle" className="cursor-pointer">
            Enable fabric selection for this product
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80 text-sm">When enabled, customers can choose from multiple fabric options. 
                When disabled, a default fabric will be automatically selected.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {hasFabricSelection && fabricCount > 0 && (
          <Badge variant="outline" className="ml-2">
            {fabricCount} {fabricCount === 1 ? "Fabric" : "Fabrics"} Selected
          </Badge>
        )}
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
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="view" className="flex-1">
              View Selected Fabrics {fabricCount > 0 && `(${fabricCount})`}
            </TabsTrigger>
            <TabsTrigger value="add" className="flex-1">
              Add Fabric from Catalog
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view">
            {fabricCount === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                <p className="text-gray-500 mb-2">No fabrics have been added yet</p>
                <p className="text-sm text-gray-400">Click the "Add Fabric from Catalog" tab to select fabrics</p>
              </div>
            ) : (
              <FabricList 
                fabrics={product.fabrics || []} 
                removeFabric={removeFabric} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="add">
            <FabricForm addFabric={addFabric} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 