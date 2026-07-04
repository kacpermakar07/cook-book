import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { AppPressable } from '@components/AppPressable'
import { Typography } from '@components/Typography'
import { useTheme } from '@hooks/useTheme'

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Typography variant="body" style={styles.message}>
        {message}
      </Typography>

      <AppPressable
        onPress={onRetry}
        style={[styles.button, { backgroundColor: theme.backgroundSelected }]}
      >
        <Typography variant="body">{t('errors.retry')}</Typography>
      </AppPressable>
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
})
