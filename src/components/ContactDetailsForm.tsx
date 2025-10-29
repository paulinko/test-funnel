import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next"; // New import

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
  const { t } = useTranslation(); // New: useTranslation hook

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Basic phone number validation (e.g., 10-15 digits, optional + at start)
    return /^\+?[0-9]{10,15}$/.test(phone) || phone === "";
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      showError(t("contactDetails.validation.enterName"));
      return;
    }
    if (!validateEmail(email)) {
      showError(t("contactDetails.validation.validEmail"));
      return;
    }
    if (!validatePhone(phone)) {
      showError(t("contactDetails.validation.validPhone"));
      return;
    }
    onDetailsSubmit(name, email, phone);
    showSuccess(t("contactDetails.successToast"));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("contactDetails.title")}</CardTitle>
        <CardDescription>{t("contactDetails.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("contactDetails.fullName")}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t("contactDetails.fullNamePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("contactDetails.emailAddress")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("contactDetails.emailAddressPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("contactDetails.phoneNumber")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("contactDetails.phoneNumberPlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="w-full">
          {t("contactDetails.back")}
        </Button>
        <Button onClick={handleSubmit} className="w-full">
          {t("contactDetails.confirmPlan")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContactDetailsForm;