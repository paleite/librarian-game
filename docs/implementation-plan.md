# Implementation Plan: Bootstrap Librarian Game

## Goal

Create a runnable Next.js project that statically exports to GitHub Pages and establishes the first stable game-data boundaries.

## Current state

**Current:** The repository is empty.

## Target design

The application uses Next.js App Router with `output: "export"`. Local development uses `/`. GitHub Actions production builds use `/librarian-game` as the base path.

The browser owns all runtime game state. Static catalog data is bundled at build time and validated with Zod.

```text
static catalog data
        ↓
Next.js static export
        ↓
GitHub Pages
        ↓
browser game runtime + local persistence
```

## File map

| Action | Path | Symbols | Purpose |
|---|---|---|---|
| Create | `package.json` | scripts, dependencies | Define the project runtime and validation commands. |
| Create | `next.config.ts` | `nextConfig` | Enable static export and GitHub Pages base path. |
| Create | `.github/workflows/deploy-pages.yml` | `build`, `deploy` | Build and publish `out/` on pushes to `main`. |
| Create | `src/app/layout.tsx` | `RootLayout` | Define the App Router root document. |
| Create | `src/app/page.tsx` | `Home` | Provide the first runnable application screen. |
| Create | `src/game/catalog/schema.ts` | catalog schemas | Validate build-time game catalog data. |
| Create | `src/game/catalog/sections.ts` | `sections` | Define the 31 known library sections. |
| Create | `src/game/state/game-state.ts` | `GameState` | Define the initial runtime state boundary. |

## Implementation steps

### 1. Configure a static Next.js application

**Files**

- `Create: package.json`
- `Create: next.config.ts`
- `Create: tsconfig.json`
- `Create: postcss.config.mjs`
- `Create: eslint.config.mjs`

**Changes**

- Use Next.js App Router with TypeScript.
- Set `output` to `export`.
- Use `/librarian-game` only during GitHub Actions builds.
- Disable Next.js image optimization because GitHub Pages has no image optimization server.
- Add `typecheck`, `lint`, and `build` commands.

**Validation**

- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `npm run build`.
- Confirm that `out/index.html` exists.

### 2. Add the initial game domain boundaries

**Files**

- `Create: src/game/catalog/schema.ts`
- `Create: src/game/catalog/sections.ts`
- `Create: src/game/state/game-state.ts`

**Changes**

- Validate section codes, floors, series volume counts, and book-series records with Zod.
- Define all 31 section identifiers and visual color families.
- Keep static catalog definitions separate from mutable runtime state.

**Validation**

- Confirm `sections.length === 31` in the rendered bootstrap screen.
- Confirm invalid catalog data fails during module evaluation rather than entering runtime state.

### 3. Add the first static application screen

**Files**

- `Create: src/app/layout.tsx`
- `Create: src/app/page.tsx`
- `Create: src/app/globals.css`

**Changes**

- Render a lightweight bootstrap screen.
- Show the section totals from the actual catalog module.
- Keep the page server-renderable and static-export compatible.

**Validation**

- Start `npm run dev` and confirm the page renders at `/`.
- Build in GitHub Actions and confirm assets resolve below `/librarian-game/`.

### 4. Deploy through GitHub Pages

**Files**

- `Create: .github/workflows/deploy-pages.yml`

**Changes**

- Trigger on pushes to `main` and manual dispatch.
- Run typecheck, lint, and build before deployment.
- Upload only `out/` as the Pages artifact.
- Deploy with the `github-pages` environment.

**Validation**

- Confirm the workflow reaches the deploy job.
- Confirm the published site loads at `https://paleite.github.io/librarian-game/` after GitHub Pages is configured to use GitHub Actions.

## Edge cases and failure behavior

- Local development must not use the production base path.
- Production assets must resolve below `/librarian-game/`.
- Static export must not depend on route handlers, Server Actions, runtime cookies, or a Node server.
- Invalid static catalog data must fail fast during development/build.
- The first workflow uses `npm install` because the repository has no generated lockfile yet. Commit the generated lockfile and switch CI to `npm ci` afterward.

## Acceptance criteria

- The repository contains a complete Next.js project rather than an empty scaffold.
- `main` can build to a static `out/` directory.
- GitHub Actions can deploy `out/` to GitHub Pages.
- The application has explicit static-data and runtime-state boundaries.
- All 31 library sections are represented in validated static data.
