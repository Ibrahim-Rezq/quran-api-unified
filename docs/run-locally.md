# Run locally — quran-api-unified

This is a library, so "running it" means building, testing, and previewing the docs — there
is no app server. Package manager: **pnpm**. Node **≥18**.

## Install

```bash
pnpm install
```

## Everyday commands

```bash
pnpm build          # tsup → dual ESM + CJS + .d.ts in dist/
pnpm dev            # tsup --watch (rebuild on change)
pnpm typecheck      # tsc --noEmit (strict)
pnpm test           # Vitest: unit + integration (mocked fetch / fixtures) — the default suite
pnpm test:watch     # Vitest watch mode
pnpm lint           # ESLint incl. import-boundary rules
pnpm format         # Prettier
```

## Package correctness & bundle smoke

```bash
pnpm pkg:check      # publint + @arethetypeswrong/cli — dual-format + types resolve correctly
pnpm smoke:bundle   # build, then import the artifact as ESM + CJS + types, and drive the
                    # browser bundle via Playwright (gates release)
```

## Live provider smoke (opt-in — hits real APIs)

```bash
pnpm test:live      # runs the real-provider suite; NOT part of the default/CI run.
                    # Needs credentials only for providers that require them — copy
                    # .env.example to .env and fill what you want to exercise.
```

## Docs site (VitePress)

```bash
pnpm docs:dev       # local docs preview (Arabic default locale + English)
pnpm docs:build     # build the static docs site (must pass in CI)
pnpm api:docs       # regenerate the API reference from TSDoc (TypeDoc)
```

## The full local gate (all must exit 0 before pushing)

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm pkg:check && pnpm docs:build
```

## Environment

The core needs **no** environment variables. `.env.example` lists only the optional provider
credentials used by `pnpm test:live`; the library itself never reads `process.env`.
