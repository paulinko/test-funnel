import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showError } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react"; // Import Loader2 icon

interface PetDetailsProps {
  petType: "cat" | "dog";
  onDetailsSubmit: (petName: string, breed: string, age: number) => void;
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
  const [petName, setPetName] = React.useState<string>("");
  const [selectedBreed, setSelectedBreed] = React.useState<string>("");
  const [age, setAge] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // New loading state
  const { t } = useTranslation();

  const breeds = mockBreeds[petType];

  const handleSubmit = async () => { // Made async to handle loading state
    const parsedAge = parseInt(age, 10);
    if (!petName.trim()) {
      showError(t("petDetails.validation.enterPetName"));
      return;
    }
    if (!selectedBreed) {
      showError(t("petDetails.validation.selectBreed"));
      return;
    }
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 25) {
      showError(t("petDetails.validation.validAge"));
      return;
    }

    setIsLoading(true); // Set loading to true
    try {
      await onDetailsSubmit(petName.trim(), selectedBreed, parsedAge);
    } finally {
      setIsLoading(false); // Set loading to false after submission (success or failure)
    }
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
        {/* Pet Name Input */}
        <div className="space-y-2">
          <Label htmlFor="pet-name">{t("petDetails.petName")}</Label>
          <Input
            id="pet-name"
            type="text"
            placeholder={t("petDetails.petNamePlaceholder")}
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            disabled={isLoading} // Disable input while loading
          />
        </div>
        {/* Breed Selection */}
        <div className="space-y-2">
          <Label htmlFor="breed">{t("petDetails.breed")}</Label>
          <Select onValueChange={setSelectedBreed} value={selectedBreed} disabled={isLoading}> {/* Disable select while loading */}
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
        {/* Age Input */}
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
            disabled={isLoading} // Disable input while loading
          />
        </div>
        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onBack} className="w-full" disabled={isLoading}>
            {t("petDetails.back")}
          </Button>
          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon */}
            {t("petDetails.getPrice")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetDetails;