import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/eng.json";
import frTranslation from "./locales/fr.json";
import arTranslation from "./locales/ar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },

    fallbackLng: "en",

    detection: {
      order: ["localStorage"], 
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },
  });

const applyDocumentLanguage = (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  if (document.body) {
    document.body.dir = lng === "ar" ? "rtl" : "ltr";
  }
  document.documentElement.lang = lng;
};

i18n.on("languageChanged", applyDocumentLanguage);
applyDocumentLanguage(i18n.resolvedLanguage || i18n.language || "en");

export default i18n;
