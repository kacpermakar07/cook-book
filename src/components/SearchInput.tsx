import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput } from 'react-native'

import { ShadowView } from '@components/ShadowView'
import { useTheme } from '@hooks/useTheme'
import { IconSearch } from '@tabler/icons-react-native'

type SearchInputProps = {
  value: string
  onChangeText: (text: string) => void
}

export function SearchInput({ value, onChangeText }: SearchInputProps) {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <ShadowView style={styles.wrapper}>
      <IconSearch size={20} color={theme.textSecondary} style={styles.icon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t('recipeList.searchPlaceholder')}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          { backgroundColor: theme.backgroundElement, color: theme.text },
        ]}
      />
    </ShadowView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  input: {
    paddingLeft: 40,
    paddingRight: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
  },
})
