import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface PricingDisplayProps {
  petType: "cat" | "dog";
  breed: string;
  age: number;
  onReset: () => void;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({ petType, breed, age, onReset }) => {
  const [price, setPrice] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

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
        showSuccess("Price fetched successfully!");
      } catch (err) {
        console.error("Failed to fetch price:", err);
        setError("Failed to fetch pricing. Please try again.");
        showError("Failed to fetch pricing.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [petType, breed, age]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Insurance Quote</CardTitle>
        <CardDescription>Here's the personalized quote for your pet.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center space-x-2 py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-lg text-muted-foreground">Calculating your price...</p>
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
              <p className="text-lg text-muted-foreground">Estimated Monthly Premium</p>
              <p className="text-5xl font-extrabold text-primary">${price.toFixed(2)}</p>
            </div>
            <div className="border-t pt-4 space-y-2">
              <h3 className="text-xl font-semibold">Product Configuration:</h3>
              <p><strong>Pet Type:</strong> {petType.charAt(0).toUpperCase() + petType.slice(1)}</p>
              <p><strong>Breed:</strong> {breed}</p>
              <p><strong>Age:</strong> {age} years</p>
              <p className="text-sm text-muted-foreground mt-2">
                This is a mock price and configuration. Actual terms and conditions apply.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onReset} className="w-full">
          Start Over
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingDisplay;