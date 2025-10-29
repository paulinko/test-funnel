import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { showError, showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import PriceSummaryBanner from "./PriceSummaryBanner"; // Import the new banner component

interface ProductVariant {
  id: string;
  name: string;
  description: string;
  priceFactor: number; // Multiplier for base price
}

interface PriceCustomizationProps {
  petType: "cat" | "dog";
  breed: string;
  age: number;
  basePrice: number;
  onCustomizeProduct: (
    product: ProductVariant,
    finalPrice: number,
    preexistingCoverage: boolean,
    worldwideCoverage: boolean,
    yearlyDeductible: number,
    coPayCoveragePercentage: number // New parameter
  ) => void;
  onBack: () => void;
  initialSelectedProduct?: ProductVariant | null;
  initialPreexistingCoverage?: boolean;
  initialWorldwideCoverage?: boolean;
  initialYearlyDeductible?: number;
  initialCoPayCoveragePercentage?: number; // New prop
}

const productVariants: ProductVariant[] = [
  {
    id: "basic",
    name: "Basic Plan",
    description: "Covers accidents and illnesses. Essential care for your pet.",
    priceFactor: 1.0,
  },
  {
    id: "standard",
    name: "Standard Plan",
    description: "Includes Basic Plan plus routine wellness exams and vaccinations.",
    priceFactor: 1.3,
  },
  {
    id: "premium",
    name: "Premium Plan",
    description: "Comprehensive coverage including dental care and behavioral therapy.",
    priceFactor: 1.7,
  },
];

const deductibleOptions = [0, 150, 300, 500, 1000]; // New deductible options
const coPayCoverageOptions = [100, 80]; // 100% or 80% coverage

const PriceCustomization: React.FC<PriceCustomizationProps> = ({
  petType,
  breed,
  age,
  basePrice,
  onCustomizeProduct,
  onBack,
  initialSelectedProduct = productVariants[0], // Default to basic if not provided
  initialPreexistingCoverage = false,
  initialWorldwideCoverage = false,
  initialYearlyDeductible = 300, // Default to 300 for recommended option
  initialCoPayCoveragePercentage = 100, // Default to 100% coverage
}) => {
  const { t } = useTranslation();
  const [selectedProductId, setSelectedProductId] = React.useState<string>(initialSelectedProduct?.id || productVariants[0].id);
  const [preexistingCoverage, setPreexistingCoverage] = React.useState<boolean>(initialPreexistingCoverage);
  const [worldwideCoverage, setWorldwideCoverage] = React.useState<boolean>(initialWorldwideCoverage);
  const [yearlyDeductible, setYearlyDeductible] = React.useState<number>(initialYearlyDeductible);
  const [coPayCoveragePercentage, setCoPayCoveragePercentage] = React.useState<number>(initialCoPayCoveragePercentage); // New state

  const calculateFinalPrice = React.useCallback(() => {
    const selectedProduct = productVariants.find(p => p.id === selectedProductId);
    if (!selectedProduct) return 0;

    let currentPrice = basePrice * selectedProduct.priceFactor;

    // Add-on costs
    if (preexistingCoverage) {
      currentPrice += 20; // Example cost for preexisting condition coverage
    }
    if (worldwideCoverage) {
      currentPrice += 15; // Example cost for worldwide coverage
    }

    // Deductible impact (higher deductible, lower premium)
    const deductibleAdjustments: { [key: number]: number } = {
      0: 30,   // Highest premium for 0 deductible
      150: 20,
      300: 10, // Base adjustment for recommended
      500: -10,
      1000: -30 // Lowest premium for 1000 deductible
    };
    currentPrice += deductibleAdjustments[yearlyDeductible] || 0;

    // Co-pay coverage impact (lower coverage percentage, lower premium)
    const coPayAdjustments: { [key: number]: number } = {
      100: 25, // Higher premium for 100% coverage (0% co-pay)
      80: 0,   // Base premium for 80% coverage (20% co-pay)
    };
    currentPrice += coPayAdjustments[coPayCoveragePercentage] || 0;

    return Math.max(5, currentPrice); // Ensure price is not negative or too low
  }, [basePrice, selectedProductId, preexistingCoverage, worldwideCoverage, yearlyDeductible, coPayCoveragePercentage]);

  const currentFinalPrice = calculateFinalPrice();

  const handleSubmit = () => {
    const selectedProduct = productVariants.find(p => p.id === selectedProductId);
    if (!selectedProduct) {
      showError(t("priceCustomization.validation.selectProductVariant"));
      return;
    }
    onCustomizeProduct(selectedProduct, currentFinalPrice, preexistingCoverage, worldwideCoverage, yearlyDeductible, coPayCoveragePercentage);
    showSuccess(t("priceCustomization.successToast", { productName: selectedProduct.name }));
  };

  // Dynamic example calculation for deductible and co-pay impact
  const exampleVetCost = 490; // CHF
  const coPayPercentage = (100 - coPayCoveragePercentage) / 100; // Derived from coPayCoveragePercentage

  const deductibleApplied = Math.min(yearlyDeductible, exampleVetCost);
  const remainingAfterDeductible = Math.max(0, exampleVetCost - deductibleApplied);
  const yourCoPay = parseFloat((remainingAfterDeductible * coPayPercentage).toFixed(2));
  const insurancePays = parseFloat((remainingAfterDeductible - yourCoPay).toFixed(2));
  const yourPetName = t(`common.your${petType === "cat" ? "Cat" : "Dog"}`); // e.g., "your cat" or "your dog"

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto mb-24"> {/* Added mb-24 for banner clearance */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{t("priceCustomization.title")}</CardTitle>
          <CardDescription>{t("priceCustomization.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Product Variant Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RadioGroup onValueChange={setSelectedProductId} value={selectedProductId} className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {productVariants.map((variant) => (
                <Card
                  key={variant.id}
                  className={cn(
                    "relative p-6 flex flex-col justify-between items-start border-2 cursor-pointer transition-all duration-200",
                    selectedProductId === variant.id ? "border-primary ring-2 ring-primary" : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  )}
                  onClick={() => setSelectedProductId(variant.id)}
                >
                  <RadioGroupItem value={variant.id} id={variant.id} className="absolute top-4 right-4" />
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xl font-semibold">{variant.name}</CardTitle>
                    <CardDescription>{variant.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-4xl font-extrabold text-primary">${(basePrice * variant.priceFactor).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{t("priceCustomization.startingMonthly")}</p>
                  </CardContent>
                  <Label htmlFor={variant.id} className="absolute inset-0 cursor-pointer"></Label>
                </Card>
              ))}
            </RadioGroup>
          </div>

          {/* Add-on Coverages */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-2xl font-bold text-center">{t("priceCustomization.customizeYourPlan")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="preexisting-coverage" className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t("priceCustomization.preexistingConditions")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("priceCustomization.preexistingConditionsDescription")}
                  </p>
                </div>
                <Switch
                  id="preexisting-coverage"
                  checked={preexistingCoverage}
                  onCheckedChange={setPreexistingCoverage}
                />
              </Card>

              <Card className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="worldwide-coverage" className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t("priceCustomization.worldwideCoverage")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("priceCustomization.worldwideCoverageDescription")}
                  </p>
                </div>
                <Switch
                  id="worldwide-coverage"
                  checked={worldwideCoverage}
                  onCheckedChange={setWorldwideCoverage}
                />
              </Card>
            </div>
          </div>

          {/* Yearly Deductible - Updated to selectable badges */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-2xl font-bold text-center">{t("priceCustomization.adjustDeductible")}</h3>
            <Card className="p-6 space-y-4">
              <Label className="text-lg font-medium block mb-4">
                {t("priceCustomization.yearlyDeductible")}
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {deductibleOptions.map((deductible) => (
                  <div key={deductible} className="flex flex-col items-center">
                    <Button
                      variant={yearlyDeductible === deductible ? "default" : "outline"}
                      onClick={() => setYearlyDeductible(deductible)}
                      className={cn(
                        "w-full py-4 text-lg font-semibold",
                        yearlyDeductible === deductible ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                      )}
                    >
                      CHF {deductible}
                    </Button>
                    {deductible === 300 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {t("priceCustomization.recommended")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {t("priceCustomization.deductibleInfo")}
              </p>
            </Card>
          </div>

          {/* Co-pay Coverage (Kostenübernahme) - New Section */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-2xl font-bold text-center">{t("priceCustomization.adjustCoPayCoverage")}</h3>
            <Card className="p-6 space-y-4">
              <Label className="text-lg font-medium block mb-4">
                {t("priceCustomization.coPayCoverage")}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {coPayCoverageOptions.map((coverage) => (
                  <div key={coverage} className="flex flex-col items-center">
                    <Button
                      variant={coPayCoveragePercentage === coverage ? "default" : "outline"}
                      onClick={() => setCoPayCoveragePercentage(coverage)}
                      className={cn(
                        "w-full py-4 text-lg font-semibold",
                        coPayCoveragePercentage === coverage ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                      )}
                    >
                      {coverage}%
                    </Button>
                    {coverage === 100 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {t("priceCustomization.fullCoverage")}
                      </span>
                    )}
                    {coverage === 80 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {t("priceCustomization.standardCoverage")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {t("priceCustomization.coPayCoverageInfo")}
              </p>
            </Card>
          </div>

          {/* Example Calculation */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-2xl font-bold text-center">{t("priceCustomization.exampleCalculation.title")}</h3>
            <Card className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("priceCustomization.exampleCalculation.description", { vetCost: exampleVetCost })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("priceCustomization.exampleCalculation.scenario", { petName: yourPetName, vetCost: exampleVetCost })}
              </p>

              <div className="space-y-2 text-lg">
                <div className="flex justify-between">
                  <span>{t("priceCustomization.exampleCalculation.vetVisitCost")}</span>
                  <span className="font-semibold">CHF {exampleVetCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>{t("priceCustomization.exampleCalculation.deductible", { yearlyDeductible: yearlyDeductible })}</span>
                  <span className="font-semibold">- CHF {deductibleApplied.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>{t("priceCustomization.exampleCalculation.coPay", { coPayPercentage: coPayPercentage * 100 })}</span>
                  <span className="font-semibold">- CHF {yourCoPay.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-primary text-xl">
                  <span>{t("priceCustomization.exampleCalculation.insurancePays")}</span>
                  <span>CHF {insurancePays.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
      <PriceSummaryBanner
        currentFinalPrice={currentFinalPrice}
        onBack={onBack}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PriceCustomization;