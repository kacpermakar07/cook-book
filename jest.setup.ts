import '@i18n/i18n'

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock'),
)
