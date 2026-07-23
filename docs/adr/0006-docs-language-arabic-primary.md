# ADR-0006 — Documentation language: Arabic-primary, English mirror

- **Status:** accepted
- **Date:** 2026-07-23

## Context

The library's primary audience is Arabic-speaking developers, and the maintainer wants the
project to be genuinely approachable in Arabic, while still serving a global contributor base
that needs English.

## Decision

The library's **product documentation** is **Arabic-primary with an English mirror**:
`README.md` is Arabic (the npm/GitHub default view) with `README.en.md` alongside; the
VitePress site (`ar` default locale, `dir: rtl`, `en` secondary), `CONTRIBUTING.md`, and
`docs/providers/*.md` follow the same pairing. Arabic is **authored natively** in correct,
natural فصحى — never a literal English→Arabic translation; Arabic first, English rendered from
it. The **code stays English** (identifiers, error codes, error messages), and the internal
engineering docs (this ADR set, architecture, workflow, conventions) are English.
_Rejected:_ English-only docs (excludes the primary audience); Arabic-only (excludes global
contributors); Arabic runtime messages (unusual for an npm library, heavier to maintain).

## Consequences

Every shipped product doc exists as a native Arabic file plus an English mirror, gated in CI.
Contributors adding a provider write both the Arabic provider doc and its English mirror. URLs,
code, JSON, and CLI commands stay LTR-English even inside Arabic files.
