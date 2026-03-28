export const BusinessStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  SUSPENDED: 'SUSPENDED',
  REJECTED: 'REJECTED',
} as const

export type BusinessStatus = (typeof BusinessStatus)[keyof typeof BusinessStatus]
