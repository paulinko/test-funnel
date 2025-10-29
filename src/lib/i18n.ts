import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import de from "@/locales/de.json"; // New import
import fr from "@/locales/fr.json"; // New import

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
      de: { // New: German translations
        translation: de,
      },
      fr: { // New: French translations
        translation: fr,
      },
    },
    lng: "en", // default language
    fallbackLng: "en", // fallback language if translation is not found
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;