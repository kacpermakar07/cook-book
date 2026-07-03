import { describe, expect, it, jest } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react-native'

import { recipesApi } from '@api/Recipe/recipe.api'
import type { Recipe } from '@api/Recipe/recipe.types'
import RecipeDetailsScreen from '../../../src/app/recipe/[id]'

jest.mock('@api/Recipe/recipe.api')

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: () => ({ id: '1' }),
}))

const mockedRecipesApi = jest.mocked(recipesApi)

function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: 1,
    name: 'Pancakes',
    ingredients: ['Flour', 'Milk'],
    instructions: ['Mix', 'Cook'],
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'American',
    caloriesPerServing: 200,
    tags: [],
    image: 'https://example.com/pancakes.jpg',
    rating: 4.5,
    reviewCount: 10,
    mealType: ['Breakfast'],
    ...overrides,
  }
}

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <RecipeDetailsScreen />
    </QueryClientProvider>,
  )
}

describe('RecipeDetailsScreen', () => {
  it('shows neither the recipe nor the error state while it is loading', async () => {
    mockedRecipesApi.getById.mockReturnValue(new Promise(() => {}))

    await renderScreen()

    expect(screen.queryByText('Pancakes')).toBeNull()
    expect(screen.queryByText('Try again')).toBeNull()
  })

  it('renders recipe details once loaded', async () => {
    mockedRecipesApi.getById.mockResolvedValue(makeRecipe())

    await renderScreen()

    expect(await screen.findByText('Pancakes')).toBeTruthy()
    expect(screen.getByText('15 min')).toBeTruthy()
    expect(screen.getByText('Easy')).toBeTruthy()
    expect(screen.getByText('2 servings')).toBeTruthy()
    expect(screen.getByText('200 kcal/serving')).toBeTruthy()
    expect(screen.getByText('• Flour')).toBeTruthy()
    expect(screen.getByText('• Milk')).toBeTruthy()
    expect(screen.getByText('1. Mix')).toBeTruthy()
    expect(screen.getByText('2. Cook')).toBeTruthy()
  })

  it('shows the error state and retries the query on retry press', async () => {
    mockedRecipesApi.getById.mockRejectedValueOnce(new Error('Network Error'))
    mockedRecipesApi.getById.mockResolvedValueOnce(makeRecipe())

    await renderScreen()

    const retryButton = await screen.findByText('Try again')
    fireEvent.press(retryButton)

    expect(await screen.findByText('Pancakes')).toBeTruthy()
    expect(mockedRecipesApi.getById).toHaveBeenCalledTimes(2)
  })
})
