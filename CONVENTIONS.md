# CONVENTIONS.md — quran-api-unified

Code conventions. Every file should look like the same person wrote it.

## Exports & style

- **Named exports everywhere. No default exports** — anywhere. Better tree-shaking and stable
  import names for both ESM and CJS consumers.
- **Functions only, no classes.** The public API is the `createQuranClient(...)` factory;
  errors are typed **values** in results, not thrown class instances (except misuse — see
  below). Composition via factory + injected deps, no DI framework.
- **TSDoc on every public export** (required — it feeds the API reference). Internal comments
  only when warranted: complex or many-stepped logic, a constraint, or a non-obvious reason —
  written in a natural human voice, explaining *why*, not *what*.

## Naming

| Thing | Rule | Example |
| --- | --- | --- |
| Logic files | `camelCase.ts`, verb+noun | `selectProviders.ts`, `composeResult.ts` |
| Adapter files | `kebab-case.ts` by provider | `quran-foundation.ts`, `alquran-cloud.ts` |
| Adapter `id` (in code) | `snake_case`, unique | `quran_foundation`, `alquran_cloud` |
| Static data files | `snake_case.ts` | `surah_index.ts` |
| Types/interfaces | `PascalCase` | `UnifiedVerse`, `Adapter`, `GetResult` |
| Constants | `UPPER_SNAKE_CASE` | `DEFAULT_TIMEOUT_MS`, `ALQURAN_CLOUD_BASE` |

## Logging & errors

- **The library is silent.** No `console.*` in committed code. Diagnostics travel in the typed
  result (`attempts`, `error`) or through an optional `onDiagnostic` / `logger` hook the caller
  passes in options.
- **Typed results, not exceptions.** Fetch operations return a discriminated union; provider
  and network failures are **data**. Only *misuse* throws — bad config, an unknown *named*
  adapter.

```ts
const res = await client.get({ ref: { surah: 1, ayah: 1 }, include: ['text', 'audio'] })
if (!res.ok) {
  // res.error is a typed QuranError; res.attempts lists every provider tried
  return handle(res.error)
}
res.value.text?.ok      // each concern part carries its own ok / error / source / attempts
res.value.text?.value   // the UnifiedVerse, when ok
```

## Constants

No magic numbers or strings. Base URLs, the default timeout, the proxy URL, and retry counts
live as named constants in `core/constants.ts`. A new named constant beats a new inline value.

## Reuse before create

Before adding anything: search `adapters/` for an existing provider that already covers the
concern; check `ports/adapter.ts` for the contract; check `core/constants.ts` before
hardcoding a URL or number. Extend the shared shape rather than forking a parallel one.

## Commits & versioning

- **Conventional Commits**, scope = the module most affected. Examples:
  `feat(adapters): add mp3quran audio adapter`, `fix(core): honor per-concern timeout in
  compose`, `docs(providers): correct alquran.cloud rate-limit note`.
- **Versioning is owned by Changesets** — do not hand-edit `package.json` version. Every
  user-facing change ships with a Changeset (`pnpm changeset`) at the right bump level:
  `feat` = MINOR, `fix`/`perf`/`refactor` = PATCH, `docs`/`test`/`chore` = none. Pre-1.0:
  MAJOR stays 0 and breaking changes bump MINOR.
- **Merge:** squash; the PR title becomes the commit and must be Conventional-Commits valid.
- **Git hard rules:** never `git add -A` (stage specific files); never commit `.env` or build
  artifacts; never `--no-verify`; delete the branch after merge.

## Testing patterns

- **Colocated** tests ship in the same PR (CI-enforced). Full matrix in `docs/stack.md` §8.
- Pure `core/*` and adapter `transform`s: Vitest node, table-driven, zero mocks; adapter
  transforms run against recorded **fixtures**. I/O (`http`/`client`): Vitest with an
  **injected fake `fetch`** — no network-mock library.
- **Mandatory test paths** (always tested when touched): provider-fallback · partial-results ·
  credentialed-adapter · custom-adapter (`registerAdapter`) · dual-consumption of the built
  artifact.
- Property-based tests for the selection/fallback combinatorics.
