export const ClaimStatus = {
  CLAIMED: 'CLAIMED',
  REDEEMED: 'REDEEMED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus]
