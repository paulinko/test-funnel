import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PetSelectionProps {
  onSelectPet: (petType: "cat" | "dog") => void;
  selectedPetType: "cat" | "dog" | null;
}

const PetSelection: React.FC<PetSelectionProps> = ({ onSelectPet, selectedPetType }) => {
  const [localSelectedPetType, setLocalSelectedPetType] = React.useState<"cat" | "dog" | null>(selectedPetType);

  const handleSelectionChange = (value: string) => {
    setLocalSelectedPetType(value as "cat" | "dog");
  };

  const handleSubmit = () => {
    if (localSelectedPetType) {
      onSelectPet(localSelectedPetType);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Pet Insurance Funnel</CardTitle>
        <CardDescription>Let's get started! What kind of pet do you have?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          onValueChange={handleSelectionChange}
          value={localSelectedPetType || ""}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dog" id="dog" />
            <Label htmlFor="dog" className="text-lg">Dog</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cat" id="cat" />
            <Label htmlFor="cat" className="text-lg">Cat</Label>
          </div>
        </RadioGroup>
        <Button onClick={handleSubmit} disabled={!localSelectedPetType} className="w-full">
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

export default PetSelection;