# ADR-0008 — CI/CD, branching, and release

- **Status:** accepted
- **Date:** 2026-07-23

## Context

This is a published open-source package with outside contributors. A library has no staging or
production URLs; its release is a publish to npm, and versioning/changelog must be reliable and
contributor-friendly.

## Decision

**Trunk-based** branching: short-lived feature branches merge to `main`. Releases use
**Changesets** — a contributor adds a changeset; the bot maintains a "Version Packages" PR
that bumps SemVer and writes `CHANGELOG.md`; merging it publishes to npm (`changeset publish`)
with provenance. dist-tags: `latest` and `next`. CI (one check each, all required):
`lint` · `typecheck` · `test` · `build` · `package-validate` (publint + attw) ·
`bundle-runtime-smoke` · `colocated-test-check` · `docs-build`, across a Node 18/20/22 matrix.
A separate scheduled workflow runs the live-provider smoke (non-blocking). The package ships
**no telemetry**.
_Rejected:_ feature→dev→master (the dev tier is ceremony without a staging deploy); manual
SemVer bumps (more maintainer toil, hand-written changelog); embedding analytics/error
tracking (a library must never phone home).

## Consequences

Contributors get an automated, reviewable release path. Every user-facing change needs a
Changeset (a hard-stop in review). Publishing requires an `NPM_TOKEN` CI secret. The
"production eyes" are the scheduled live smoke plus CI badges and npm download stats.
