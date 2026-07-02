import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import type { Recipe } from '@api/Recipe/recipe.types'
import { ShadowView } from '@components/ShadowView'
import { Typography } from '@components/Typography'
import { useTheme } from '@hooks/useTheme'
import { IconChefHat, IconClock } from '@tabler/icons-react-native'

type RecipeCardProps = {
  recipe: Recipe
  onPress: () => void
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const theme = useTheme()
  const { t } = useTranslation()
  const totalTimeMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes

  return (
    <ShadowView style={styles.shadowWrapper}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
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
      </TouchableOpacity>
    </ShadowView>
  )
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 12,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: 90,
    height: 90,
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
