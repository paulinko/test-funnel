import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showError, showSuccess } from "@/utils/toast";

interface ProductVariant {
  id: string;
  name: string;
  description: string;
  priceFactor: number; // Multiplier for base price
}

interface ProductSelectionProps {
  petType: "cat" | "dog";
  breed: string;
  age: number;
  basePrice: number;
  onSelectProduct: (product: ProductVariant, finalPrice: number) => void;
  onBack: () => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ petType, breed, age, basePrice, onSelectProduct, onBack }) => {
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

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

  const calculateVariantPrice = (factor: number) => {
    // Simple calculation: basePrice * factor, rounded to 2 decimal places
    return (basePrice * factor).toFixed(2);
  };

  const handleSubmit = () => {
    if (!selectedProductId) {
      showError("Please select a product variant.");
      return;
    }
    const selectedProduct = productVariants.find(p => p.id === selectedProductId);
    if (selectedProduct) {
      const finalPrice = parseFloat(calculateVariantPrice(selectedProduct.priceFactor));
      onSelectProduct(selectedProduct, finalPrice);
      showSuccess(`You selected the ${selectedProduct.name}!`);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Choose Your Plan</CardTitle>
        <CardDescription>Select the insurance plan that best fits your pet's needs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Monthly Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <RadioGroup onValueChange={setSelectedProductId} value={selectedProductId || ""}>
              {productVariants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>
                    <RadioGroupItem value={variant.id} id={variant.id} />
                  </TableCell>
                  <TableCell>
                    <Label htmlFor={variant.id} className="font-medium cursor-pointer">
                      {variant.name}
                    </Label>
                  </TableCell>
                  <TableCell>{variant.description}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${calculateVariantPrice(variant.priceFactor)}
                  </TableCell>
                </TableRow>
              ))}
            </RadioGroup>
          </TableBody>
        </Table>
        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onBack} className="w-full">
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedProductId} className="w-full">
            Select Product
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>Prices are estimates based on your pet's details: {petType.charAt(0).toUpperCase() + petType.slice(1)}, {breed}, {age} years old.</p>
      </CardFooter>
    </Card>
  );
};

export default ProductSelection;