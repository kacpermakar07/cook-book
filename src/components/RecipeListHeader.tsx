import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Typography } from '@components/Typography'
import { useTheme } from '@hooks/useTheme'
import { IconBook } from '@tabler/icons-react-native'

const ICON_SLOT_SIZE = 20

export const RecipeListHeader = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 12,
          backgroundColor: theme.background,
          borderBottomColor: theme.backgroundSelected,
        },
      ]}
    >
      <View style={styles.iconSlot}>
        <IconBook color={theme.text} size={20} />
      </View>

      <Typography variant="subtitle" style={styles.title}>
        {t('recipeList.title')}
      </Typography>

      <View style={styles.iconSlot} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  iconSlot: {
    width: ICON_SLOT_SIZE,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
})
