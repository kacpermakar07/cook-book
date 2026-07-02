import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { Typography } from '@components/Typography'
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
      <Typography variant="body" style={styles.message}>
        {message}
      </Typography>
      <TouchableOpacity
        onPress={onRetry}
        style={[styles.button, { backgroundColor: theme.backgroundSelected }]}
      >
        <Typography variant="body" style={styles.buttonText}>
          {t('errors.retry')}
        </Typography>
      </TouchableOpacity>
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
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
})
