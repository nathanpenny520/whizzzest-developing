import { describe, it, expect } from 'vitest'
import { UserRole } from '../user.js'

describe('UserRole enum', () => {
  it('has three roles', () => {
    expect(UserRole.TOURIST).toBe('TOURIST')
    expect(UserRole.MERCHANT).toBe('MERCHANT')
    expect(UserRole.ADMIN).toBe('ADMIN')
  })
})
