import ru from "shared/localization/ru-RU.json";
import en from "shared/localization/en-US.json";

export const defaultNS = 'translation';
export const resources = {
  en: { translation: en },
  ru: { translation: ru },
} as const;