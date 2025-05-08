
import { useState } from "react";
import { Fabric } from "@/context/CartContext";

interface VariantSelectorProps {
  fabrics: Fabric[];
  basePrice: number;
  onSelect: (fabricCode: string, price: number) => void;
  defaultSelected?: string;
}

const VariantSelector = ({ 
  fabrics, 
  basePrice, 
  onSelect,
  defaultSelected = ""
}: VariantSelectorProps) => {
  const [selectedFabric, setSelectedFabric] = useState(defaultSelected || fabrics[0].code);

  const handleSelect = (fabricCode: string) => {
    setSelectedFabric(fabricCode);
    const selectedFabricObj = fabrics.find(f => f.code === fabricCode);
    if (selectedFabricObj) {
      onSelect(fabricCode, basePrice + selectedFabricObj.upcharge);
    }
  };

  return (
    <div>
      <h3 className="text-darkText font-medium mb-3">Select Fabric</h3>
      <div className="flex flex-wrap gap-3">
        {fabrics.map((fabric) => {
          const isSelected = fabric.code === selectedFabric;
          const fabricPrice = basePrice + fabric.upcharge;
          
          return (
            <div key={fabric.code} className="flex flex-col items-center">
              <button
                type="button"
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                  isSelected
                    ? "border-threadGold shadow-md scale-110"
                    : "border-transparent hover:border-threadGold/50"
                }`}
                onClick={() => handleSelect(fabric.code)}
                aria-label={`Select ${fabric.label} fabric`}
              >
                <img
                  src={fabric.swatch}
                  alt={fabric.label}
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">{fabric.label}</p>
                {fabric.upcharge > 0 && (
                  <p className="text-xs text-threadGold">+${fabric.upcharge}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
