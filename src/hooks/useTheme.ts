import { Colors } from '@constants/theme'

import { useColorScheme } from './useColorScheme'

export const useTheme = () => {
  const scheme = useColorScheme()
  const theme = scheme === 'dark' ? 'dark' : 'light'

  return Colors[theme]
}
