import React from "react";
import PetSelection from "@/components/PetSelection";
import PetDetails from "@/components/PetDetails";
import PricingDisplay from "@/components/PricingDisplay";
import { MadeWithDyad } from "@/components/made-with-dyad";

type FunnelStep = "petSelection" | "petDetails" | "pricingDisplay";

const Index = () => {
  const [currentStep, setCurrentStep] = React.useState<FunnelStep>("petSelection");
  const [petType, setPetType] = React.useState<"cat" | "dog" | null>(null);
  const [breed, setBreed] = React.useState<string | null>(null);
  const [age, setAge] = React.useState<number | null>(null);

  const handlePetSelection = (selectedPetType: "cat" | "dog") => {
    setPetType(selectedPetType);
    setCurrentStep("petDetails");
  };

  const handlePetDetailsSubmit = (selectedBreed: string, selectedAge: number) => {
    setBreed(selectedBreed);
    setAge(selectedAge);
    setCurrentStep("pricingDisplay");
  };

  const handleBackToSelection = () => {
    setPetType(null);
    setBreed(null);
    setAge(null);
    setCurrentStep("petSelection");
  };

  const handleResetFunnel = () => {
    setPetType(null);
    setBreed(null);
    setAge(null);
    setCurrentStep("petSelection");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      {currentStep === "petSelection" && (
        <PetSelection onSelectPet={handlePetSelection} selectedPetType={petType} />
      )}

      {currentStep === "petDetails" && petType && (
        <PetDetails
          petType={petType}
          onDetailsSubmit={handlePetDetailsSubmit}
          onBack={handleBackToSelection}
        />
      )}

      {currentStep === "pricingDisplay" && petType && breed && age !== null && (
        <PricingDisplay
          petType={petType}
          breed={breed}
          age={age}
          onReset={handleResetFunnel}
        />
      )}

      <MadeWithDyad />
    </div>
  );
};

export default Index;