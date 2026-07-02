import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en/common.json'
import pl from './locales/pl/common.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    pl: { common: pl },
  },
  lng: 'pl',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export { i18n }
