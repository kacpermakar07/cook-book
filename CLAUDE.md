# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note from the Expo template (see `AGENTS.md`): Expo SDK 57 introduced breaking changes — check the versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing Expo-specific code.

## What this is

A small recruitment-task app: two screens (recipe list, recipe details) backed by the public, unauthenticated `https://dummyjson.com/recipes` API. No backend, no auth, no deploy. Kept deliberately dependency-light.

## Stack

- Expo SDK 57 + Expo Router (typed routes, file-based routing in `src/app`) — this is React Navigation under the hood
- React 19 / React Native 0.86, TypeScript strict
- **Native only (iOS/Android) — no web target.** `react-dom`/`react-native-web` are not installed; don't reintroduce web-only code (e.g. `Platform.select({ web: ... })` branches, `.web.ts` platform files, `web` block in `app.json`) unless the user asks for web support back.
- TanStack Query + axios for data fetching (list pagination, search, details)
- expo-image for list/detail photos (better caching/perf than core `Image`)
- @tabler/icons-react-native (+ react-native-svg peer) for icons
- react-i18next + i18next for translations (PL default, EN fallback)
- No client-state library, no forms library — not needed for this scope
- Package manager: yarn (classic 1.x)
- Node.js >=20 (see `engines` in `package.json`) for `yarn test`'s `node --import tsx --test`
- Jest + `jest-expo` + `@testing-library/react-native` for screen-level component tests (`yarn test:screens`) — separate from the `node:test` suite; see Testing section

## Commands

- `yarn start` / `yarn android` / `yarn ios` — run the app
- `yarn tsc` — typecheck (`tsc --noEmit`)
- `yarn lint` / `yarn lint:fix` — eslint (flat config, `eslint-config-expo/flat` + `eslint-config-prettier`)
- `yarn prettier:fix` — format
- `yarn test` — run the pure-logic/API-layer suite (`node --import tsx --test`, recursively discovers `*.test.ts`)
- `yarn test:screens` — run the screen component tests (`jest --forceExit`, only matches `tests/**/*.test.tsx`)
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
  hooks/          useColorScheme (thin re-export of react-native's), useTheme, useDebouncedValue
  utils/          getErrorMessage / getErrorStatus — axios error parsing helpers used by ErrorState
  i18n/           i18n.ts init + locales/{pl,en}/common.json (pl default, en fallback; keep keys identical between languages)
  constants/      theme.ts — Colors tokens, useTheme reads from here
```

API layer convention: `recipe.api.ts` (plain HTTP calls) → `recipe.queryKeys.ts` (centralized keys) → `recipe.hooks.ts` (`useRecipesInfinite`/`useRecipe`). Screens import only from `recipe.hooks.ts`.

Tests live under a top-level `tests/` directory that mirrors `src/`'s folder structure (e.g. `src/api/Recipe/recipe.api.ts` → `tests/api/Recipe/recipe.api.test.ts`), not co-located with source files. Test files import the code under test via the path aliases below (e.g. `@api/Recipe/recipe.api`), not relative paths — `tests/` sits outside `src/`, so `../../src/...` would be worse than just using the alias.

## Path aliases

`@api/*`, `@components/*`, `@constants/*`, `@hooks/*`, `@i18n/*`, `@providers/*`, `@utils/*` → `src/{folder}/*`; `@assets/*` → `./assets/*`. Defined in `tsconfig.json`'s `compilerOptions.paths`. Since Expo SDK ~50+, `@expo/metro-config` reads `tsconfig.json` paths directly and wires them into Metro's resolver at runtime/build time — verified by exporting a real bundle (`npx expo export`); `babel.config.js` (see Testing section) exists only for Jest's `babel-jest` transform and plays no part in this. Same-folder imports (e.g. `useTheme.ts` → `./useColorScheme`) stay relative rather than going through an alias. When adding a new top-level `src/` folder that needs importing from elsewhere, add its alias to both `tsconfig.json` **and** `jest.config.js`'s `moduleNameMapper` (Metro/tsc read the former; Jest only reads the latter).

## Conventions

- Named exports only, no default exports — **except** Expo Router route files (`_layout.tsx`, `index.tsx`, `recipe/[id].tsx`), which must keep Expo's required default-export/filename convention.
- File name = name of its main export; no `index.ts`/`index.tsx` barrel files.
- StyleSheet co-located in the same file as the component.

## Testing

Two separate, non-overlapping test runners, both rooted at `tests/`:

1. **`node:test` + `tsx`** (`yarn test`) — pure logic and API-layer tests, `*.test.ts` only (node's default `--test` discovery doesn't match `.tsx`, so these two suites never collide):
   - **Pure logic** (`tests/api/Recipe/getNextPageSkip.test.ts`, `tests/utils/getErrorMessage.test.ts`, `tests/utils/getErrorStatus.test.ts`) — no mocking needed.
   - **API layer** (`tests/api/Recipe/recipe.api.test.ts`) — mocks `axiosClient.get` via node:test's built-in `t.mock.method`, no network calls, no extra mocking library.
2. **Jest + `jest-expo`** (`yarn test:screens`) — screen-level component tests, `*.test.tsx` only (`jest.config.js`'s `testMatch` is scoped to `tests/**/*.test.tsx`), rendering the real `src/app/index.tsx` and `src/app/recipe/[id].tsx` default exports with `@testing-library/react-native`:
   - `tests/app/RecipeListScreen.test.tsx`, `tests/app/recipe/RecipeDetailsScreen.test.tsx`.
   - Mocks `@api/Recipe/recipe.api` (same seam as the node:test API-layer tests) and `expo-router` (`Stack.Screen`/`useRouter`/`useLocalSearchParams`) per test file; real i18n (`jest.setup.ts` imports `@i18n/i18n`) and real TanStack Query (`QueryClientProvider` wrapping each render) are used for higher-fidelity assertions.
   - `react-native-safe-area-context` is mocked in `jest.setup.ts` via its own shipped `jest/mock` export (needed by `RecipeListHeader`'s `useSafeAreaInsets`).
   - Run with `--forceExit`: Jest doesn't exit cleanly on its own here (leftover timers from `useDebouncedValue`/TanStack Query's notify manager) — this is cosmetic (all assertions still pass; `console.error` act warnings from those same background timers are similarly harmless noise), not a real leak to chase down further for this scope.
   - `@testing-library/react-native@14`'s `render` is `async` (backed by the new non-Jest-coupled `test-renderer` package, a peer dependency) — always `await render(...)`, and query the `screen` singleton it populates (not `UNSAFE_getByType`, which isn't exposed on `screen`, only on a direct render result — prefer black-box `queryByText`/`findByText` assertions anyway).

**History**: component-rendering tests were first attempted via `node:test` + `react-native-testing-mocks` (a non-Jest RN mocking shim) to avoid adding Jest. That path was re-verified in 2026-07-02 and is a dead end against RN 0.86: even a bare `require('react-native-testing-mocks/register')` crashes on `NativeModules` invariant errors, because RN's native-bridge mocks are only actively maintained as the Jest-specific `@react-native/jest-preset` (used internally by `jest-expo`) — the third-party non-Jest shim has drifted out of sync with current RN internals. Jest + `jest-expo` is therefore the actual dependency floor for real component rendering, not a "nice to have" alternative.
