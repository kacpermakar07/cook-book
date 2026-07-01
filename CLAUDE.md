# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note from the Expo template (see `AGENTS.md`): Expo SDK 57 introduced breaking changes — check the versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing Expo-specific code.

## What this is

A small recruitment-task app: two screens (recipe list, recipe details) backed by the public, unauthenticated `https://dummyjson.com/recipes` API. No backend, no auth, no deploy. Kept deliberately dependency-light.

## Stack

- Expo SDK 57 + Expo Router (typed routes, file-based routing in `src/app`) — this is React Navigation under the hood
- React 19 / React Native 0.86, TypeScript strict
- TanStack Query + axios for data fetching (list pagination, search, details)
- expo-image for list/detail photos (better caching/perf than core `Image`)
- react-i18next + i18next for translations (PL default, EN fallback)
- No client-state library, no forms library — not needed for this scope
- Package manager: yarn (classic 1.x)
- Node.js >=20 (see `engines` in `package.json`) for `yarn test`'s `node --import tsx --test`

## Commands

- `yarn start` / `yarn android` / `yarn ios` / `yarn web` — run the app
- `yarn tsc` — typecheck (`tsc --noEmit`)
- `yarn lint` / `yarn lint:fix` — eslint (flat config, `eslint-config-expo/flat` + `eslint-config-prettier`)
- `yarn prettier:fix` — format
- `yarn test` — run the test suite (`node --import tsx --test`, recursively discovers `*.test.ts(x)`)
- `yarn prebuild` — `expo prebuild --clean` (regenerates native `ios`/`android`, gitignored)

## Git hooks

- husky pre-push only (no pre-commit): runs `yarn lint && yarn tsc` (`.husky/pre-push`) — deliberately does not run `yarn test` on push

## Structure

```
src/
  app/            Expo Router routes: index.tsx (recipe list), recipe/[id].tsx (recipe details)
  api/            axiosClient.ts (baseURL hardcoded to https://dummyjson.com — no env switching, single fixed public API)
                  Recipe/recipe.types.ts + recipe.api.ts + recipe.queryKeys.ts + recipe.hooks.ts + getNextPageSkip.ts
  components/     RecipeCard.tsx (list item), ErrorState.tsx (message + retry, shared by both screens)
  providers/      AppProviders.tsx — wraps QueryClientProvider; mounted in src/app/_layout.tsx
  hooks/          useColorScheme (+ .web variant for SSR-safe hydration), useTheme, useDebouncedValue
  utils/          getErrorMessage / getErrorStatus — axios error parsing helpers used by ErrorState
  i18n/           i18n.ts init + locales/{pl,en}/common.json (pl default, en fallback; keep keys identical between languages)
  constants/      theme.ts — Colors/Fonts/Spacing tokens, useTheme reads from here
```

API layer convention: `recipe.api.ts` (plain HTTP calls) → `recipe.queryKeys.ts` (centralized keys) → `recipe.hooks.ts` (`useRecipesInfinite`/`useRecipe`). Screens import only from `recipe.hooks.ts`.

## Conventions

- Named exports only, no default exports — **except** Expo Router route files (`_layout.tsx`, `index.tsx`, `recipe/[id].tsx`), which must keep Expo's required default-export/filename convention.
- File name = name of its main export; no `index.ts`/`index.tsx` barrel files.
- StyleSheet co-located in the same file as the component.

## Testing

Uses `node:test` + `tsx` (per the task's suggested stack), not Jest. Two layers are wired up and pass:

1. **Pure logic** (`getNextPageSkip.test.ts`, `getErrorMessage.test.ts`, `getErrorStatus.test.ts`) — no mocking needed.
2. **API layer** (`recipe.api.test.ts`) — mocks `axiosClient.get` via node:test's built-in `t.mock.method`, no network calls, no extra mocking library.

**Component-rendering tests were attempted and deliberately dropped.** `@testing-library/react-native@14` needs Node ≥22.13 (fine) but also `react-native-testing-mocks` to require 'react-native' outside Jest, which in turn needs `@react-native/babel-preset`/`@babel/register`/`@babel/core` as explicit top-level dependencies (not just transitive) — and that package only declares support up to Node 22.6, while this machine runs 22.19. Installing the extra Babel packages to chase this down further would have meant a growing pile of glue dependencies for a "minimal dependencies" task, so it was cut once the pure-logic and API-layer tests were solid. If revisiting: either add the missing `@react-native/babel-preset`/`@babel/register`/`@babel/core` devDependencies and accept the Node-version mismatch risk, or switch to Jest + `jest-expo` (the fully-supported, documented path) for component tests specifically.
