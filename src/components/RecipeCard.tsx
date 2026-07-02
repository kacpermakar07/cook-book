import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import type { Recipe } from '@api/Recipe/recipe.types'
import { Typography } from '@components/Typography'
import { useTheme } from '@hooks/useTheme'

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
        <Typography variant="subtitle" numberOfLines={2}>
          {recipe.name}
        </Typography>

        <Typography variant="caption" style={{ color: theme.textSecondary }}>
          {t('recipeList.cardMeta', {
            totalTime: totalTimeMinutes,
            difficulty: recipe.difficulty,
          })}
        </Typography>
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
})
