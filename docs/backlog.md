# Backlog — quran-api-unified

Tickets are GitHub issues (referenced `#N`). Build in order; the first two are one-time
foundations. Each ticket has one acceptance criterion. Follow `docs/workflow.md` for every one.

## MVP

| # | Ticket | Acceptance criterion |
| --- | --- | --- |
| 1 | **Bootstrap** — package.json (`type: module`, exports map, scripts), tsup, Vitest, ESLint/Prettier/Husky/lint-staged/commitlint, Changesets, Playwright, VitePress + TypeDoc | `pnpm lint && typecheck && test && build && pkg:check && docs:build` all exit 0 on an empty skeleton |
| 2 | **Folder skeleton + import boundaries** — `src/{core,ports,adapters,validation}`, `test/{fixtures,helpers}`; ESLint import-boundary rules | a deliberate adapter→`core/http.ts` import makes `lint` fail |
| 3 | **Unified schema + result types** — `core/schema.ts`, `core/result.ts`, `core/errors.ts` | `Unified{Verse,Audio,Translation,Tafsir}`, the `GetResult` union, and typed errors compile under strict TS with no `any` on the surface |
| 4 | **HTTP leaf + client factory** — `core/http.ts`, `core/constants.ts`, `client.ts` | `createQuranClient()` returns `{ get, listAdapters, registerAdapter }`; `http` handles timeout/proxy/json+text with an injectable fetch |
| 5 | **Selection + composition** — `core/select.ts`, `core/compose.ts` | concerns fan out in parallel; each has its own ordered preference + fallback-on-error; partial-results honored; property tests green |
| 6 | **Adapter port + registry** — `ports/adapter.ts`, `adapters/index.ts` | the `Adapter` contract + `builtinAdapters`; `registerAdapter()` makes a custom adapter selectable including in fallback |
| 7 | **Text adapters** — `quran_foundation`, `alquran_cloud`, `quran_api_edge`, `quran_hub`, `quran_finder` + fixtures | each maps its fixture to `UnifiedVerse`; `buildUrl` + malformed-input tests pass; provider docs present |
| 8 | **Audio adapter(s)** — `alquran_cloud` audio (+ `mp3quran`) + fixtures | returns a `UnifiedAudio` (ayah + surah scope) with a working URL; provider docs present |
| 9 | **Translation adapter** — alquran.cloud translation editions (keyless) + fixture | `get({ …, include:['translation'] })` returns a `UnifiedTranslation` for a chosen edition |
| 10 | **Tafsir adapter** — a keyless static tafsir source + fixture | `get({ …, include:['tafsir'] })` returns a `UnifiedTafsir`; keyless happy path works |
| 11 | **Optional zod entry** — `src/validation/` published as `./zod` | `quran-api-unified/zod` parses valid fixtures + rejects malformed; a type-sync test keeps schemas aligned with the TS types |
| 12 | **Credentials support** — per-adapter credentials + Quran Foundation v4 OAuth2 | a credentialed adapter succeeds with creds and is skipped in auto-selection without them (throws only if named) |
| 13 | **Docs site + product docs** — VitePress (`ar` default + `en`), `README.md`/`.en.md`, `CONTRIBUTING.md`/`.en.md`, TypeDoc API reference | `docs:build` passes; README quick-start runs green in CI; every shipped adapter has `docs/providers/<id>.md` |
| 14 | **CI + release** — GitHub Actions checks, Node 18/20/22, Changesets publish, publint/attw, bundle smoke, scheduled live smoke | all checks required to merge; a dry-run `changeset publish` succeeds |
| 15 | **Examples + dual-consumption smoke** — `examples/{node-esm,node-cjs,typescript,browser}` | `pnpm smoke:bundle` imports the built artifact as ESM + CJS + types and the browser bundle runs green |

## Later (post-MVP)

- Additional audio / translation / tafsir providers beyond the seed set.
- **Juz** granularity (juz→verses index + multi-fetch).
- Health-aware / fastest-provider routing (v1 uses ordered preference + fallback).
- Caching, retry/backoff tuning, batch ranges, search, mushaf-page layouts.
