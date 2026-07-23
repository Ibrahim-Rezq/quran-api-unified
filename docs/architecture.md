# Architecture — quran-api-unified

## The one rule

The library is **ports-and-adapters**. There is a provider-agnostic **core** (composition,
selection, the unified schema, typed results) and one **port** — the `Adapter` contract —
behind which every provider sits. Dependencies point inward: adapters and the pure core know
nothing about the network. **Pure logic never does I/O.** An adapter is *declarative* — a
`buildUrl` string recipe plus a **pure** `transform` — and the client's fetch layer is the
only code that touches the network. Time and randomness, if ever needed, are injected.

## Layers & folder map

```
src/
  index.ts            — public API surface (named exports only; NO default exports)
  client.ts           — createQuranClient(options) factory = the composition root
  core/
    compose.ts        — single-call fan-out per concern + merge → one unified result (PURE)
    select.ts         — per-concern ordered preference + fallback chain (PURE; pluggable)
    schema.ts         — Unified{Verse,Audio,Translation,Tafsir} + merged result types
    result.ts         — typed Result union + attempt-trail helpers
    errors.ts         — typed error values (config / adapter-not-found / provider / all-failed)
    http.ts           — the ONLY I/O: fetch wrapper (timeout, proxy, json/text, injectable fetch)
    constants.ts      — base URLs, default timeout, proxy URL, retry counts (no magic values)
  ports/
    adapter.ts        — the Adapter port: capabilities + per-concern { buildUrl, transform, … }
  adapters/
    index.ts          — builtinAdapters registry
    <provider>.ts     — one file per provider (kebab-case name; snake_case `id` inside)
  validation/
    index.ts          — OPTIONAL zod entry, published as 'quran-api-unified/zod'
    schema.ts
```

Each folder's job: `core` orchestrates and defines shapes; `ports` is the single contract;
`adapters` are declarative provider descriptions; `client` is the one composition root that
wires the fetch layer to the adapters; `validation` is an optional, dependency-gated add-on.

## Import-boundary table (lint-enforced)

Enforced with ESLint `no-restricted-imports` / `eslint-plugin-import`. A deliberate bad import
is committed once during bootstrap to prove the rule fires.

| Module | May import | Hard no |
| --- | --- | --- |
| `core/schema.ts`, `core/result.ts`, `core/errors.ts` | types only, each other | anything that does I/O |
| `core/constants.ts` | nothing | everything |
| `core/http.ts` | `core/{errors,constants}`, `ports` | `adapters/*`, `core/{compose,select}` |
| `core/compose.ts`, `core/select.ts` | `core/{schema,result,errors}`, `ports` | **`core/http.ts`**, concrete `adapters/*` |
| `ports/adapter.ts` | `core/schema` (types) | everything else |
| `adapters/*` | `ports`, `core/{schema,constants}` | **`core/http.ts`**, `client.ts` |
| `client.ts` | `core/*`, `ports`, `adapters/index` | — (composition root) |
| `validation/*` | `core/schema` (types), `zod` | `core/http`, `adapters/*` |
| `index.ts` | `client`, `adapters/index`, `core` types/errors | — |

**The boundary that matters:** pure logic (`adapters/*`, `core/{compose,select,schema,
result}`) must never import `core/http.ts`.

## Runtime & I/O model

No UI, no rendering. The library is a client over remote HTTP APIs and must run unchanged in
Node ≥18, browsers, Deno, and Bun. It uses the global `fetch` (injectable via
`options.fetch`), declares no Node built-ins, and is `sideEffects: false` so bundlers
tree-shake freely. Concerns fan out **in parallel**; each concern runs its own ordered
preference + fallback-on-error chain with a per-request timeout.

## Canonical patterns

- **Adapter port** — `capabilities` + per-concern `{ buildUrl(q, ctx), transform(raw, q, ctx),
  responseType?, useProxy?, headers? }`; `transform` is pure. See `docs/stack.md` §3.
- **Client factory** — `createQuranClient(options)` returns `{ get, listAdapters,
  registerAdapter }`; functions only, no classes; `fetch`, `timeout`, `proxy`, `credentials`,
  and extra `adapters` injected via options; a lazily-bound default client also exposes a
  top-level `get()`.
- **Typed results** — `get()` returns `{ ok:true, value, attempts } | { ok:false, error,
  attempts }`; each concern part carries its own `ok`/`error`/`source`/`attempts`; failures
  are data, only misuse throws (ADR-0003).
- **Selection & fallback** — pure `select()` produces the ordered candidate list per concern;
  `compose()` fans out and merges (ADR-0004).

See the ADRs in `docs/adr/` for the rationale behind each locked choice.
