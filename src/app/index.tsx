import { Stack, useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native'

import { useRecipesInfinite } from '@api/Recipe/recipe.hooks'
import type { Recipe } from '@api/Recipe/recipe.types'
import { ErrorState } from '@components/ErrorState'
import { RECIPE_CARD_HEIGHT, RecipeCard } from '@components/RecipeCard'
import { RecipeListHeader } from '@components/RecipeListHeader'
import { SearchInput } from '@components/SearchInput'
import { ShadowView } from '@components/ShadowView'
import { Typography } from '@components/Typography'
import { useDebouncedValue } from '@hooks/useDebouncedValue'
import { useTheme } from '@hooks/useTheme'
import { getErrorMessage } from '@utils/getErrorMessage'

const LIST_GAP = 16
const LIST_PADDING_TOP = 16

const keyExtractor = (recipe: Recipe) => String(recipe.id)

const getItemLayout = (
  _: ArrayLike<Recipe> | null | undefined,
  index: number,
) => ({
  length: RECIPE_CARD_HEIGHT,
  offset: LIST_PADDING_TOP + index * (RECIPE_CARD_HEIGHT + LIST_GAP),
  index,
})

const RecipeListScreen = () => {
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [headerHeight, setHeaderHeight] = useState(0)
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

  const recipes: Recipe[] = useMemo(
    () => data?.pages.flatMap((page) => page.recipes) ?? [],
    [data],
  )
  const totalCount = data?.pages[0]?.total

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height)
  }

  const handleRecipePress = useCallback(
    (id: number) => {
      router.push({ pathname: '/recipe/[id]', params: { id: String(id) } })
    },
    [router],
  )

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Recipe>) => (
      <RecipeCard recipe={item} onPress={handleRecipePress} />
    ),
    [handleRecipePress],
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{ title: t('recipeList.title'), headerShown: false }}
      />

      <View onLayout={onHeaderLayout} style={styles.header}>
        <RecipeListHeader />

        <ShadowView
          style={[styles.searchSection, { backgroundColor: theme.background }]}
        >
          <Typography variant="title" style={styles.heading}>
            {t('recipeList.heading')}
          </Typography>

          <SearchInput value={search} onChangeText={setSearch} />

          {totalCount !== undefined && (
            <Typography
              variant="body"
              style={[styles.totalCount, { color: theme.textSecondary }]}
            >
              {t('recipeList.totalCount', { count: totalCount })}
            </Typography>
          )}
        </ShadowView>
      </View>

      <View style={[styles.content, { paddingTop: headerHeight }]}>
        {isPending ? (
          <ActivityIndicator style={styles.centered} />
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
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
            removeClippedSubviews
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={7}
          />
        )}
      </View>
    </View>
  )
}

export default RecipeListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchSection: {
    paddingBottom: 8,
  },
  heading: {
    textAlign: 'center',
    marginTop: 12,
  },
  totalCount: {
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
  },
  footer: {
    paddingVertical: 16,
  },
})
