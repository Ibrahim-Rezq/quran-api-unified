import { defineConfig } from 'vitest/config'

// Opt-in live smoke: hits real providers to detect upstream drift vs the recorded
// fixtures. NOT part of the blocking CI (network-flaky) — run via `pnpm test:live`
// or the scheduled Live Smoke workflow. Passes cleanly until live specs exist.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/live/**/*.live.test.ts'],
    passWithNoTests: true,
    testTimeout: 20_000,
  },
})
