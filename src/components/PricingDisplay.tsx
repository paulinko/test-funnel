import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useTranslation } from "react-i18next"; // New import

interface PricingDisplayProps {
  petType: "cat" | "dog";
  breed: string;
  age: number;
  onContinue: (price: number) => void;
  onBackToSelection: () => void;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({ petType, breed, age, onContinue, onBackToSelection }) => {
  const [price, setPrice] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const { t } = useTranslation(); // New: useTranslation hook

  React.useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      setError(null);
      setPrice(null);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock pricing logic
        let basePrice = 50;
        if (petType === "dog") {
          basePrice += 20;
        } else {
          basePrice += 10;
        }

        // Age factor
        basePrice += age * 5;

        // Breed factor (simple example)
        if (breed.includes("Bulldog") || breed.includes("Sphynx")) {
          basePrice += 15;
        }

        setPrice(basePrice);
        showSuccess(t("pricingDisplay.priceFetchedSuccess"));
      } catch (err) {
        console.error("Failed to fetch price:", err);
        setError(t("pricingDisplay.errorFetchingPrice"));
        showError(t("pricingDisplay.errorToast"));
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [petType, breed, age, t]); // Added t to dependency array

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("pricingDisplay.title")}</CardTitle>
        <CardDescription>{t("pricingDisplay.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center space-x-2 py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-lg text-muted-foreground">{t("pricingDisplay.calculating")}</p>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center py-4">
            <p>{error}</p>
          </div>
        )}
        {price !== null && !loading && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">{t("pricingDisplay.estimatedMonthlyPremium")}</p>
              <p className="text-5xl font-extrabold text-primary">${price.toFixed(2)}</p>
            </div>
            <div className="border-t pt-4 space-y-2">
              <h3 className="text-xl font-semibold">{t("pricingDisplay.productConfiguration")}</h3>
              <p><strong>{t("pricingDisplay.petType")}</strong> {petType.charAt(0).toUpperCase() + petType.slice(1)}</p>
              <p><strong>{t("pricingDisplay.breed")}</strong> {breed}</p>
              <p><strong>{t("pricingDisplay.age")}</strong> {age} {t("pricingDisplay.years")}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t("pricingDisplay.mockPriceDisclaimer")}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBackToSelection} className="w-full">
          {t("pricingDisplay.startOver")}
        </Button>
        <Button onClick={() => price !== null && onContinue(price)} disabled={loading || price === null} className="w-full">
          {t("pricingDisplay.continue")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingDisplay;