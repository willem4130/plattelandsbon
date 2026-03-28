/**
 * Opaque transaction handle — infrastructure casts this to its concrete type.
 * Domain layer never knows it's Prisma underneath.
 */
export type TransactionContext = unknown

export interface PaginationOptions {
  skip?: number
  take?: number
}

export interface ITransactionManager {
  run<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T>
}
