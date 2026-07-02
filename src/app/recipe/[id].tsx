import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useRecipe } from '@api/Recipe/recipe.hooks'
import { ErrorState } from '@components/ErrorState'
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
      <Text style={[styles.name, { color: theme.text }]}>{recipe.name}</Text>
      <Text style={[styles.meta, { color: theme.textSecondary }]}>
        {t('recipeDetails.meta', {
          totalTime: totalTimeMinutes,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
          calories: recipe.caloriesPerServing,
        })}
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t('recipeDetails.ingredients')}
      </Text>
      {recipe.ingredients.map((ingredient, index) => (
        <Text key={index} style={[styles.listItem, { color: theme.text }]}>
          • {ingredient}
        </Text>
      ))}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t('recipeDetails.instructions')}
      </Text>
      {recipe.instructions.map((instruction, index) => (
        <Text key={index} style={[styles.listItem, { color: theme.text }]}>
          {index + 1}. {instruction}
        </Text>
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
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 12,
  },
  meta: {
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
  },
  listItem: {
    fontSize: 14,
    marginHorizontal: 16,
    marginBottom: 6,
    lineHeight: 20,
  },
})
