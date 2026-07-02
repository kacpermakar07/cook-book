import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

import { useRecipesInfinite } from '@api/Recipe/recipe.hooks'
import type { Recipe } from '@api/Recipe/recipe.types'
import { ErrorState } from '@components/ErrorState'
import { RecipeCard } from '@components/RecipeCard'
import { Typography } from '@components/Typography'
import { useDebouncedValue } from '@hooks/useDebouncedValue'
import { useTheme } from '@hooks/useTheme'
import { IconBook } from '@tabler/icons-react-native'
import { getErrorMessage } from '@utils/getErrorMessage'

export default function RecipeListScreen() {
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useRecipesInfinite(debouncedSearch)

  const recipes: Recipe[] = data?.pages.flatMap((page) => page.recipes) ?? []

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('recipeList.title'),
          headerTitleAlign: 'center',
          headerLeft: () => <IconBook color={'black'} size={24} />,
        }}
      />

      <Typography variant="title" style={styles.title}>
        {t('recipeList.heading')}
      </Typography>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={t('recipeList.searchPlaceholder')}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.search,
          { backgroundColor: theme.backgroundElement, color: theme.text },
        ]}
      />

      {isPending ? (
        <ActivityIndicator style={styles.centered} />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(recipe) => String(recipe.id)}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() =>
                router.push({
                  pathname: '/recipe/[id]',
                  params: { id: String(item.id) },
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage()
            }
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footer} />
            ) : null
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
  },
  list: {
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
  },
  footer: {
    paddingVertical: 16,
  },
  title: {
    textAlign: 'center',
    marginTop: 12,
  },
})
