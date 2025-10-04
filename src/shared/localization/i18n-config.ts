import ru from "shared/localization/ru-RU.json";
import en from "shared/localization/en-US.json";
import changesRU from "shared/localization/changes/ru-RU.json";
import changesEN from "shared/localization/changes/en-US.json";


export const defaultNS = 'translation';
export const resources = {
  en: { translation: en, changes: changesEN },
  ru: { translation: ru, changes: changesRU },
} as const;