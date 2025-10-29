import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Dog, Cat } from "lucide-react"; // Import icons
import { cn } from "@/lib/utils"; // Import cn for conditional class names

interface PetSelectionProps {
  onSelectPet: (petType: "cat" | "dog") => void;
  selectedPetType: "cat" | "dog" | null;
}

const PetSelection: React.FC<PetSelectionProps> = ({ onSelectPet, selectedPetType }) => {
  const [localSelectedPetType, setLocalSelectedPetType] = React.useState<"cat" | "dog" | null>(selectedPetType);
  const { t } = useTranslation();

  const handleSelection = (value: "cat" | "dog") => {
    setLocalSelectedPetType(value);
  };

  const handleSubmit = () => {
    if (localSelectedPetType) {
      onSelectPet(localSelectedPetType);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t("petSelection.title")}</CardTitle>
        <CardDescription>{t("petSelection.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div
            className={cn(
              "flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-colors",
              localSelectedPetType === "dog"
                ? "border-primary ring-2 ring-primary bg-primary/10"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}
            onClick={() => handleSelection("dog")}
          >
            <Dog className="h-12 w-12 mb-2 text-primary" />
            <Label className="text-lg font-medium cursor-pointer">{t("petSelection.dog")}</Label>
          </div>
          <div
            className={cn(
              "flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-colors",
              localSelectedPetType === "cat"
                ? "border-primary ring-2 ring-primary bg-primary/10"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}
            onClick={() => handleSelection("cat")}
          >
            <Cat className="h-12 w-12 mb-2 text-primary" />
            <Label className="text-lg font-medium cursor-pointer">{t("petSelection.cat")}</Label>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={!localSelectedPetType} className="w-full">
          {t("petSelection.next")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PetSelection;