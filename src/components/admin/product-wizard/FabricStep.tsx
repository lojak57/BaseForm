import { Fabric, Product } from "@/context/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FabricForm } from "./FabricForm";
import { FabricList } from "./FabricList";

interface FabricStepProps {
  product: Partial<Product>;
  addFabric: (fabric: Fabric) => void;
  removeFabric: (code: string) => void;
}

export function FabricStep({ product, addFabric, removeFabric }: FabricStepProps) {
  return (
    <div>
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
    </div>
  );
} 