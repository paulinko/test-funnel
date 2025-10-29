import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showError, showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next"; // New import

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
  const { t } = useTranslation(); // New: useTranslation hook

  const productVariants: ProductVariant[] = [
    {
      id: "basic",
      name: t("productSelection.basicPlanName"),
      description: t("productSelection.basicPlanDescription"),
      priceFactor: 1.0,
    },
    {
      id: "standard",
      name: t("productSelection.standardPlanName"),
      description: t("productSelection.standardPlanDescription"),
      priceFactor: 1.3,
    },
    {
      id: "premium",
      name: t("productSelection.premiumPlanName"),
      description: t("productSelection.premiumPlanDescription"),
      priceFactor: 1.7,
    },
  ];

  const calculateVariantPrice = (factor: number) => {
    // Simple calculation: basePrice * factor, rounded to 2 decimal places
    return (basePrice * factor).toFixed(2);
  };

  const handleSubmit = () => {
    if (!selectedProductId) {
      showError(t("productSelection.validation.selectProductVariant"));
      return;
    }
    const selectedProduct = productVariants.find(p => p.id === selectedProductId);
    if (selectedProduct) {
      const finalPrice = parseFloat(calculateVariantPrice(selectedProduct.priceFactor));
      onSelectProduct(selectedProduct, finalPrice);
      showSuccess(t("productSelection.successToast", { productName: selectedProduct.name }));
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("productSelection.title")}</CardTitle>
        <CardDescription>{t("productSelection.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">{t("productSelection.select")}</TableHead>
              <TableHead>{t("productSelection.planName")}</TableHead>
              <TableHead>{t("productSelection.planDescription")}</TableHead>
              <TableHead className="text-right">{t("productSelection.monthlyPrice")}</TableHead>
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
            {t("productSelection.back")}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedProductId} className="w-full">
            {t("productSelection.selectProduct")}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>{t("productSelection.disclaimer", { petType: petType.charAt(0).toUpperCase() + petType.slice(1), breed, age })}</p>
      </CardFooter>
    </Card>
  );
};

export default ProductSelection;