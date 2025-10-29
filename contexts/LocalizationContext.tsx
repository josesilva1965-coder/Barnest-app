// New file: contexts/LocalizationContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import type { AppSettings } from '../types';
import { translations } from '../utils/translations';

type TranslationKey = string;
type Language = AppSettings['language'];

interface LocalizationContextType {
  language: Language;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode, language: Language }> = ({ children, language }) => {
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result: any = translations[language];

    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        if(fallbackResult) {
            result = fallbackResult;
            break;
        }
        return key; // Return the key itself if no translation found
      }
    }

    if (typeof result === 'function' && params) {
        return result(params);
    }
    
    return typeof result === 'string' ? result : key;
  };

  return (
    <LocalizationContext.Provider value={{ language, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
