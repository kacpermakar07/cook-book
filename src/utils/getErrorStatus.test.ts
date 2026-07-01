import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getErrorStatus } from './getErrorStatus';

test('returns the HTTP status from an axios error response', () => {
  const error = { isAxiosError: true, response: { status: 404 } };
  assert.equal(getErrorStatus(error), 404);
});

test('returns undefined when there is no response (e.g. network error)', () => {
  const error = { isAxiosError: true };
  assert.equal(getErrorStatus(error), undefined);
});

test('returns undefined for non-axios errors', () => {
  assert.equal(getErrorStatus(new Error('boom')), undefined);
});
