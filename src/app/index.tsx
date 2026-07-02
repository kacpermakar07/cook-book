import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native'

import { useRecipesInfinite } from '@api/Recipe/recipe.hooks'
import type { Recipe } from '@api/Recipe/recipe.types'
import { ErrorState } from '@components/ErrorState'
import { RecipeCard } from '@components/RecipeCard'
import { SearchInput } from '@components/SearchInput'
import { ShadowView } from '@components/ShadowView'
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

  const recipes: Recipe[] = data?.pages.flatMap((page) => page.recipes) ?? []

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height)
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('recipeList.title'),
          headerTitleAlign: 'center',
          headerLeft: () => <IconBook color={'black'} size={24} />,
        }}
      />

      <ShadowView
        onLayout={onHeaderLayout}
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.backgroundSelected,
          },
        ]}
      >
        <Typography variant="title" style={styles.title}>
          {t('recipeList.heading')}
        </Typography>

        <SearchInput value={search} onChangeText={setSearch} />
      </ShadowView>

      <View style={{ flex: 1, paddingTop: headerHeight }}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
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
  title: {
    textAlign: 'center',
    marginTop: 12,
  },
})
