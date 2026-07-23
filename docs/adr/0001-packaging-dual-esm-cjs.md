# ADR-0001 — Dual ESM + CJS + types packaging, zero-dependency core

- **Status:** accepted
- **Date:** 2026-07-23

## Context

The library must be usable from both JavaScript and TypeScript, and across Node, browsers,
Deno, and Bun. It is a foundational SDK many apps will embed, so install weight and
supply-chain surface matter.

## Decision

Build with **tsup** to **dual ESM + CJS** plus `.d.ts`, exposed through an `exports` map
(`.` and `./zod`), `type: module`, `sideEffects: false`. The **core ships zero runtime
dependencies**; `zod` is an optional peer dependency used only from the `./zod` entry.
Package correctness is gated by `publint` + `@arethetypeswrong/cli`.
_Rejected:_ ESM-only (excludes CJS consumers); bundling a runtime HTTP client (adds weight —
native `fetch` is used instead); shipping `zod` in the core (forces it on every consumer).

## Consequences

Every consumer, regardless of module system or runtime, gets working imports and types. The
build and CI must verify both formats resolve (the classic dual-format types trap). No Node
built-ins may be used in `src`, to keep the browser build clean. Adding anything to
`dependencies` is a hard-stop in review.
