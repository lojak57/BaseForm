import { Fabric } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FabricListProps {
  fabrics: Fabric[];
  removeFabric: (code: string) => void;
}

export function FabricList({ fabrics, removeFabric }: FabricListProps) {
  return (
    <div className="space-y-4">
      {!fabrics?.length && (
        <p className="text-center py-8 text-gray-500">
          No fabric options added yet
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fabrics?.map((fabric) => (
          <Card key={fabric.code} className="overflow-hidden">
            <div className="flex">
              <div className="w-1/3">
                <img 
                  src={fabric.swatch} 
                  alt={fabric.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
              </div>
              <CardContent className="pt-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{fabric.label}</h3>
                    <p className="text-sm text-gray-500">Code: {fabric.code}</p>
                    <p className="text-sm">
                      {fabric.upcharge > 0 ? `+$${fabric.upcharge} upcharge` : "No upcharge"}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFabric(fabric.code)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 