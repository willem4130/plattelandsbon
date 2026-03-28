export const DiscountType = {
  CASH: 'CASH',
  PERCENTAGE: 'PERCENTAGE',
  PRODUCT: 'PRODUCT',
  SERVICE: 'SERVICE',
} as const

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType]
