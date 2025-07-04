import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

type Language = 'en' | 'si' | 'ta';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  translations: any;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const languageFiles = {
  en: () => require('../../locales/en.json'),
  si: () => require('../../locales/si.json'),
  ta: () => require('../../locales/ta.json'),
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  useEffect(() => {
    loadTranslations();
  }, [currentLanguage]);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync('user_language');
      if (savedLanguage && ['en', 'si', 'ta'].includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Failed to load saved language:', error);
    }
  };

  const loadTranslations = () => {
    try {
      const translationData = languageFiles[currentLanguage]();
      setTranslations(translationData);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English if loading fails
      if (currentLanguage !== 'en') {
        setTranslations(languageFiles.en());
      }
    }
  };

  const setLanguage = async (language: Language) => {
    try {
      await SecureStore.setItemAsync('user_language', language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    let result = typeof value === 'string' ? value : key;
    
    // Replace parameters in the translation
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
