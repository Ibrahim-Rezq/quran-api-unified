# ADR-0007 — Testing strategy

- **Status:** accepted
- **Date:** 2026-07-23

## Context

The library normalizes messy, changing external APIs and must stay correct across module
formats and runtimes. Tests must be fast and deterministic offline, yet still catch upstream
drift and packaging regressions.

## Decision

Pure `core/*` and adapter `transform`s are tested table-driven with **zero mocks**; adapter
transforms run against **recorded real-response fixtures**. I/O (`http`/`client`) is tested
with an **injected fake `fetch`** — no network-mock library, since `fetch` is injectable.
Two extra suites: an **opt-in live smoke** (`pnpm test:live`) that hits real providers to
detect fixture drift (not in blocking CI), and a **cross-runtime/bundle smoke** that imports
the built artifact as ESM/CJS/types and drives the browser bundle via Playwright — this one
**gates release**. Colocated tests, CI-enforced; no numeric coverage gate; property-based
tests for selection/fallback.
_Rejected:_ mocking `fetch` with a library (unnecessary given injection); live calls in the
default suite (network-flaky); a numeric coverage threshold (colocation + review preferred).

## Consequences

The default suite is deterministic and offline. Fixtures are the source of truth and must be
refreshed when a provider changes; the scheduled live smoke is what flags that. Mandatory test
paths (fallback, partial-results, credentialed adapter, custom adapter, dual-consumption) must
always have a test when touched.
