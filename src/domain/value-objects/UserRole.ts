export const UserRole = {
  CONSUMER: 'CONSUMER',
  BUSINESS: 'BUSINESS',
  ADMIN: 'ADMIN',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
