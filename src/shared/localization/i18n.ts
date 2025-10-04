import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, defaultNS } from "./i18n-config";

const savedLanguage = localStorage.getItem("local") as "ru-RU" | "en-US" | null;
const defaultLanguage: "ru-RU" | "en-US" = "ru-RU";

i18n.use(initReactI18next).init({
    lng: savedLanguage || defaultLanguage,
    ns: ["translation"],
    defaultNS,
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

if (!savedLanguage) localStorage.setItem("local", defaultLanguage);

export default i18n;
