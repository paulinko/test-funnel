import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils"; // Import cn for conditional class names

interface ContactDetailsFormProps {
  onDetailsSubmit: (
    name: string,
    email: string,
    phone: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    zipCode: string,
    country: string
  ) => void;
  onBack: () => void;
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
  initialAddressLine1?: string;
  initialAddressLine2?: string;
  initialCity?: string;
  initialZipCode?: string;
  initialCountry?: string;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  onDetailsSubmit,
  onBack,
  initialName = "",
  initialEmail = "",
  initialPhone = "",
  initialAddressLine1 = "",
  initialAddressLine2 = "",
  initialCity = "",
  initialZipCode = "",
  initialCountry = "",
}) => {
  const [name, setName] = React.useState(initialName);
  const [email, setEmail] = React.useState(initialEmail);
  const [phone, setPhone] = React.useState(initialPhone);
  const [addressLine1, setAddressLine1] = React.useState(initialAddressLine1);
  const [addressLine2, setAddressLine2] = React.useState(initialAddressLine2);
  const [city, setCity] = React.useState(initialCity);
  const [zipCode, setZipCode] = React.useState(initialZipCode);
  const [country, setCountry] = React.useState(initialCountry);

  // New state for validation errors
  const [nameError, setNameError] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [phoneError, setPhoneError] = React.useState<string>("");
  const [addressLine1Error, setAddressLine1Error] = React.useState<string>("");
  const [cityError, setCityError] = React.useState<string>("");
  const [zipCodeError, setZipCodeError] = React.useState<string>("");
  const [countryError, setCountryError] = React.useState<string>("");

  const { t } = useTranslation();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Basic phone number validation (e.g., 10-15 digits, optional + at start)
    return /^\+?[0-9]{10,15}$/.test(phone) || phone === "";
  };

  const handleSubmit = () => {
    let hasError = false;

    // Reset errors
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setAddressLine1Error("");
    setCityError("");
    setZipCodeError("");
    setCountryError("");

    if (!name.trim()) {
      setNameError(t("contactDetails.validation.enterName"));
      hasError = true;
    }
    if (!validateEmail(email)) {
      setEmailError(t("contactDetails.validation.validEmail"));
      hasError = true;
    }
    if (!validatePhone(phone)) {
      setPhoneError(t("contactDetails.validation.validPhone"));
      hasError = true;
    }
    if (!addressLine1.trim()) {
      setAddressLine1Error(t("contactDetails.validation.enterAddressLine1"));
      hasError = true;
    }
    if (!city.trim()) {
      setCityError(t("contactDetails.validation.enterCity"));
      hasError = true;
    }
    if (!zipCode.trim()) {
      setZipCodeError(t("contactDetails.validation.enterZipCode"));
      hasError = true;
    }
    if (!country.trim()) {
      setCountryError(t("contactDetails.validation.enterCountry"));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    onDetailsSubmit(name, email, phone, addressLine1, addressLine2, city, zipCode, country);
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
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            className={cn(nameError && "border-red-500 focus-visible:ring-red-500")}
          />
          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("contactDetails.emailAddress")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("contactDetails.emailAddressPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className={cn(emailError && "border-red-500 focus-visible:ring-red-500")}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("contactDetails.phoneNumber")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("contactDetails.phoneNumberPlaceholder")}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneError("");
            }}
            className={cn(phoneError && "border-red-500 focus-visible:ring-red-500")}
          />
          {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine1">{t("contactDetails.addressLine1")}</Label>
          <Input
            id="addressLine1"
            type="text"
            placeholder={t("contactDetails.addressLine1Placeholder")}
            value={addressLine1}
            onChange={(e) => {
              setAddressLine1(e.target.value);
              setAddressLine1Error("");
            }}
            className={cn(addressLine1Error && "border-red-500 focus-visible:ring-red-500")}
          />
          {addressLine1Error && <p className="text-sm text-red-500">{addressLine1Error}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressLine2">{t("contactDetails.addressLine2")}</Label>
          <Input
            id="addressLine2"
            type="text"
            placeholder={t("contactDetails.addressLine2Placeholder")}
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">{t("contactDetails.city")}</Label>
            <Input
              id="city"
              type="text"
              placeholder={t("contactDetails.cityPlaceholder")}
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCityError("");
              }}
              className={cn(cityError && "border-red-500 focus-visible:ring-red-500")}
            />
            {cityError && <p className="text-sm text-red-500">{cityError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">{t("contactDetails.zipCode")}</Label>
            <Input
              id="zipCode"
              type="text"
              placeholder={t("contactDetails.zipCodePlaceholder")}
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
                setZipCodeError("");
              }}
              className={cn(zipCodeError && "border-red-500 focus-visible:ring-red-500")}
            />
            {zipCodeError && <p className="text-sm text-red-500">{zipCodeError}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">{t("contactDetails.country")}</Label>
          <Input
            id="country"
            type="text"
            placeholder={t("contactDetails.countryPlaceholder")}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCountryError("");
            }}
            className={cn(countryError && "border-red-500 focus-visible:ring-red-500")}
          />
          {countryError && <p className="text-sm text-red-500">{countryError}</p>}
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