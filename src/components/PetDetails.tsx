import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react"; // Import Loader2 icon
import { cn } from "@/lib/utils"; // Import cn for conditional class names

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
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  // New state for validation errors
  const [petNameError, setPetNameError] = React.useState<string>("");
  const [breedError, setBreedError] = React.useState<string>("");
  const [ageError, setAgeError] = React.useState<string>("");

  const { t } = useTranslation();

  const breeds = mockBreeds[petType];

  const handleSubmit = async () => {
    let hasError = false;
    const parsedAge = parseInt(age, 10);

    // Reset errors
    setPetNameError("");
    setBreedError("");
    setAgeError("");

    if (!petName.trim()) {
      setPetNameError(t("petDetails.validation.enterPetName"));
      hasError = true;
    }
    if (!selectedBreed) {
      setBreedError(t("petDetails.validation.selectBreed"));
      hasError = true;
    }
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 25) {
      setAgeError(t("petDetails.validation.validAge"));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);
    try {
      await onDetailsSubmit(petName.trim(), selectedBreed, parsedAge);
    } finally {
      setIsLoading(false);
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
            onChange={(e) => {
              setPetName(e.target.value);
              setPetNameError(""); // Clear error on change
            }}
            disabled={isLoading}
            className={cn(petNameError && "border-red-500 focus-visible:ring-red-500")}
          />
          {petNameError && <p className="text-sm text-red-500">{petNameError}</p>}
        </div>
        {/* Breed Selection */}
        <div className="space-y-2">
          <Label htmlFor="breed">{t("petDetails.breed")}</Label>
          <Select onValueChange={(value) => {
            setSelectedBreed(value);
            setBreedError(""); // Clear error on change
          }} value={selectedBreed} disabled={isLoading}>
            <SelectTrigger id="breed" className={cn(breedError && "border-red-500 focus-visible:ring-red-500")}>
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
          {breedError && <p className="text-sm text-red-500">{breedError}</p>}
        </div>
        {/* Age Input */}
        <div className="space-y-2">
          <Label htmlFor="age">{t("petDetails.age")}</Label>
          <Input
            id="age"
            type="number"
            placeholder={t("petDetails.agePlaceholder")}
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              setAgeError(""); // Clear error on change
            }}
            min="1"
            max="25"
            disabled={isLoading}
            className={cn(ageError && "border-red-500 focus-visible:ring-red-500")}
          />
          {ageError && <p className="text-sm text-red-500">{ageError}</p>}
        </div>
        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onBack} className="w-full" disabled={isLoading}>
            {t("petDetails.back")}
          </Button>
          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("petDetails.getPrice")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetDetails;