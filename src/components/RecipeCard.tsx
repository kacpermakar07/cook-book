import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@hooks/useTheme'
import type { Recipe } from '@api/Recipe/recipe.types'

type RecipeCardProps = {
  recipe: Recipe
  onPress: () => void
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const theme = useTheme()
  const { t } = useTranslation()
  const totalTimeMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: theme.backgroundElement }]}
    >
      <Image
        source={{ uri: recipe.image }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {recipe.name}
        </Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {t('recipeList.cardMeta', {
            totalTime: totalTimeMinutes,
            difficulty: recipe.difficulty,
          })}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 6,
  },
  image: {
    width: 88,
    height: 88,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
  },
})
