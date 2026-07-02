import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@hooks/useTheme'

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      <Pressable
        onPress={onRetry}
        style={[styles.button, { backgroundColor: theme.backgroundSelected }]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {t('errors.retry')}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
})
