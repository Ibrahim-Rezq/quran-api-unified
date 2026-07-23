// Dual-consumption smoke: proves the built artifact resolves as ESM, as CJS, and that
// the type declarations are present, for both the `.` and `./zod` entries. The browser
// bundle check (Playwright) is added with the examples in a later ticket. Run after build.
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')

const failures = []

function check(label, cond) {
  if (cond) {
    console.log(`  ok   ${label}`)
  } else {
    console.error(`  FAIL ${label}`)
    failures.push(label)
  }
}

// Type declarations for every published condition.
for (const f of ['index.d.ts', 'index.d.cts', 'zod.d.ts', 'zod.d.cts']) {
  check(`types present: ${f}`, existsSync(resolve(dist, f)))
}

// ESM consumption.
const esm = await import(resolve(dist, 'index.js'))
check('ESM import exposes VERSION', esm.VERSION === '0.0.0')
const esmZod = await import(resolve(dist, 'zod.js'))
check('ESM import of ./zod entry', esmZod.ZOD_ENTRY_READY === false)

// CJS consumption.
const cjs = require(resolve(dist, 'index.cjs'))
check('CJS require exposes VERSION', cjs.VERSION === '0.0.0')
const cjsZod = require(resolve(dist, 'zod.cjs'))
check('CJS require of ./zod entry', cjsZod.ZOD_ENTRY_READY === false)

if (failures.length > 0) {
  console.error(`\nsmoke:bundle FAILED (${failures.length}):`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log('\nsmoke:bundle passed — ESM + CJS + types resolve for both entries.')
