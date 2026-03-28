import type { PrismaClient } from '@prisma/client'
import type { ITransactionManager, TransactionContext } from '@/domain/types'

export class PrismaTransactionManager implements ITransactionManager {
  constructor(private prisma: PrismaClient) {}

  async run<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (prismaTx) => {
      return fn(prismaTx as TransactionContext)
    })
  }
}
