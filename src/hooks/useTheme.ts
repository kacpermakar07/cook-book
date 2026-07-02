import { Colors } from '@constants/theme'

import { useColorScheme } from './useColorScheme'

export function useTheme() {
  const scheme = useColorScheme()
  const theme = scheme === 'unspecified' ? 'light' : scheme

  return Colors[theme]
}
