import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pt from './locales/pt.json';
import esp from './locales/esp.json';

// Define as traduções disponíveis
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  resources: {
    en: en,
    pt: pt,
    esp: esp,
  },
 react: {
  useSuspense: false,
 },
  interpolation: {
    escapeValue: false,
  },
});


export default i18n;
