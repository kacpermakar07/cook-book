import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'

import { useRecipe } from '@api/Recipe/recipe.hooks'
import { ErrorState } from '@components/ErrorState'
import { Typography } from '@components/Typography'
import { useTheme } from '@hooks/useTheme'
import { getErrorMessage } from '@utils/getErrorMessage'

export default function RecipeDetailsScreen() {
  const theme = useTheme()
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const recipeId = Number(id)
  const {
    data: recipe,
    isPending,
    isError,
    error,
    refetch,
  } = useRecipe(recipeId)

  if (isPending) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ title: t('recipeDetails.title') }} />
        <ActivityIndicator style={styles.centered} />
      </View>
    )
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ title: t('recipeDetails.title') }} />
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      </View>
    )
  }

  const totalTimeMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ title: recipe.name }} />
      <Image
        source={{ uri: recipe.image }}
        style={styles.image}
        contentFit="cover"
      />
      <Typography variant="title" style={styles.name}>
        {recipe.name}
      </Typography>
      <Typography
        variant="body"
        style={[styles.meta, { color: theme.textSecondary }]}
      >
        {t('recipeDetails.meta', {
          totalTime: totalTimeMinutes,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
          calories: recipe.caloriesPerServing,
        })}
      </Typography>

      <Typography variant="subtitle" style={styles.sectionTitle}>
        {t('recipeDetails.ingredients')}
      </Typography>
      {recipe.ingredients.map((ingredient, index) => (
        <Typography key={index} variant="body" style={styles.listItem}>
          • {ingredient}
        </Typography>
      ))}

      <Typography variant="subtitle" style={styles.sectionTitle}>
        {t('recipeDetails.instructions')}
      </Typography>
      {recipe.instructions.map((instruction, index) => (
        <Typography key={index} variant="body" style={styles.listItem}>
          {index + 1}. {instruction}
        </Typography>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 220,
  },
  name: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  meta: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
  },
  listItem: {
    marginHorizontal: 16,
    marginBottom: 6,
    lineHeight: 20,
  },
})
