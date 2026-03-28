export const VoucherStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
  REJECTED: 'REJECTED',
} as const

export type VoucherStatus = (typeof VoucherStatus)[keyof typeof VoucherStatus]
