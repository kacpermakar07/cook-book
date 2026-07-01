import { axiosClient } from '../axiosClient';
import type { Recipe, RecipesResponse } from './recipe.types';

export const RECIPES_PAGE_SIZE = 12;

export type ListRecipesParams = {
  skip: number;
  query?: string;
};

export const recipesApi = {
  list: ({ skip, query }: ListRecipesParams): Promise<RecipesResponse> => {
    const endpoint = query ? '/recipes/search' : '/recipes';
    return axiosClient
      .get<RecipesResponse>(endpoint, {
        params: { limit: RECIPES_PAGE_SIZE, skip, q: query || undefined },
      })
      .then((response) => response.data);
  },
  getById: (id: number): Promise<Recipe> =>
    axiosClient.get<Recipe>(`/recipes/${id}`).then((response) => response.data),
};
