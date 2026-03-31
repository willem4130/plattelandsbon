import type { PrismaClient } from '@prisma/client'
import type { TransactionContext } from '@/domain/types'

export type PrismaTransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0]

export abstract class BaseRepository<TEntity, TPrismaRecord> {
  constructor(protected readonly prisma: PrismaClient) {}

  protected abstract toDomain(record: TPrismaRecord): TEntity

  protected getClient(tx?: TransactionContext): PrismaClient {
    return ((tx as PrismaTransactionClient | undefined) ?? this.prisma) as PrismaClient
  }

  protected mapOrNull(record: TPrismaRecord | null): TEntity | null {
    return record ? this.toDomain(record) : null
  }

  protected mapMany(records: TPrismaRecord[]): TEntity[] {
    return records.map((r) => this.toDomain(r))
  }
}
