export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard'

export type Recipe = {
  id: number
  name: string
  ingredients: string[]
  instructions: string[]
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  difficulty: RecipeDifficulty
  cuisine: string
  caloriesPerServing: number
  tags: string[]
  image: string
  rating: number
  reviewCount: number
  mealType: string[]
}

export type RecipesResponse = {
  recipes: Recipe[]
  total: number
  skip: number
  limit: number
}
