
export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
}

export type LanguageCode = "de" | "en" | "es" | "fr";

export interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: Record<string, Record<string, string>>;
  availableLanguages: SupportedLanguage[];
  languageDetails: Record<LanguageCode, SupportedLanguage>;
}

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
}
