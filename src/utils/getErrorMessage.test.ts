import assert from 'node:assert/strict'
import { test } from 'node:test'

import { getErrorMessage } from './getErrorMessage'

test('returns the API message from an axios error response body', () => {
  const error = {
    isAxiosError: true,
    message: 'Request failed with status code 404',
    response: { data: { message: 'Recipe not found' } },
  }
  assert.equal(getErrorMessage(error), 'Recipe not found')
})

test('falls back to the axios error message when the response has no body message', () => {
  const error = { isAxiosError: true, message: 'Network Error' }
  assert.equal(getErrorMessage(error), 'Network Error')
})

test('returns the message of a plain Error', () => {
  assert.equal(getErrorMessage(new Error('boom')), 'boom')
})

test('returns a fallback string for unknown error shapes', () => {
  assert.equal(getErrorMessage('nope'), 'Unknown error')
  assert.equal(getErrorMessage(null), 'Unknown error')
})
