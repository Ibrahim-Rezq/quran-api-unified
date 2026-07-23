/**
 * The I/O leaf — the ONLY module in the library that is allowed to touch the network.
 *
 * Import-boundary target: adapters and the pure core (`compose` / `select`) must never
 * import this file (enforced by ESLint). Only the client's fetch layer wires it in.
 * The concrete fetch implementation lands in a later ticket; this declares the shape.
 */

/** A minimal `fetch`-compatible function; injected so the library stays runtime-agnostic. */
export type FetchLike = typeof globalThis.fetch

/** Dependencies the I/O leaf needs, supplied by the client (never read from globals here). */
export interface HttpDeps {
  /** The fetch implementation to use (defaults resolved at the client layer). */
  fetchImpl: FetchLike
  /** Per-request timeout in milliseconds. */
  timeoutMs: number
}
