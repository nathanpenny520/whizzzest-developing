import { describe, it, expect } from 'vitest'
import { UserRole, type IUser } from '../user.js'

describe('UserRole enum', () => {
  it('has three roles', () => {
    expect(UserRole.TOURIST).toBe('TOURIST')
    expect(UserRole.MERCHANT).toBe('MERCHANT')
    expect(UserRole.ADMIN).toBe('ADMIN')
  })
})

describe('IUser type', () => {
  it('accepts a valid user object', () => {
    const user: IUser = {
      id: 'uuid-123',
      nickname: '测试用户',
      role: UserRole.TOURIST,
      createdAt: new Date(),
    }
    expect(user.id).toBe('uuid-123')
    expect(user.nickname).toBe('测试用户')
  })
})
