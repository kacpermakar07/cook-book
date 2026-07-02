import assert from 'node:assert/strict'
import { test } from 'node:test'

import { axiosClient } from '@api/axiosClient'
import { RECIPES_PAGE_SIZE, recipesApi } from '@api/Recipe/recipe.api'

test('list() calls /recipes with limit/skip when there is no search query', async (t) => {
  const getMock = t.mock.method(axiosClient, 'get', async () => ({
    data: { recipes: [], total: 0, skip: 24, limit: RECIPES_PAGE_SIZE },
  }))

  await recipesApi.list({ skip: 24 })

  assert.equal(getMock.mock.calls.length, 1)
  const [url, config] = getMock.mock.calls[0].arguments
  assert.equal(url, '/recipes')
  assert.deepEqual(config?.params, {
    limit: RECIPES_PAGE_SIZE,
    skip: 24,
    q: undefined,
  })
})

test('list() calls /recipes/search with q when a search query is given', async (t) => {
  const getMock = t.mock.method(axiosClient, 'get', async () => ({
    data: { recipes: [], total: 0, skip: 0, limit: RECIPES_PAGE_SIZE },
  }))

  await recipesApi.list({ skip: 0, query: 'pizza' })

  const [url, config] = getMock.mock.calls[0].arguments
  assert.equal(url, '/recipes/search')
  assert.equal(config?.params.q, 'pizza')
})

test('getById() requests /recipes/:id and returns the response body', async (t) => {
  const getMock = t.mock.method(axiosClient, 'get', async () => ({
    data: { id: 1, name: 'Test recipe' },
  }))

  const recipe = await recipesApi.getById(1)

  assert.equal(getMock.mock.calls[0].arguments[0], '/recipes/1')
  assert.equal(recipe.name, 'Test recipe')
})
