import { Image } from 'expo-image'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { Recipe } from '@api/Recipe/recipe.types'
import { AppPressable } from '@components/AppPressable'
import { ShadowView } from '@components/ShadowView'
import { Typography } from '@components/Typography'
import { useTheme } from '@hooks/useTheme'
import { IconChefHat, IconClock } from '@tabler/icons-react-native'

export const RECIPE_CARD_HEIGHT = 90

type RecipeCardProps = {
  recipe: Recipe
  onPress: (id: number) => void
}

export const RecipeCard = memo(({ recipe, onPress }: RecipeCardProps) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const totalTimeMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes

  return (
    <ShadowView style={styles.shadowWrapper}>
      <AppPressable
        onPress={() => onPress(recipe.id)}
        style={[styles.container, { backgroundColor: theme.backgroundElement }]}
      >
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          contentFit="cover"
          recyclingKey={String(recipe.id)}
        />

        <View style={styles.info}>
          <Typography variant="subtitle" numberOfLines={2}>
            {recipe.name}
          </Typography>

          <View style={styles.infoCaption}>
            <IconClock size={16} opacity={0.8} />

            <Typography
              variant="caption"
              style={{ color: theme.textSecondary }}
            >
              {t('recipeList.cardTime', { totalTime: totalTimeMinutes })}
            </Typography>

            <IconChefHat size={16} opacity={0.8} />

            <Typography
              variant="caption"
              style={{ color: theme.textSecondary }}
            >
              {t('recipeList.cardDifficulty', {
                difficulty: recipe.difficulty,
              })}
            </Typography>
          </View>
        </View>
      </AppPressable>
    </ShadowView>
  )
})

RecipeCard.displayName = 'RecipeCard'

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 12,
  },
  container: {
    flexDirection: 'row',
    height: RECIPE_CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: RECIPE_CARD_HEIGHT,
    height: RECIPE_CARD_HEIGHT,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  infoCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})
