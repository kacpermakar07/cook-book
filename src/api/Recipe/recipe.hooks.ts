import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getNextPageSkip } from './getNextPageSkip';
import { recipesApi } from './recipe.api';
import { recipeQueryKeys } from './recipe.queryKeys';

export const useRecipesInfinite = (query: string) =>
  useInfiniteQuery({
    queryKey: recipeQueryKeys.list(query),
    queryFn: ({ pageParam }) => recipesApi.list({ skip: pageParam, query }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => getNextPageSkip(lastPage),
  });

export const useRecipe = (id: number) =>
  useQuery({
    queryKey: recipeQueryKeys.detail(id),
    queryFn: () => recipesApi.getById(id),
  });
