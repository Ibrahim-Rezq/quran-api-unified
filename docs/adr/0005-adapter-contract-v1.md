# ADR-0005 — Adapter contract (v1) and credentials

- **Status:** accepted
- **Date:** 2026-07-23

## Context

Providers are added by the maintainers and by outside contributors. The contract they
implement must be small, pure, testable, and open to extension, and it must accommodate both
keyless providers and ones that require credentials.

## Decision

An adapter declares a unique snake_case `id`, a `name`, `capabilities`, an `auth` marker, and
per concern a `{ buildUrl(q, ctx), transform(raw, q, ctx), responseType?, useProxy?, headers? }`
where `transform` is **pure**. Consumers register their own via `registerAdapter()`.
Credentials are **keyless by default**; a caller supplies them per adapter id via options; an
adapter needing absent credentials is **skipped in auto-selection** and **throws only if named
explicitly**. Adapters never read `process.env`.
_Rejected:_ class-based adapters (violates functions-only); requiring credentials up front
(worst DX for the open providers).

## Consequences

Adding a provider is a localized, well-scoped task (fixture → provider doc → adapter → tests →
changeset). The keyless happy path needs zero config. Changing this contract is a breaking
change and needs a new ADR.
