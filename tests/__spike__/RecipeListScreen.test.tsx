import { describe, expect, it, jest } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react-native'

import { recipesApi } from '@api/Recipe/recipe.api'
import RecipeListScreen from '../../src/app/index'

jest.mock('@api/Recipe/recipe.api')
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: jest.fn() }),
}))

const mockedRecipesApi = jest.mocked(recipesApi)

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <RecipeListScreen />
    </QueryClientProvider>,
  )
}

describe('RecipeListScreen', () => {
  it('renders recipes once loaded', async () => {
    mockedRecipesApi.list.mockResolvedValue({
      recipes: [
        {
          id: 1,
          name: 'Pancakes',
          ingredients: [],
          instructions: [],
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
        },
      ],
      total: 1,
      skip: 0,
      limit: 12,
    })

    await renderScreen()

    expect(await screen.findByText('Pancakes')).toBeTruthy()
  })
})
