import { Fabric } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";

interface FabricListProps {
  fabrics: Fabric[];
  removeFabric: (code: string) => void;
}

export function FabricList({ fabrics, removeFabric }: FabricListProps) {
  return (
    <div className="space-y-4">
      {!fabrics?.length && (
        <div className="text-center py-10 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500">
            No fabric options added yet
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Add fabric options from the "Add Fabric" tab
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fabrics?.map((fabric) => (
          <Card key={fabric.code} className="overflow-hidden group">
            <div className="flex">
              <div className="w-1/3 relative aspect-square">
                <img 
                  src={fabric.swatch} 
                  alt={fabric.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
              </div>
              <CardContent className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{fabric.label}</h3>
                    <p className="text-sm text-gray-500">Code: {fabric.code}</p>
                    {fabric.upcharge > 0 && (
                      <p className="text-sm font-medium text-threadGold">
                        +{formatCurrency(fabric.upcharge)} upcharge
                      </p>
                    )}
                    {fabric.imgOverride && fabric.imgOverride.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Has custom product images
                      </p>
                    )}
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Fabric</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove "{fabric.label}" from this product? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeFabric(fabric.code)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 