
import { createContext, useContext, useState } from "react";

export type Language = {
  code: string;
  name: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: string;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const getLanguageByCode = (code: string): Language => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};

const initialState: LanguageProviderState = {
  language: SUPPORTED_LANGUAGES[0],
  setLanguage: () => null,
};

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "admin-ui-language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    () => getLanguageByCode((localStorage.getItem(storageKey) || defaultLanguage))
  );

  const setLanguage = (language: Language) => {
    setLanguageState(language);
    localStorage.setItem(storageKey, language.code);
  };

  return (
    <LanguageProviderContext.Provider 
      {...props} 
      value={{ language, setLanguage }}
    >
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");

  return context;
};
