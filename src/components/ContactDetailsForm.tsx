import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/utils/toast";

interface ContactDetailsFormProps {
  onDetailsSubmit: (name: string, email: string, phone: string) => void;
  onBack: () => void;
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  onDetailsSubmit,
  onBack,
  initialName = "",
  initialEmail = "",
  initialPhone = "",
}) => {
  const [name, setName] = React.useState(initialName);
  const [email, setEmail] = React.useState(initialEmail);
  const [phone, setPhone] = React.useState(initialPhone);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Basic phone number validation (e.g., 10-15 digits, optional + at start)
    return /^\+?[0-9]{10,15}$/.test(phone) || phone === "";
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      showError("Please enter your name.");
      return;
    }
    if (!validateEmail(email)) {
      showError("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(phone)) {
      showError("Please enter a valid phone number (10-15 digits, optional +).");
      return;
    }
    onDetailsSubmit(name, email, phone);
    showSuccess("Contact details saved!");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Contact Details</CardTitle>
        <CardDescription>Please provide your contact information to finalize your plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+15551234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="w-full">
          Back
        </Button>
        <Button onClick={handleSubmit} className="w-full">
          Confirm Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContactDetailsForm;