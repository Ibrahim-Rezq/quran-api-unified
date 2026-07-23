import { describe, expect, it } from 'vitest'

import { VERSION } from '../src/index.js'

describe('skeleton', () => {
  it('exposes a VERSION marker on the public surface', () => {
    expect(VERSION).toBe('0.0.0')
  })
})
