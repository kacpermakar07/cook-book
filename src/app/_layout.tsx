import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AppProviders } from '@providers/AppProviders'

const RootLayout = () => {
  const colorScheme = useColorScheme()

  return (
    <AppProviders>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack />
        </ThemeProvider>
      </SafeAreaProvider>
    </AppProviders>
  )
}

export default RootLayout
