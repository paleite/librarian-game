# Librarian Game

Browser game inspired by the organization and progression loop of *Librarian: Tidy Up the Arcane Library!*.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zod for static game-data validation
- Static export to GitHub Pages

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

The production build writes the static site to `out/`.

## Deployment

Pushes to `main` run `.github/workflows/deploy-pages.yml`. The workflow builds a static export and deploys `out/` to GitHub Pages.

The deployed project site is expected at:

```text
https://paleite.github.io/librarian-game/
```
