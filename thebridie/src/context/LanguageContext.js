import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }, []);

  const setLang = (l) => {
    // English only, ignore changing
  };

  const t = (key) => {
    const parts = key.split('.');
    let node = translations;
    for (const p of parts) {
      if (!node || typeof node !== 'object') return key;
      node = node[p];
    }
    if (node && typeof node === 'object' && (node.ar || node.en)) {
      return node[lang] ?? node.ar ?? key;
    }
    return typeof node === 'string' ? node : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
};
