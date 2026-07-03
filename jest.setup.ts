import { jest } from '@jest/globals'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

import '@i18n/i18n'

global.IS_REACT_ACT_ENVIRONMENT = true

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
