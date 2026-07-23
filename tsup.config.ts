import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    zod: 'src/validation/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' }
  },
})
