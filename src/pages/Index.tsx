import React from "react";
import PetSelection from "@/components/PetSelection";
import PetDetails from "@/components/PetDetails";
import PriceCustomization from "@/components/PriceCustomization";
import ContactDetailsForm from "@/components/ContactDetailsForm";
import { MadeWithDyad } from "@/components/made-with-dyad";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { showSuccess, showError } from "@/utils/toast"; // Import toast functions

type FunnelStep = "petSelection" | "petDetails" | "priceCustomization" | "contactDetails" | "confirmation"; // Updated step names

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
  const [preexistingCoverage, setPreexistingCoverage] = React.useState<boolean>(false);
  const [worldwideCoverage, setWorldwideCoverage] = React.useState<boolean>(false);
  const [yearlyDeductible, setYearlyDeductible] = React.useState<number>(250);

  const { t } = useTranslation();

  const handlePetSelection = (selectedPetType: "cat" | "dog") => {
    setPetType(selectedPetType);
    setCurrentStep("petDetails");
  };

  const handlePetDetailsSubmit = async (selectedBreed: string, selectedAge: number) => {
    setBreed(selectedBreed);
    setAge(selectedAge);

    // Simulate API call for base price calculation
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate loading

      let calculatedBasePrice = 50;
      if (petType === "dog") {
        calculatedBasePrice += 20;
      } else {
        calculatedBasePrice += 10;
      }

      calculatedBasePrice += selectedAge * 5;

      if (selectedBreed.includes("Bulldog") || selectedBreed.includes("Sphynx")) {
        calculatedBasePrice += 15;
      }

      setBasePrice(calculatedBasePrice);
      showSuccess(t("common.priceCalculatedSuccess")); // New translation key
      setCurrentStep("priceCustomization");
    } catch (err) {
      console.error("Failed to calculate base price:", err);
      showError(t("common.errorCalculatingPrice")); // New translation key
    }
  };

  const handlePriceCustomizationSubmit = (
    product: ProductVariant,
    price: number,
    preexisting: boolean,
    worldwide: boolean,
    deductible: number
  ) => {
    setSelectedProduct(product);
    setFinalPrice(price);
    setPreexistingCoverage(preexisting);
    setWorldwideCoverage(worldwide);
    setYearlyDeductible(deductible);
    setCurrentStep("contactDetails");
  };

  const handleContactDetailsSubmit = (name: string, email: string, phone: string) => {
    setContactName(name);
    setContactEmail(email);
    setContactPhone(phone);

    // Log the data that would be sent to the server
    console.log("Data to be sent to server:", {
      petType,
      breed,
      age,
      selectedProduct,
      finalPrice,
      preexistingCoverage,
      worldwideCoverage,
      yearlyDeductible,
      contactName: name,
      contactEmail: email,
      contactPhone: phone,
    });

    setCurrentStep("confirmation");
  };

  const handleBackToDetails = () => {
    setBasePrice(null);
    setCurrentStep("petDetails");
  };

  const handleBackToPriceCustomization = () => {
    setContactName(null);
    setContactEmail(null);
    setContactPhone(null);
    setCurrentStep("priceCustomization");
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
    setPreexistingCoverage(false);
    setWorldwideCoverage(false);
    setYearlyDeductible(250);
    setCurrentStep("petSelection");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 relative">
      <LanguageSwitcher />

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

      {currentStep === "priceCustomization" && petType && breed && age !== null && basePrice !== null && (
        <PriceCustomization
          petType={petType}
          breed={breed}
          age={age}
          basePrice={basePrice}
          onCustomizeProduct={handlePriceCustomizationSubmit}
          onBack={handleBackToDetails}
          initialSelectedProduct={selectedProduct}
          initialPreexistingCoverage={preexistingCoverage}
          initialWorldwideCoverage={worldwideCoverage}
          initialYearlyDeductible={yearlyDeductible}
        />
      )}

      {currentStep === "contactDetails" && selectedProduct && finalPrice !== null && (
        <ContactDetailsForm
          onDetailsSubmit={handleContactDetailsSubmit}
          onBack={handleBackToPriceCustomization}
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
              <h3 className="text-xl font-semibold mt-4">{t("confirmation.coverageDetails")}</h3>
              <p><strong>{t("confirmation.planType")}</strong> {selectedProduct.name}</p>
              <p><strong>{t("confirmation.preexistingConditions")}</strong> {preexistingCoverage ? t("common.yes") : t("common.no")}</p>
              <p><strong>{t("common.worldwideCoverage")}</strong> {worldwideCoverage ? t("common.yes") : t("common.no")}</p>
              <p><strong>{t("common.yearlyDeductible")}</strong> ${yearlyDeductible.toFixed(2)}</p>
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