export const recipeQueryKeys = {
  all: ['recipes'] as const,
  list: (query: string) => ['recipes', 'list', query] as const,
  detail: (id: number) => ['recipes', 'detail', id] as const,
};
