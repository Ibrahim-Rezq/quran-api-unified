# AGENTS.md — quran-api-unified

Instructions for any AI coding agent working in this repo. Read this first, every session.

## What this is

A framework-agnostic JavaScript/TypeScript SDK that puts one consistent interface over
multiple Quran verse, audio, translation, and tafsir APIs, with provider selection and
automatic fallback, so a consuming app never has to know or care which provider served a
request.

Users: developers building Quran apps (web, mobile, bots, backends) in JS or TS who don't
want to hard-couple their app to a single provider or juggle several providers' different
schemas. Core job: given a reference (ayah or surah) plus the pieces the caller asks for
(text, audio, translation, tafsir), fetch each from whatever provider is suitable/available,
normalize everything into one unified schema, and return it in a single call.

Kind: **npm library (SDK)** — no UI, no framework, no database. Data comes from remote HTTP
APIs. The deploy target is the **npm registry**; the runtime is the *consumer's* runtime
(Node ≥18, browsers, Deno, Bun), so the library stays side-effect-free and dependency-light.

## Documentation language (important)

The library's **product documentation** is **Arabic-primary, English-mirror**: `README.md`
is Arabic (the npm/GitHub default view) with `README.en.md` alongside; the VitePress docs
site, `CONTRIBUTING.md`, and `docs/providers/*.md` follow the same pairing. Author Arabic
**natively** in correct, natural فصحى — never a literal English→Arabic translation; write
Arabic first, then render the English mirror. The **code stays English** (identifiers, error
codes, error messages). These engineering docs (AGENTS/architecture/workflow/CONVENTIONS/ADRs)
are English — they are the build plan, not product docs.

## The one workflow

Every piece of work — a new adapter, a core feature, a fix — follows the 8-phase loop in
[`docs/workflow.md`](./docs/workflow.md), from spec intake to a verified npm release.
**Read it at the start of every session.** No shortcuts, no reordering.

## Where decisions live (do not re-litigate locked ones)

| Question | Source of truth |
| --- | --- |
| What the library does and why | `docs/product/spec.md` |
| Stack details & code patterns | `docs/stack.md` |
| Architecture & module boundaries | `docs/architecture.md` + ADRs |
| Code conventions | `CONVENTIONS.md` |
| All locked decisions & rationale | `docs/adr/` |
| Tickets & backlog | `docs/backlog.md` |
| How to run locally | `docs/run-locally.md` |
| How to add a provider adapter | `CONTRIBUTING.md` + `docs/providers/<id>.md` |

If a design question is not answered in any of the above, it has not been decided: that is a
conversation with the user (and likely a new ADR) — never an assumption to code around.

## Non-negotiables (summary — details in the docs above)

- **Ports-and-adapters + purity boundary.** Adapters and pure `core/{compose,select,schema,
  result}` must never import `core/http.ts`. Adapters are declarative (`buildUrl` + a pure
  `transform`); only the client's fetch layer touches the network.
- **`core` stays dependency-free.** Nothing in `dependencies`. `zod` is an optional peer,
  used only from the `./zod` entry.
- **Typed results, not exceptions.** `get()` returns `{ ok:true, value, attempts } |
  { ok:false, error, attempts }`; provider/network failures are data; only misuse throws.
- **Silent library.** No `console.*` in committed code; diagnostics ride the typed result or
  an injected logger hook.
- **TSDoc on every public export** — it feeds the API reference; nothing public ships without it.
- **Tests ship in the same PR** (CI-enforced); a **Changeset** accompanies every user-facing change.
- **Git discipline:** never `git add -A`; never commit `.env`/artifacts; never `--no-verify`.
