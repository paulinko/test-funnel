import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } => "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showError } from "@/utils/toast";
import { useTranslation } from "react-i18next"; // New import

interface PetDetailsProps {
  petType: "cat" | "dog";
  onDetailsSubmit: (breed: string, age: number) => void;
  onBack: () => void;
}

const mockBreeds = {
  dog: [
    "Golden Retriever", "Labrador Retriever", "German Shepherd", "Poodle", "Bulldog",
    "Beagle", "Rottweiler", "Dachshund", "Siberian Husky", "Great Dane"
  ],
  cat: [
    "Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal",
    "Sphynx", "British Shorthair", "Abyssinian", "Scottish Fold", "Devon Rex"
  ],
};

const PetDetails: React.FC<PetDetailsProps> = ({ petType, onDetailsSubmit, onBack }) => {
  const [selectedBreed, setSelectedBreed] = React.useState<string>("");
  const [age, setAge] = React.useState<string>("");
  const { t } = useTranslation(); // New: useTranslation hook

  const breeds = mockBreeds[petType];

  const handleSubmit = () => {
    const parsedAge = parseInt(age, 10);
    if (!selectedBreed) {
      showError(t("petDetails.validation.selectBreed"));
      return;
    }
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 25) { // Basic age validation
      showError(t("petDetails.validation.validAge"));
      return;
    }
    onDetailsSubmit(selectedBreed, parsedAge);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {petType === "dog" ? t("petDetails.dogTitle") : t("petDetails.catTitle")}
        </CardTitle>
        <CardDescription>{t("petDetails.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="breed">{t("petDetails.breed")}</Label>
          <Select onValueChange={setSelectedBreed} value={selectedBreed}>
            <SelectTrigger id="breed">
              <SelectValue placeholder={petType === "dog" ? t("petDetails.selectDogBreed") : t("petDetails.selectCatBreed")} />
            </SelectTrigger>
            <SelectContent>
              {breeds.map((breed) => (
                <SelectItem key={breed} value={breed}>
                  {breed}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">{t("petDetails.age")}</Label>
          <Input
            id="age"
            type="number"
            placeholder={t("petDetails.agePlaceholder")}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="1"
            max="25"
          />
        </div>
        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onBack} className="w-full">
            {t("petDetails.back")}
          </Button>
          <Button onClick={handleSubmit} className="w-full">
            {t("petDetails.getPrice")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetDetails;