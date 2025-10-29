import React from "react";
import PetSelection from "@/components/PetSelection";
import PetDetails from "@/components/PetDetails";
import PricingDisplay from "@/components/PricingDisplay";
import ProductSelection from "@/components/ProductSelection"; // New import
import { MadeWithDyad } from "@/components/made-with-dyad";

type FunnelStep = "petSelection" | "petDetails" | "pricingDisplay" | "productSelection" | "confirmation"; // Added new steps

interface ProductVariant {
  id: string;
  name: string;
  description: string;
  priceFactor: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = React.useState<FunnelStep>("petSelection");
  const [petType, setPetType] = React.useState<"cat" | "dog" | null>(null);
  const [breed, setBreed] = React.useState<string | null>(null);
  const [age, setAge] = React.useState<number | null>(null);
  const [basePrice, setBasePrice] = React.useState<number | null>(null); // New state for base price
  const [selectedProduct, setSelectedProduct] = React.useState<ProductVariant | null>(null); // New state for selected product
  const [finalPrice, setFinalPrice] = React.useState<number | null>(null); // New state for final price

  const handlePetSelection = (selectedPetType: "cat" | "dog") => {
    setPetType(selectedPetType);
    setCurrentStep("petDetails");
  };

  const handlePetDetailsSubmit = (selectedBreed: string, selectedAge: number) => {
    setBreed(selectedBreed);
    setAge(selectedAge);
    setCurrentStep("pricingDisplay");
  };

  const handleContinueToProductSelection = (price: number) => {
    setBasePrice(price);
    setCurrentStep("productSelection");
  };

  const handleProductSelection = (product: ProductVariant, price: number) => {
    setSelectedProduct(product);
    setFinalPrice(price);
    setCurrentStep("confirmation"); // Transition to a confirmation step (or just log for now)
  };

  const handleBackToDetails = () => {
    setBasePrice(null);
    setCurrentStep("petDetails");
  };

  const handleBackToPricing = () => {
    setSelectedProduct(null);
    setFinalPrice(null);
    setCurrentStep("pricingDisplay");
  };

  const handleResetFunnel = () => {
    setPetType(null);
    setBreed(null);
    setAge(null);
    setBasePrice(null);
    setSelectedProduct(null);
    setFinalPrice(null);
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
          onBack={handleResetFunnel} // Back from details goes to pet selection
        />
      )}

      {currentStep === "pricingDisplay" && petType && breed && age !== null && (
        <PricingDisplay
          petType={petType}
          breed={breed}
          age={age}
          onContinue={handleContinueToProductSelection}
          onBackToSelection={handleBackToDetails} // Back from pricing goes to pet details
        />
      )}

      {currentStep === "productSelection" && petType && breed && age !== null && basePrice !== null && (
        <ProductSelection
          petType={petType}
          breed={breed}
          age={age}
          basePrice={basePrice}
          onSelectProduct={handleProductSelection}
          onBack={handleBackToPricing} // Back from product selection goes to pricing display
        />
      )}

      {currentStep === "confirmation" && selectedProduct && finalPrice !== null && (
        <Card className="w-full max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-600">Congratulations!</CardTitle>
            <CardDescription>You've successfully configured your pet insurance plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              You selected the <strong className="text-primary">{selectedProduct.name}</strong> plan for your {petType} ({breed}, {age} years old).
            </p>
            <p className="text-2xl font-extrabold">Your monthly premium is: <span className="text-primary">${finalPrice.toFixed(2)}</span></p>
            <p className="text-sm text-muted-foreground">
              A confirmation email with your policy details has been sent.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleResetFunnel} className="w-full">
              Start a New Quote
            </Button>
          </CardFooter>
        </Card>
      )}

      <MadeWithDyad />
    </div>
  );
};

export default Index;