export type PaginatedPage = {
  skip: number
  limit: number
  total: number
}

export const getNextPageSkip = (page: PaginatedPage): number | undefined => {
  const nextSkip = page.skip + page.limit
  return nextSkip < page.total ? nextSkip : undefined
}
