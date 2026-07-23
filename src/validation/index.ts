/**
 * Optional validation entry, published as `quran-api-unified/zod`.
 *
 * `zod` is an **optional peer dependency** — importing the library core never pulls it
 * in; only consumers who import this entry need it installed. The zod schemas mirroring
 * the unified types (plus `parse` / `safeParse` helpers) land in a later ticket; this
 * placeholder keeps the second package entry built and validated by the pipeline now.
 */

/** Marks whether the zod validation schemas are wired up yet. */
export const ZOD_ENTRY_READY = false
