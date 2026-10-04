# EnglishQuiz

English exercises by CEFR level (A1–C2). React SPA + PWA, front-end only, Bootstrap 5. The app is entirely in English.

Design documents are in [`specs/`](specs/). All code (including `package.json` and `node_modules`) is in [`src/`](src/); the build goes to `build/`.

## Commands (run inside `src/`)

```
cd src
npm install
npm run dev       # dev server (or run dev.bat from the repository root)
npm test          # unit + UI tests (Vitest)
npm run lint      # type-check (tsc --noEmit)
npm run build     # production build -> ../build
npm run preview   # serve ../build locally
```

`CHECK_QUOTAS=1 npm test` also checks the content targets (2000 questions per level, see `specs/07-contenuti.md`).

## Deploy

`build/` is a static site (relative base path, hash routing): copy it to any static host or sub-folder.

## Content

Questions live in `src/data/<level>/<type>.json`. Every question needs an English `explanation` (the rule) and, for choice questions, a `wrongReasons` entry for each wrong option. See `specs/02-tipologie-domande.md` and `specs/07-contenuti.md`.
