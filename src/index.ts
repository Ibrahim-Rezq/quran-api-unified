/**
 * `quran-api-unified` — one consistent interface over multiple Quran text, audio,
 * translation, and tafsir providers, with provider selection and automatic fallback.
 *
 * This is the public API surface (named exports only; no default export). The real
 * client, schema, and adapters land in later tickets — this bootstrap ships a green,
 * publishable skeleton so the release pipeline is proven end to end first.
 *
 * @packageDocumentation
 */

/**
 * Library version marker. Superseded by the client API in a later ticket; present so
 * the packaged surface is non-empty and consumers can sanity-check their install.
 */
export const VERSION = '0.0.0'
