import { Button } from "@/components/ui/button";

interface WizardStepsProps {
  currentStep: number;
  stepTitles: string[];
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isEditing: boolean;
}

export function WizardSteps({
  currentStep,
  stepTitles,
  onNext,
  onPrevious,
  isLastStep,
  onSubmit,
  isEditing,
}: WizardStepsProps) {
  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {stepTitles.map((_, index) => (
            <div 
              key={index + 1}
              className={`rounded-full w-10 h-10 flex items-center justify-center ${
                index + 1 === currentStep ? "bg-threadGold text-white" : 
                index + 1 < currentStep ? "bg-green-100 text-green-800" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="text-center font-medium">
          {stepTitles[currentStep - 1]}
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        {!isLastStep ? (
          <Button onClick={onNext} className="bg-threadGold hover:bg-threadGold/90">
            Next
          </Button>
        ) : (
          <Button onClick={onSubmit} className="bg-threadGold hover:bg-threadGold/90">
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        )}
      </div>
    </>
  );
} 