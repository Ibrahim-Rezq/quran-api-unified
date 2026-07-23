# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets). Every
user-facing change ships with a changeset describing the change and its SemVer bump.

Add one with:

```bash
pnpm changeset
```

The Changesets GitHub Action keeps a **"Version Packages"** PR open on `main` that bumps the
version and writes `CHANGELOG.md`. Merging that PR publishes the new version to npm via
trusted publishing (OIDC). Pre-1.0: breaking changes bump the MINOR.
