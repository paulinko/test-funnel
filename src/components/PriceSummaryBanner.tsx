import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface PriceSummaryBannerProps {
  currentFinalPrice: number;
  onBack: () => void;
  onSubmit: () => void;
}

const PriceSummaryBanner: React.FC<PriceSummaryBannerProps> = ({
  currentFinalPrice,
  onBack,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-lg text-muted-foreground">{t("priceCustomization.currentEstimatedMonthlyPremium")}</p>
          <p className="text-4xl font-extrabold text-primary">${currentFinalPrice.toFixed(2)}</p>
        </div>
        <div className="flex w-full sm:w-auto gap-4">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
            {t("priceCustomization.back")}
          </Button>
          <Button onClick={onSubmit} className="w-full sm:w-auto">
            {t("priceCustomization.continue")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceSummaryBanner;