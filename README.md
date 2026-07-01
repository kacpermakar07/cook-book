# Cook Book

Expo (SDK 57) + React Native app with two screens — recipe list and recipe details — backed by the public [dummyjson recipes API](https://dummyjson.com/docs/recipes). No backend, no auth.

## Features

- Recipe list: name, photo, prep+cook time, difficulty
- Search by name (debounced, hits the API's `/recipes/search`)
- Infinite scroll pagination
- Pull-to-refresh
- Recipe details screen (photo, difficulty, time, servings, calories, ingredients, instructions)
- Loading and error states (with retry) on both screens

## Requirements

- Node.js >= 20
- Yarn (classic)

## Setup

```
yarn install
yarn start
```

Then press `w` for web, or scan the QR code with Expo Go / press `a`/`i` for Android/iOS.

## Other commands

- `yarn tsc` — typecheck
- `yarn lint` — eslint
- `yarn test` — run the test suite (`node:test`, no Jest)

See `CLAUDE.md` for stack details, structure, and testing notes (including a documented limitation around component-rendering tests).
