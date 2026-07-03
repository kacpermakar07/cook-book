import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native'

import { recipesApi } from '@api/Recipe/recipe.api'
import type { Recipe, RecipesResponse } from '@api/Recipe/recipe.types'
import RecipeListScreen from '../../src/app/index'

jest.mock('@api/Recipe/recipe.api')

const mockPush = jest.fn()
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: mockPush }),
  useFocusEffect: (effect: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock() factories can't reference outer-scope imports (babel-plugin-jest-hoist)
    require('react').useEffect(effect, [effect])
  },
}))

const mockedRecipesApi = jest.mocked(recipesApi)

function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
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
    ...overrides,
  }
}

function makeResponse(
  recipes: Recipe[],
  overrides: Partial<RecipesResponse> = {},
): RecipesResponse {
  return { recipes, total: recipes.length, skip: 0, limit: 12, ...overrides }
}

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
  beforeEach(() => {
    mockPush.mockReset()
  })

  it('shows neither the list nor the error state while recipes are loading', async () => {
    mockedRecipesApi.list.mockReturnValue(new Promise(() => {}))

    await renderScreen()

    expect(screen.queryByText('Pancakes')).toBeNull()
    expect(screen.queryByText('Try again')).toBeNull()
  })

  it('renders the recipe list and total count once loaded', async () => {
    mockedRecipesApi.list.mockResolvedValue(
      makeResponse([makeRecipe()], { total: 1 }),
    )

    await renderScreen()

    expect(await screen.findByText('Pancakes')).toBeTruthy()
    expect(screen.getByText('Available recipes: 1')).toBeTruthy()
  })

  it('shows the error state and retries the query on retry press', async () => {
    mockedRecipesApi.list.mockRejectedValueOnce(new Error('Network Error'))
    mockedRecipesApi.list.mockResolvedValueOnce(
      makeResponse([makeRecipe()], { total: 1 }),
    )

    await renderScreen()

    const retryButton = await screen.findByText('Try again')
    fireEvent.press(retryButton)

    expect(await screen.findByText('Pancakes')).toBeTruthy()
    expect(mockedRecipesApi.list).toHaveBeenCalledTimes(2)
  })

  it('navigates to recipe details when a card is pressed', async () => {
    mockedRecipesApi.list.mockResolvedValue(
      makeResponse([makeRecipe({ id: 42 })], { total: 1 }),
    )

    await renderScreen()

    fireEvent.press(await screen.findByText('Pancakes'))

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/recipe/[id]',
      params: { id: '42' },
    })
  })

  it('debounces search input and requeries with the typed text', async () => {
    mockedRecipesApi.list.mockResolvedValue(makeResponse([makeRecipe()]))

    await renderScreen()
    await screen.findByText('Pancakes')

    fireEvent.changeText(
      screen.getByPlaceholderText('Search recipes...'),
      'pizza',
    )

    await waitFor(() => {
      expect(mockedRecipesApi.list).toHaveBeenCalledWith(
        expect.objectContaining({ query: 'pizza' }),
      )
    })
  })
})
