import React from "react";
import PetSelection from "@/components/PetSelection";
import PetDetails from "@/components/PetDetails";
import PricingDisplay from "@/components/PricingDisplay";
import ProductSelection from "@/components/ProductSelection";
import ContactDetailsForm from "@/components/ContactDetailsForm";
import { MadeWithDyad } from "@/components/made-with-dyad";
import LanguageSwitcher from "@/components/LanguageSwitcher"; // New import
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next"; // New import

type FunnelStep = "petSelection" | "petDetails" | "pricingDisplay" | "productSelection" | "contactDetails" | "confirmation";

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
  const [basePrice, setBasePrice] = React.useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductVariant | null>(null);
  const [finalPrice, setFinalPrice] = React.useState<number | null>(null);
  const [contactName, setContactName] = React.useState<string | null>(null);
  const [contactEmail, setContactEmail] = React.useState<string | null>(null);
  const [contactPhone, setContactPhone] = React.useState<string | null>(null);
  const { t } = useTranslation(); // New: useTranslation hook

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
    setCurrentStep("contactDetails");
  };

  const handleContactDetailsSubmit = (name: string, email: string, phone: string) => {
    setContactName(name);
    setContactEmail(email);
    setContactPhone(phone);
    setCurrentStep("confirmation");
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

  const handleBackToProductSelection = () => {
    setContactName(null);
    setContactEmail(null);
    setContactPhone(null);
    setCurrentStep("productSelection");
  };

  const handleResetFunnel = () => {
    setPetType(null);
    setBreed(null);
    setAge(null);
    setBasePrice(null);
    setSelectedProduct(null);
    setFinalPrice(null);
    setContactName(null);
    setContactEmail(null);
    setContactPhone(null);
    setCurrentStep("petSelection");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 relative"> {/* Added relative for LanguageSwitcher positioning */}
      <LanguageSwitcher /> {/* New: Language switcher */}

      {currentStep === "petSelection" && (
        <PetSelection onSelectPet={handlePetSelection} selectedPetType={petType} />
      )}

      {currentStep === "petDetails" && petType && (
        <PetDetails
          petType={petType}
          onDetailsSubmit={handlePetDetailsSubmit}
          onBack={handleResetFunnel}
        />
      )}

      {currentStep === "pricingDisplay" && petType && breed && age !== null && (
        <PricingDisplay
          petType={petType}
          breed={breed}
          age={age}
          onContinue={handleContinueToProductSelection}
          onBackToSelection={handleBackToDetails}
        />
      )}

      {currentStep === "productSelection" && petType && breed && age !== null && basePrice !== null && (
        <ProductSelection
          petType={petType}
          breed={breed}
          age={age}
          basePrice={basePrice}
          onSelectProduct={handleProductSelection}
          onBack={handleBackToPricing}
        />
      )}

      {currentStep === "contactDetails" && selectedProduct && finalPrice !== null && (
        <ContactDetailsForm
          onDetailsSubmit={handleContactDetailsSubmit}
          onBack={handleBackToProductSelection}
          initialName={contactName || ""}
          initialEmail={contactEmail || ""}
          initialPhone={contactPhone || ""}
        />
      )}

      {currentStep === "confirmation" && selectedProduct && finalPrice !== null && contactName && contactEmail && (
        <Card className="w-full max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-600">{t("confirmation.title")}</CardTitle>
            <CardDescription>{t("confirmation.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg" dangerouslySetInnerHTML={{
              __html: t("confirmation.planSummary", {
                productName: selectedProduct.name,
                petType: petType,
                breed: breed,
                age: age
              })
            }} />
            <p className="text-2xl font-extrabold">{t("confirmation.monthlyPremium")} <span className="text-primary">${finalPrice.toFixed(2)}</span></p>
            <div className="border-t pt-4 space-y-2 text-left">
              <h3 className="text-xl font-semibold">{t("confirmation.yourDetails")}</h3>
              <p><strong>{t("confirmation.name")}</strong> {contactName}</p>
              <p><strong>{t("confirmation.email")}</strong> {contactEmail}</p>
              {contactPhone && <p><strong>{t("confirmation.phone")}</strong> {contactPhone}</p>}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t("confirmation.confirmationEmailSent", { email: contactEmail })}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleResetFunnel} className="w-full">
              {t("confirmation.startNewQuote")}
            </Button>
          </CardFooter>
        </Card>
      )}

      <MadeWithDyad />
    </div>
  );
};

export default Index;