# Product Spec — quran-api-unified

A framework-agnostic JavaScript/TypeScript SDK that puts one consistent interface over
multiple Quran verse, audio, translation, and tafsir APIs, with provider selection and
automatic fallback, so a consuming app never has to know or care which provider served a
request.

## Users & core job

Developers building Quran apps (web, mobile, bots, backends) in JS or TS who don't want to
hard-couple their app to a single provider or juggle several providers' different endpoints
and schemas — core job: given a reference (ayah or surah) plus the pieces the caller asks for
(text, audio, translation, tafsir), fetch each from whatever provider is suitable/available,
normalize everything into one unified schema, and return it in a single call. The caller sees
the same shape regardless of source and can ignore the source entirely, or name a preferred
source with optional fallbacks.

## Platform & constraints

- Platform: **npm library (SDK)** — no UI, no framework, no database.
- Data: **remote HTTP APIs** — a pure client over several public Quran APIs; owns no storage.
- Runtimes: Node ≥18, browsers, Deno, Bun (universal; native `fetch`, injectable).
- Auth: **keyless by default**; optional per-provider credentials for providers that need
  them (e.g. Quran Foundation v4). A credentialed adapter without credentials is skipped in
  auto-selection and throws only if named explicitly.
- Distribution: **dual ESM + CJS + `.d.ts`**, published to npm (public).
- Docs: Arabic-primary + English mirror (product docs); code and these engineering docs are
  English.

## MVP features (in scope)

1. **Unified schema** — one normalized shape per concern (text / audio / translation /
   tafsir) with full TypeScript types. _Acceptance:_ every provider's response maps to the
   same documented shape; consumers never branch on source.
2. **Single-call composition** — `get({ ref, include:[...] })` fetches an ayah or surah with
   any requested concerns, fanning out per concern to the right provider and merging into one
   result. _Acceptance:_ one call returns text + audio + translation + tafsir, each annotated
   with the source that served it.
3. **Granularity: ayah + surah.** _Acceptance:_ the same call works for a single ayah and for
   a whole surah. (Juz is deferred — see Later.)
4. **Provider selection + fallback** — auto (ordered preference + fallback-on-error) and
   explicit (caller names a source + optional own fallback list, or defers to the SDK).
   _Acceptance:_ forcing the primary provider to fail still returns via a fallback, and the
   attempt trail records both.
5. **Adapter system** — per-provider adapters (call → transform → unified schema) plus a
   public `registerAdapter()`. _Acceptance:_ a user-defined adapter is selectable by `get()`
   exactly like a built-in, including in the fallback chain.
6. **Built-in adapters covering all four concerns** — the 5 text + 1 audio seed providers
   plus at least one translation and one tafsir provider. _Acceptance:_ every concern works at
   launch with zero configuration on the keyless providers.
7. **Credentials** — keyless by default; optional per-adapter credentials. _Acceptance:_ a
   credentialed provider succeeds with credentials and is skipped without them.
8. **Documentation** — thorough Arabic-primary bilingual docs: README, VitePress site,
   CONTRIBUTING with the adapter contract, and a per-provider reference for every shipped
   provider; TSDoc on every public export. _Acceptance:_ the README quick-start runs green in
   CI and every shipped adapter has its `docs/providers/<id>.md`.

## Later (out of scope for MVP)

- Additional audio, translation, and tafsir providers beyond the seed set.
- **Juz** granularity (needs a juz→verses index + multi-fetch).
- Health-aware / fastest-provider routing (v1 uses ordered preference + fallback).
- Caching, retry/backoff tuning, batch ranges, search, mushaf-page layouts.

## Success check (release smoke test)

Every clause must hold on the **published** package:

- In a fresh project, `npm i quran-api-unified` imports cleanly three ways — ESM `import`,
  CJS `require`, and a TypeScript import resolving full types from the shipped `.d.ts` (no
  `any` on public APIs).
- The same code runs on Node ≥18, in a browser bundle (no Node builtins), and on at least one
  of Deno / Bun.
- `get({ ref:{surah:1,ayah:1}, include:['text','audio','translation','tafsir'] })` returns one
  object with all four concerns populated from live providers, each matching its documented
  schema and annotated with its source.
- The identical call works for a whole surah (`ref:{surah:1}`).
- With the primary text provider forced to fail, the call still returns via a fallback and the
  attempt trail records the failure and the winner.
- Naming an explicit source returns from that source; a caller fallback list is honored in
  order; a named-but-unavailable provider surfaces a typed error.
- A credentialed provider succeeds with credentials and is skipped in auto-selection without
  them; the keyless happy path needs zero config.
- `registerAdapter()` with a user-defined provider makes it selectable, including in fallback.
- When every candidate provider fails, the caller gets one typed error carrying the
  per-provider attempts; raw exceptions and partial/undefined results never leak.
- If one requested concern has no available provider but others succeed, the result marks that
  concern unfulfilled (with its error) rather than failing the whole call.
- Every shipped adapter has its `docs/providers/<id>.md`, and the README quick-start example
  runs green in CI.
