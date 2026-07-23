# ADR-0004 — Provider selection strategy (v1)

- **Status:** accepted
- **Date:** 2026-07-23

## Context

The library must pick a provider per concern and fall back when one fails, while letting a
caller override the choice. The user described wanting "the fastest/most suitable" provider,
but latency-racing and health tracking add real complexity.

## Decision

v1 selection is **ordered preference + fallback-on-error**, per concern, with concerns
fanned out **in parallel** and a per-request timeout. Auto mode uses the registration/
preference order; explicit mode lets the caller name a source with an optional own fallback
list, or defer the chain to the SDK. **Fastest / health-aware routing is deferred** to a
later version.
_Rejected (for v1):_ latency racing / health scoring (needs measurement + caching; premature
before real usage data).

## Consequences

Behavior is deterministic and easy to test (property-based over success/fail patterns). The
`select()` function is pure and pluggable, so a smarter strategy can slot in later without
changing the adapter or client contracts.
