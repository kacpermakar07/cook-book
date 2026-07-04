import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en/common.json'
import pl from './locales/pl/common.json'

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    pl: { common: pl },
  },
  lng: deviceLanguage,
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export { i18n }
