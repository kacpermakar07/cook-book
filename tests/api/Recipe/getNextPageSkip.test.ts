import assert from 'node:assert/strict'
import { test } from 'node:test'

import { getNextPageSkip } from '@api/Recipe/getNextPageSkip'

test('returns the next skip when more pages remain', () => {
  assert.equal(getNextPageSkip({ skip: 0, limit: 12, total: 50 }), 12)
  assert.equal(getNextPageSkip({ skip: 36, limit: 12, total: 50 }), 48)
})

test('returns undefined once the last page is reached', () => {
  assert.equal(getNextPageSkip({ skip: 48, limit: 12, total: 50 }), undefined)
  assert.equal(getNextPageSkip({ skip: 0, limit: 12, total: 0 }), undefined)
})

test('returns undefined when skip + limit lands exactly on total', () => {
  assert.equal(getNextPageSkip({ skip: 38, limit: 12, total: 50 }), undefined)
})
