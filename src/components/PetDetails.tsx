import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showError } from "@/utils/toast";

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

  const breeds = mockBreeds[petType];

  const handleSubmit = () => {
    const parsedAge = parseInt(age, 10);
    if (!selectedBreed) {
      showError("Please select a breed.");
      return;
    }
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 25) { // Basic age validation
      showError("Please enter a valid age (1-25 years).");
      return;
    }
    onDetailsSubmit(selectedBreed, parsedAge);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Tell Us About Your {petType === "dog" ? "Dog" : "Cat"}</CardTitle>
        <CardDescription>We need a few more details to get your quote.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="breed">Breed</Label>
          <Select onValueChange={setSelectedBreed} value={selectedBreed}>
            <SelectTrigger id="breed">
              <SelectValue placeholder={`Select your ${petType === "dog" ? "dog's" : "cat's"} breed`} />
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
          <Label htmlFor="age">Age (in years)</Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 3"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="1"
            max="25"
          />
        </div>
        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onBack} className="w-full">
            Back
          </Button>
          <Button onClick={handleSubmit} className="w-full">
            Get Price
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetDetails;