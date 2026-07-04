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

- Node.js >= 22.13
- Yarn (classic)

## Setup

```
yarn install
yarn start
```

Then scan the QR code with Expo Go, or press `a`/`i` for Android/iOS. No web target — this is a native-only app.

## Other commands

- `yarn tsc` — typecheck
- `yarn lint` / `yarn lint:fix` — eslint
- `yarn prettier:fix` — format
- `yarn test` — pure-logic and API-layer tests (`node:test`, no Jest)
- `yarn test:screens` — screen-level component tests (Jest + `jest-expo` + `@testing-library/react-native`)
