# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note from the Expo template (see `AGENTS.md`): Expo SDK 57 introduced breaking changes — check the versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing Expo-specific code.

## Stack

- Expo SDK 57 + Expo Router (typed routes, file-based routing in `src/app`)
- React 19 / React Native 0.86, TypeScript strict
- TanStack Query + axios for server state / HTTP
- react-hook-form + yup + @hookform/resolvers for forms
- react-i18next + i18next for translations (PL/EN)
- No client-state library (Zustand intentionally skipped) — add one only if a real cross-screen client-state need shows up
- Package manager: yarn (classic 1.x) — never use npm/npx for installs, only for one-off `npx expo ...` CLI invocations

## Commands

- `yarn start` / `yarn android` / `yarn ios` / `yarn web` — run the app
- `yarn tsc` — typecheck (`tsc --noEmit`)
- `yarn lint` / `yarn lint:fix` — eslint (flat config, `eslint-config-expo/flat` + `eslint-config-prettier`)
- `yarn prettier:fix` — format
- `yarn prebuild` — `expo prebuild --clean` (regenerates native `ios`/`android`, gitignored)
- `yarn build:*`, `yarn update:*`, `yarn submit:*` — EAS build/update/submit, see `eas.json` for profiles

## Git hooks

- husky pre-push only (no pre-commit): runs `yarn lint && yarn tsc` (`.husky/pre-push`)

## Environments

- Env switching goes through `app.config.ts` (not static `app.json`) via `EXPO_PUBLIC_ENV`, read from `.env` (see `.env.example`).
- Only `DEV` is implemented right now. The `PROD` branch in `getAppConfig()` in `app.config.ts` is written but commented out — uncomment and fill in real values (bundle id already decided: `com.cookbook.app`, no `.dev` suffix) once there is an actual production backend/API URL.
- `eas.json` already has a `production` build profile wired to `EXPO_PUBLIC_ENV=PROD`, but it will fail until the `PROD` case in `app.config.ts` is uncommented. `alpha`/`stage` profiles were omitted entirely (not just commented, since JSON has no comments) — add them back following the same pattern as `development`/`production` if those environments become necessary.
- No deep-linking `scheme` and no `extra.eas.projectId` yet — `npx eas init` will add the project id when EAS is actually set up.

## Structure

```
src/
  app/            Expo Router routes (file-based; _layout.tsx / index.tsx must keep Expo's required filenames + default export)
  features/       per-domain components/hooks (empty skeleton, no fake example files)
  api/            axiosClient.ts (axios instance, baseURL from Constants.expoConfig.extra.API_URL) + reactQueryClient.ts
                  per-domain API code should follow api/{Domain}/{domain}.api.ts + .queryKeys.ts + .hooks.ts (see below)
  components/     shared cross-feature components (empty skeleton)
  contexts/       cross-cutting context providers (empty skeleton)
  providers/      AppProviders.tsx — wraps QueryClientProvider, initializes i18n; mounted in src/app/_layout.tsx
  hooks/          useColorScheme (+ .web variant for SSR-safe hydration), useTheme
  utils/          getErrorMessage / getErrorStatus (axios error parsing helpers), fakeT (typed i18n key placeholder for yup schemas)
  forms/          use{Nazwa}Form.ts hooks go here (empty skeleton)
  i18n/           i18n.ts init + locales/{en,pl}/common.json (keep key structures identical between languages)
  constants/      theme.ts — Colors/Fonts/Spacing tokens, useTheme reads from here
```

## Conventions (from global rules, enforced in this repo)

- Named exports only, no default exports — **except** Expo Router route files (`_layout.tsx`, `index.tsx`, etc.), which must keep Expo's required default-export/filename convention.
- File name = name of its main export (e.g. `useTheme.ts`, `AppProviders.tsx`); no `index.ts`/`index.tsx` barrel files for components/hooks/features.
- StyleSheet co-located in the same file as the component, not a separate `.styles.ts`.
- API layer per domain: `{domain}.api.ts` (plain HTTP calls, no React Query) → `{domain}.queryKeys.ts` (centralized keys) → `{domain}.hooks.ts` (useQuery/useMutation). Components import only from `*.hooks.ts`, never directly from `*.api.ts`.
- Forms: one file per form in `src/forms/use{Nazwa}Form.ts` — yup schema, `InferType` type export, typed default values, `yupResolver`, exported `use{Nazwa}Form` hook. Validation messages go through `fakeT` (compile-time key check; real translation happens via `useTranslation`'s `t()` where the message is rendered, not inside the schema itself).
