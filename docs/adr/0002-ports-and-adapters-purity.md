# ADR-0002 — Ports-and-adapters architecture with a purity boundary

- **Status:** accepted
- **Date:** 2026-07-23

## Context

The whole value of the library is decoupling consumers from any single Quran provider.
Providers differ in endpoints and response shapes and must be swappable without touching
consuming code, and contributors must be able to add providers in isolation.

## Decision

Adopt **ports-and-adapters**: a provider-agnostic core (compose, select, schema, result), one
port (the `Adapter` contract), and swappable adapters. Adapters are **declarative** — a
`buildUrl` recipe plus a **pure** `transform` — and only `client.ts`/`core/http.ts` perform
I/O. A lint-enforced import boundary forbids pure logic (`adapters/*`,
`core/{compose,select,schema,result}`) from importing `core/http.ts`.
_Rejected:_ app-style feature-folders (weaker boundaries, less testable for a library whose
core value is the boundary itself).

## Consequences

Transforms are pure and trivially unit-testable against fixtures; adding a provider is a
localized change. The boundary is verified during bootstrap with a deliberate bad import. A
new adapter must not reach for the network — it only describes calls.
