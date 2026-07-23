# ADR-0003 — Typed results instead of thrown exceptions

- **Status:** accepted
- **Date:** 2026-07-23

## Context

A single call may fan out to several providers per concern, any of which can fail, and one
concern can succeed while another has no available provider. Consumers need failures and
partial success to be explicit and inspectable, not hidden in thrown exceptions.

## Decision

Fetch operations return a discriminated union: `get()` returns `{ ok:true, value, attempts }
| { ok:false, error, attempts }`. Each concern part carries its own `ok`/`error`/`source`/
`attempts`, making **partial results first-class**. Provider/network failures are **data**;
only _misuse_ (bad config, an unknown _named_ adapter) throws.
_Rejected:_ throw-based API (clashes with partial-results and the user's typed-results
preference); a dual throw + `.safe()` surface (more API to document for little gain in v1).

## Consequences

Every call site checks `ok`, but gains a complete, typed picture of what happened, including
the per-provider attempt trail. Raw upstream exceptions never leak. An optional `./zod` entry
can parse/validate results for callers who want runtime guarantees.
